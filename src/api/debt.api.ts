import type { Debt } from "../types/types";

const API_URL = "http://localhost:8000/api";

export const getDebts = async (): Promise<Debt[]> => {
  const response = await fetch(`${API_URL}/debts`);

  if (!response.ok) {
    throw new Error("Failed to fetch debts");
  }

  return response.json();
};

export const getDebt = async (debtorId: number): Promise<Debt[]> => {
  const response = await fetch(`${API_URL}/debtors/${debtorId}/debts`);

  if (!response.ok) {
    throw new Error("Failed to fetch debts");
  }

  return response.json();
};
