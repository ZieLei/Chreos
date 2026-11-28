import type { Debt, Payment } from "../types/types";

export interface DebtorBalance {
  owed: number;
  openDebts: number;
}

// What each debtor still owes: every unpaid debt minus what was already paid on it
export function getBalances(
  debts: Debt[],
  payments: Payment[],
): Map<number, DebtorBalance> {
  const paidPerDebt = new Map<number, number>();
  for (const p of payments) {
    paidPerDebt.set(p.debtId, (paidPerDebt.get(p.debtId) ?? 0) + p.amount);
  }

  const balances = new Map<number, DebtorBalance>();
  for (const d of debts) {
    if (d.status === "PAID") continue;

    const remaining = Math.max(d.amount - (paidPerDebt.get(d.id) ?? 0), 0);
    const balance = balances.get(d.debtorId) ?? { owed: 0, openDebts: 0 };

    balances.set(d.debtorId, {
      owed: balance.owed + remaining,
      openDebts: balance.openDebts + 1,
    });
  }

  return balances;
}
