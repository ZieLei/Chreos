import type { Payment } from "../types/types";

const API_URL = "http://localhost:8000/api";

export const getPayments = async (debtorId: number): Promise<Payment[]> => {
  const response = await fetch(`${API_URL}/debtors/${debtorId}/payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
};
