import express from "express";
import cors from "cors";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { debtors, debts, payments } from "./db/schema.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/debtors/:id", (req, res) => {
  const id = Number(req.params.id);

  const debtor = db.select().from(debtors).where(eq(debtors.id, id)).get();

  if (!debtor) {
    res.status(404).json({
      message: "Debtor not found",
    });
    return;
  }

  res.json(debtor);
});

app.get("/api/debtors", (_req, res) => {
  res.json(db.select().from(debtors).all());
});

app.get("/api/debtors/:debtorId/debts", (req, res) => {
  const debtorId = Number(req.params.debtorId);

  res.json(db.select().from(debts).where(eq(debts.debtorId, debtorId)).all());
});

app.get("/api/debts/", (_req, res) => {
  res.json(db.select().from(debts).all());
});

app.get("/api/debtors/:debtorId/payments", (req, res) => {
  const debtorId = Number(req.params.debtorId);

  res.json(
    db.select().from(payments).where(eq(payments.debtorId, debtorId)).all(),
  );
});

export default app;
