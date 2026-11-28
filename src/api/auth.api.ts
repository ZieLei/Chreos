import { apiFetch, clearSession, saveSession } from "./client";
import { errorMessage } from "./error";

export const login = async (secret: string): Promise<void> => {
  const response = await apiFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response, "Access denied"));
  }

  saveSession(await response.json());
};

export const logout = async (): Promise<void> => {
  try {
    // Ends the session on the server so the token can't be reused
    await apiFetch("/logout", { method: "POST" });
  } finally {
    clearSession();
  }
};
