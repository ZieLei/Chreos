import { useEffect, useState } from "react";
import { getDebtors } from "../api/debtor.api";
import type { Debtor } from "../types/types";

export const useDebtors = () => {
  const [debtor, setDebtor] = useState<Debtor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtor = async () => {
      try {
        const data = await getDebtors();

        setDebtor(data);
      } catch (err) {
        setError("Could not load debtor");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtor();
  }, []);

  return { debtor, loading, error };
};
