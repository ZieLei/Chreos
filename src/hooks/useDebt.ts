import { getDebt } from "../api/debt.api";
import type { Debt } from "../types/types";
import { useState, useEffect } from "react";

export const useDebt = (debtorId: number, refreshKey = 0) => {
  const [debts, setDebts] = useState<Debt[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const data = await getDebt(debtorId);

        setDebts(data);
        setError(null);
      } catch (err) {
        setError("Could not load debt");
      } finally {
        setLoading(false);
      }
    };

    fetchDebt();
  }, [debtorId, refreshKey]);

  return { debts, loading, error };
};
