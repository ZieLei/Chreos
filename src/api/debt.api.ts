import type { Debt, DebtInput } from "../types/types";
import { apiFetch } from "./client";
import { errorMessage } from "./error";

export const getDebts = async (): Promise<Debt[]> => {
  const response = await apiFetch(`/debts`);

  if (!response.ok) {
    throw new Error("Failed to fetch debts");
  }

  return response.json();
};

export const getDebt = async (debtorId: number): Promise<Debt[]> => {
  const response = await apiFetch(`/debtors/${debtorId}/debts`);

  if (!response.ok) {
    throw new Error("Failed to fetch debts");
  }

  return response.json();
};

export const createDebt = async (
  debtorId: number,
  debt: DebtInput,
): Promise<Debt> => {
  const response = await apiFetch(`/debtors/${debtorId}/debts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(debt),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to create debt"));
  }

  return response.json();
};

export const updateDebt = async (
  id: number,
  debt: DebtInput,
): Promise<Debt> => {
  const response = await apiFetch(`/debts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(debt),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to update debt"));
  }

  return response.json();
};

export const deleteDebt = async (id: number): Promise<void> => {
  const response = await apiFetch(`/debts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to delete debt"));
  }
};
