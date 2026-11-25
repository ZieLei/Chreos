import { getDebts } from "../api/debt.api";
import type { Debt } from "../types/types";
import { useEffect, useState } from "react";

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts();

        setDebts(data);
      } catch (err) {
        setError("Could not load debt");
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, []);

  return { debts, loading, error };
};
