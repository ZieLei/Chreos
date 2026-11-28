import express from "express";
import cors from "cors";
import { eq, sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { debtors, debts, payments } from "./db/schema.js";
import type { DebtStatus } from "./types/types.js";
import {
  ALGORITHM,
  ENCRYPTED_FIELDS,
  decryptDebtor,
  encryptDebtor,
} from "./crypto.js";
import {
  clearFailedAttempts,
  createSession,
  deleteSession,
  lockoutRemaining,
  recordFailedAttempt,
  requireAuth,
  verifySecret,
} from "./auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Trims strings and turns empty values into null so optional columns stay clean.
const text = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

const positiveAmount = (value: unknown): number | null => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const parseDebtor = (body: Record<string, unknown>) => {
  const firstName = text(body.firstName);
  const lastName = text(body.lastName);
  const birthday = text(body.birthday);

  if (!firstName || !lastName || !birthday) {
    return { error: "First name, last name and birthday are required" };
  }

  return {
    data: {
      picture: text(body.picture),
      firstName,
      lastName,
      birthday,
      phoneNumber: text(body.phoneNumber),
      email: text(body.email),
      facebook: text(body.facebook),
    },
  };
};

const parseDebt = (body: Record<string, unknown>) => {
  const amount = positiveAmount(body.amount);
  const createdAt = text(body.createdAt);

  if (!amount) return { error: "Amount must be greater than 0" };
  if (!createdAt) return { error: "Date is required" };

  return { data: { amount, createdAt, dueDate: text(body.dueDate) } };
};

const totalPaid = (debtId: number): number =>
  db
    .select({ total: sql<number>`coalesce(sum(${payments.amount}), 0)` })
    .from(payments)
    .where(eq(payments.debtId, debtId))
    .get()?.total ?? 0;

// Status follows the payments made against the debt. OVERDUE is kept as long
// as nothing has been paid yet.
const syncDebtStatus = (debtId: number) => {
  const debt = db.select().from(debts).where(eq(debts.id, debtId)).get();
  if (!debt) return;

  const paid = totalPaid(debtId);

  let status: DebtStatus = debt.status === "OVERDUE" ? "OVERDUE" : "UNPAID";
  if (paid >= debt.amount) status = "PAID";
  else if (paid > 0) status = "PARTIAL";

  db.update(debts).set({ status }).where(eq(debts.id, debtId)).run();
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

// ---------- Auth ----------

app.post("/api/login", (req, res) => {
  const client = req.ip ?? "unknown";
  const wait = lockoutRemaining(client);

  if (wait > 0) {
    res.status(429).json({
      message: `Too many attempts, try again in ${Math.ceil(wait / 1000)}s`,
    });
    return;
  }

  const secret = req.body?.secret;

  if (typeof secret !== "string" || !verifySecret(secret)) {
    recordFailedAttempt(client);
    res.status(401).json({ message: "Access denied" });
    return;
  }

  clearFailedAttempts(client);
  res.json(createSession());
});

// Everything registered below needs a valid session
app.use("/api", requireAuth);

app.get("/api/session", (_req, res) => {
  res.json({ status: "OK" });
});

app.post("/api/logout", (_req, res) => {
  deleteSession(res.locals.token);
  res.status(204).end();
});

// What the frontend header shows, so it reflects the real setup
app.get("/api/crypto", (_req, res) => {
  res.json({
    algorithm: ALGORITHM.toUpperCase(),
    encryptedFields: ENCRYPTED_FIELDS,
  });
});

// ---------- Debtors ----------

app.get("/api/debtors/:id", (req, res) => {
  const id = Number(req.params.id);

  const debtor = db.select().from(debtors).where(eq(debtors.id, id)).get();

  if (!debtor) {
    res.status(404).json({
      message: "Debtor not found",
    });
    return;
  }

  res.json(decryptDebtor(debtor));
});

app.get("/api/debtors", (_req, res) => {
  res.json(db.select().from(debtors).all().map(decryptDebtor));
});

app.post("/api/debtors", (req, res) => {
  const { data, error } = parseDebtor(req.body ?? {});

  if (!data) {
    res.status(400).json({ message: error });
    return;
  }

  const debtor = db
    .insert(debtors)
    .values(encryptDebtor(data))
    .returning()
    .get();

  res.status(201).json(decryptDebtor(debtor));
});

app.put("/api/debtors/:id", (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = parseDebtor(req.body ?? {});

  if (!data) {
    res.status(400).json({ message: error });
    return;
  }

  const debtor = db
    .update(debtors)
    .set(encryptDebtor(data))
    .where(eq(debtors.id, id))
    .returning()
    .get();

  if (!debtor) {
    res.status(404).json({ message: "Debtor not found" });
    return;
  }

  res.json(decryptDebtor(debtor));
});

app.delete("/api/debtors/:id", (req, res) => {
  const id = Number(req.params.id);

  // Debts and payments go with it through ON DELETE CASCADE.
  const debtor = db.delete(debtors).where(eq(debtors.id, id)).returning().get();

  if (!debtor) {
    res.status(404).json({ message: "Debtor not found" });
    return;
  }

  res.status(204).end();
});

// ---------- Debts ----------

app.get("/api/debtors/:debtorId/debts", (req, res) => {
  const debtorId = Number(req.params.debtorId);

  res.json(db.select().from(debts).where(eq(debts.debtorId, debtorId)).all());
});

app.get("/api/debts/", (_req, res) => {
  res.json(db.select().from(debts).all());
});

app.post("/api/debtors/:debtorId/debts", (req, res) => {
  const debtorId = Number(req.params.debtorId);
  const { data, error } = parseDebt(req.body ?? {});

  if (!data) {
    res.status(400).json({ message: error });
    return;
  }

  const debtor = db
    .select()
    .from(debtors)
    .where(eq(debtors.id, debtorId))
    .get();

  if (!debtor) {
    res.status(404).json({ message: "Debtor not found" });
    return;
  }

  res.status(201).json(
    db
      .insert(debts)
      .values({ ...data, debtorId, status: "UNPAID" })
      .returning()
      .get(),
  );
});

app.put("/api/debts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = parseDebt(req.body ?? {});

  if (!data) {
    res.status(400).json({ message: error });
    return;
  }

  const debt = db
    .update(debts)
    .set(data)
    .where(eq(debts.id, id))
    .returning()
    .get();

  if (!debt) {
    res.status(404).json({ message: "Debt not found" });
    return;
  }

  // A new amount can change whether the debt is now fully paid.
  syncDebtStatus(id);

  res.json(db.select().from(debts).where(eq(debts.id, id)).get());
});

app.delete("/api/debts/:id", (req, res) => {
  const id = Number(req.params.id);

  const debt = db.delete(debts).where(eq(debts.id, id)).returning().get();

  if (!debt) {
    res.status(404).json({ message: "Debt not found" });
    return;
  }

  res.status(204).end();
});

// ---------- Payments ----------

app.get("/api/payments", (_req, res) => {
  res.json(db.select().from(payments).all());
});

app.get("/api/debtors/:debtorId/payments", (req, res) => {
  const debtorId = Number(req.params.debtorId);

  res.json(
    db.select().from(payments).where(eq(payments.debtorId, debtorId)).all(),
  );
});

app.post("/api/debts/:debtId/payments", (req, res) => {
  const debtId = Number(req.params.debtId);
  const body = req.body ?? {};
  const amount = positiveAmount(body.amount);
  const paidAt = text(body.paidAt);

  if (!amount) {
    res.status(400).json({ message: "Amount must be greater than 0" });
    return;
  }

  if (!paidAt) {
    res.status(400).json({ message: "Payment date is required" });
    return;
  }

  const debt = db.select().from(debts).where(eq(debts.id, debtId)).get();

  if (!debt) {
    res.status(404).json({ message: "Debt not found" });
    return;
  }

  const remaining = debt.amount - totalPaid(debtId);

  if (amount > remaining) {
    res
      .status(400)
      .json({ message: `Amount is more than the remaining ${remaining}` });
    return;
  }

  const payment = db
    .insert(payments)
    .values({
      debtorId: debt.debtorId,
      debtId,
      amount,
      paidAt,
      method: text(body.method)?.toUpperCase() ?? null,
    })
    .returning()
    .get();

  syncDebtStatus(debtId);

  res.status(201).json(payment);
});

app.delete("/api/payments/:id", (req, res) => {
  const id = Number(req.params.id);

  const payment = db
    .delete(payments)
    .where(eq(payments.id, id))
    .returning()
    .get();

  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }

  syncDebtStatus(payment.debtId);

  res.status(204).end();
});

// Express 5 forwards thrown errors here. A failed decrypt means the stored
// value was tampered with or ENCRYPTION_KEY changed.
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);

    const decryptFailed = err.message.includes("unable to authenticate data");
    res.status(500).json({
      message: decryptFailed
        ? "Could not decrypt record: data was tampered with or the key changed"
        : "Something went wrong",
    });
  },
);

export default app;
