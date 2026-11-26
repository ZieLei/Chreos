import type { Payment } from "../../types/types";
import { formatPeso } from "../../utils/format";
import { usePayments } from "../../hooks/usePayments";

const headers = ["AMNT", "PD.AT", "MTHD", "FOR"];

export default function PaymentView({ selected }: { selected: number }) {
  const { payment, loading, error } = usePayments({ selected });

  if (loading) return <p>loading..</p>;

  if (error) return <p>{error}</p>;

  return (
    <table className="w-full my-3">
      <thead>
        <tr className="text-cloud-sky text-left">
          {headers.map((h) => (
            <th className="px-2 py-1 text-2xl">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {payment.map((p) => (
          <tr key={p.id} className="text-2xl">
            <td className="px-2 py-1">{formatPeso(p.amount)}</td>
            <td className="px-2 py-1">{p.paidAt}</td>
            <td className="px-2 py-1">{p.method ?? "NO METHOD"}</td>
            <td className="px-2 py-1">DEBT ID: {p.debtId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
