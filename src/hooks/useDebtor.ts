import { useEffect, useState } from "react";
import { getDebtor } from "../api/debtor.api";
import type { Debtor } from "../types/types";

export const useDebtor = (id: number) => {
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtor = async () => {
      try {
        const data = await getDebtor(id);

        setDebtor(data);
      } catch (err) {
        setError("Could not load debtor");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtor();
  }, [id]);

  return { debtor, loading, error };
};
