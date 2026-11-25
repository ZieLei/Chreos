import express from "express";
import cors from "cors";
import type { Debt, Debtor } from "./types/types.js";

const app = express();

app.use(cors());
app.use(express.json());

const debtors: Debtor[] = [
  {
    id: 1,
    picture: "../../samples/shimamura.png",
    firstName: "Hougetsu",
    lastName: "Shimamura",
    birthday: "10-04-2005",
    phoneNumber: "09123456789",
    email: "iloveadachi@gmail.com",
    facebook: "Shimamura Hougetsu",
    lastReminded: "14-08-2026",
  },
  {
    id: 2,
    picture: "../../samples/adachi.png",
    firstName: "Sakura",
    lastName: "Adachi",
    birthday: "10-10-2005",
    phoneNumber: "09123456789",
    email: "shimamuraismylife@gmail.com",
    facebook: "Adachi Sakura",
  },
];

const debts: Debt[] = [
  {
    id: 1,
    debtorId: 1,
    amount: 500,
    createdAt: "11-01-2026",
    status: "UNPAID",
  },
  {
    id: 2,
    debtorId: 1,
    amount: 1200,
    createdAt: "11-05-2026",
    dueDate: "12-01-2026",
    status: "PARTIAL",
  },
  {
    id: 3,
    debtorId: 1,
    amount: 1000,
    createdAt: "09-25-2026",
    dueDate: "11-01-2026",
    status: "PAID",
  },
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/debtors/:id", (req, res) => {
  const id = Number(req.params.id);

  const debtor = debtors.find((debtor) => debtor.id === id);

  if (!debtor) {
    res.status(404).json({
      message: "Debtor not found",
    });
    return;
  }

  res.json(debtor);
});

app.get("/api/debtors", (_req, res) => {
  res.json(debtors);
});

app.get("/api/debtors/:debtorId/debts", async (req, res) => {
  const id = Number(req.params.debtorId);

  const debt = debts.filter((debt) => debt.debtorId === id);

  if (!debt) {
    res.status(404).json({
      message: "Debt not found",
    });
    return;
  }

  res.json(debt);
});

app.get("/api/debts/", (_req, res) => {
  res.json(debts);
});

export default app;
