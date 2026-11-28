import { db } from "./index.js";
import { debtors, debts, payments } from "./schema.js";
import type { NewDebt, NewDebtor, NewPayment } from "../types/types.js";
import { encryptDebtor } from "../crypto.js";

const seedDebtors: NewDebtor[] = [
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

const seedDebts: NewDebt[] = [
  { id: 1, debtorId: 1, amount: 500, createdAt: "11-01-2026", status: "UNPAID" },
  { id: 2, debtorId: 1, amount: 1200, createdAt: "11-05-2026", dueDate: "12-01-2026", status: "PARTIAL" },
  { id: 3, debtorId: 1, amount: 1000, createdAt: "09-25-2026", dueDate: "11-01-2026", status: "PAID" },
  { id: 4, debtorId: 2, amount: 700, createdAt: "10-01-2026", dueDate: "12-01-2026", status: "UNPAID" },
  { id: 5, debtorId: 2, amount: 300, createdAt: "08-20-2026", status: "PAID" },
];

const seedPayments: NewPayment[] = [
  { id: 1, debtorId: 1, debtId: 2, amount: 200, paidAt: "2026-11-01", method: "CASH" },
  { id: 2, debtorId: 1, debtId: 3, amount: 500, paidAt: "2026-10-25", method: "GCASH" },
  { id: 3, debtorId: 1, debtId: 3, amount: 500, paidAt: "2026-10-20", method: "BANK" },
  { id: 4, debtorId: 2, debtId: 4, amount: 150, paidAt: "2026-11-01", method: "CASH" },
  { id: 5, debtorId: 2, debtId: 5, amount: 150, paidAt: "2026-10-25", method: "GCASH" },
];

// Wipe and re-insert in one transaction so the seed is safe to re-run.
db.transaction((tx) => {
  tx.delete(payments).run();
  tx.delete(debts).run();
  tx.delete(debtors).run();

  tx.insert(debtors).values(seedDebtors.map(encryptDebtor)).run();
  tx.insert(debts).values(seedDebts).run();
  tx.insert(payments).values(seedPayments).run();
});

console.log(
  `Seeded ${seedDebtors.length} debtors, ${seedDebts.length} debts, ${seedPayments.length} payments.`,
);
