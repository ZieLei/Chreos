import type { Debtor } from "../types/types";

const API_URL = "http://localhost:8000/api";

export const getDebtors = async (): Promise<Debtor[]> => {
  const response = await fetch(`${API_URL}/debtors`);

  if (!response.ok) {
    throw new Error("Failed to fetch debtors");
  }

  return response.json();
};

export const getDebtor = async (id: number): Promise<Debtor> => {
  const response = await fetch(`${API_URL}/debtors/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch debtor");
  }

  return response.json();
};
