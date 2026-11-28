import type { Payment } from "../types/types";
import { getAllPayments } from "../api/payment.api";
import { useState, useEffect } from "react";

export const useAllPayments = (refreshKey = 0) => {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();

        setPayments(data);
        setError(null);
      } catch (err) {
        setError("Could not load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [refreshKey]);

  return { payments, loading, error };
};
