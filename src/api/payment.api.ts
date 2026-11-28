import type { Payment, PaymentInput } from "../types/types";
import { apiFetch } from "./client";
import { errorMessage } from "./error";

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await apiFetch(`/payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
};

export const getPayments = async (debtorId: number): Promise<Payment[]> => {
  const response = await apiFetch(`/debtors/${debtorId}/payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
};

export const createPayment = async (
  debtId: number,
  payment: PaymentInput,
): Promise<Payment> => {
  const response = await apiFetch(`/debts/${debtId}/payments`, {
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
  const response = await apiFetch(`/payments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to delete payment"));
  }
};
