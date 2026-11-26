import type { debtors, debts, payments } from "../db/schema.js";

// Derived from the Drizzle schema so they can't drift from the tables.
// Note: nullable columns come through as `T | null` rather than `T | undefined`.
export type Debtor = typeof debtors.$inferSelect;
export type NewDebtor = typeof debtors.$inferInsert;

export type Debt = typeof debts.$inferSelect;
export type NewDebt = typeof debts.$inferInsert;
export type DebtStatus = Debt["status"];

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
