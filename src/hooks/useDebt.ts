import { getDebt } from "../api/debt.api";
import type { Debt } from "../types/types";
import { useState, useEffect } from "react";

export const useDebt = (debtorId: number) => {
  const [debts, setDebts] = useState<Debt[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const data = await getDebt(debtorId);

        setDebts(data);
      } catch (err) {
        setError("Could not load debt");
      } finally {
        setLoading(false);
      }
    };

    fetchDebt();
  }, [debtorId]);

  return { debts, loading, error };
};
