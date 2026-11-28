import { useEffect, useState } from "react";
import { getDebtor } from "../api/debtor.api";
import type { Debtor } from "../types/types";

export const useDebtor = (id: number | null, refreshKey = 0) => {
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtor = async () => {
      // Nothing selected (e.g. every debtor was deleted)
      if (id === null) {
        setDebtor(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getDebtor(id);

        setDebtor(data);
        setError(null);
      } catch (err) {
        setError("Could not load debtor");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtor();
  }, [id, refreshKey]);

  return { debtor, loading, error };
};
