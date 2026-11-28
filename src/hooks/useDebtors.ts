import { useEffect, useState } from "react";
import { getDebtors } from "../api/debtor.api";
import type { Debtor } from "../types/types";

export const useDebtors = (refreshKey = 0) => {
  const [debtor, setDebtor] = useState<Debtor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtor = async () => {
      try {
        const data = await getDebtors();

        setDebtor(data);
        setError(null);
      } catch (err) {
        setError("Could not load debtor");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtor();
  }, [refreshKey]);

  return { debtor, loading, error };
};
