import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const debtors = sqliteTable("debtors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  picture: text("picture"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthday: text("birthday").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email"),
  facebook: text("facebook"),
  lastReminded: text("last_reminded"),
});

export const debts = sqliteTable("debts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  debtorId: integer("debtor_id")
    .notNull()
    .references(() => debtors.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  createdAt: text("created_at").notNull(),
  dueDate: text("due_date"),
  status: text("status", { enum: ["UNPAID", "PAID", "PARTIAL", "OVERDUE"] })
    .notNull()
    .default("UNPAID"),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  debtorId: integer("debtor_id")
    .notNull()
    .references(() => debtors.id, { onDelete: "cascade" }),
  debtId: integer("debt_id")
    .notNull()
    .references(() => debts.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paidAt: text("paid_at").notNull(),
  method: text("method"),
});

// Login sessions. Only a SHA-256 hash of the token is stored, so a leaked
// database file can't be used to log in.
export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tokenHash: text("token_hash").notNull().unique(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

// Relations power the nested `db.query.x.findMany({ with: { ... } })` API.
export const debtorsRelations = relations(debtors, ({ many }) => ({
  debts: many(debts),
  payments: many(payments),
}));

export const debtsRelations = relations(debts, ({ one, many }) => ({
  debtor: one(debtors, { fields: [debts.debtorId], references: [debtors.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  debtor: one(debtors, {
    fields: [payments.debtorId],
    references: [debtors.id],
  }),
  debt: one(debts, { fields: [payments.debtId], references: [debts.id] }),
}));
