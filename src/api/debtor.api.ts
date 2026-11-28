import type { Debtor, DebtorInput } from "../types/types";
import { apiFetch } from "./client";
import { errorMessage } from "./error";

export const getDebtors = async (): Promise<Debtor[]> => {
  const response = await apiFetch(`/debtors`);

  if (!response.ok) {
    throw new Error("Failed to fetch debtors");
  }

  return response.json();
};

export const getDebtor = async (id: number): Promise<Debtor> => {
  const response = await apiFetch(`/debtors/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch debtor");
  }

  return response.json();
};

export const createDebtor = async (debtor: DebtorInput): Promise<Debtor> => {
  const response = await apiFetch(`/debtors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(debtor),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to create debtor"));
  }

  return response.json();
};

export const updateDebtor = async (
  id: number,
  debtor: DebtorInput,
): Promise<Debtor> => {
  const response = await apiFetch(`/debtors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(debtor),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to update debtor"));
  }

  return response.json();
};

export const deleteDebtor = async (id: number): Promise<void> => {
  const response = await apiFetch(`/debtors/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Failed to delete debtor"));
  }
};
