import type { Payment } from "../types/types";
import { getPayments } from "../api/payment.api";
import { useState, useEffect } from "react";

export const usePayments = ({
  selected,
  refreshKey = 0,
}: {
  selected: number;
  refreshKey?: number;
}) => {
  const [payment, setPayment] = useState<Payment[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments(selected);

        setPayment(data);
        setError(null);
      } catch (err) {
        setError("Could not find payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selected, refreshKey]);

  return { payment, loading, error };
};
