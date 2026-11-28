import type { Payment, PaymentInput } from "../types/types";
import { errorMessage } from "./error";

const API_URL = "http://localhost:8000/api";

export const getPayments = async (debtorId: number): Promise<Payment[]> => {
  const response = await fetch(`${API_URL}/debtors/${debtorId}/payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
};

export const createPayment = async (
  debtId: number,
  payment: PaymentInput,
): Promise<Payment> => {
  const response = await fetch(`${API_URL}/debts/${debtId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to add payment"));
  }

  return response.json();
};

export const deletePayment = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to delete payment"));
  }
};
