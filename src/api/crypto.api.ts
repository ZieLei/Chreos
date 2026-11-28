import type { CryptoInfo } from "../types/types";
import { apiFetch } from "./client";

export const getCryptoInfo = async (): Promise<CryptoInfo> => {
  const response = await apiFetch(`/crypto`);

  if (!response.ok) {
    throw new Error("Failed to fetch cipher info");
  }

  return response.json();
};
