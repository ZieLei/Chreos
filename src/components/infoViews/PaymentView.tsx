import { useState } from "react";
import type { Payment } from "../../types/types";
import { formatPeso } from "../../utils/format";
import { usePayments } from "../../hooks/usePayments";
import { deletePayment } from "../../api/payment.api";
import Modal from "../Modal";
import ConfirmDelete from "../modals/ConfirmDelete";

const headers = ["AMNT", "PD.AT", "MTHD", "FOR", "ACT"];

export default function PaymentView({
  selected,
  refreshKey,
  onChanged,
}: {
  selected: number;
  refreshKey: number;
  onChanged: () => void;
}) {
  const { payment, loading, error } = usePayments({ selected, refreshKey });
  const [toDelete, setToDelete] = useState<Payment | null>(null);

  if (loading) return <p>loading..</p>;

  if (error) return <p>{error}</p>;

  return (
    <>
      <table className="w-full my-3">
        <thead>
          <tr className="text-cloud-sky text-left">
            {headers.map((h) => (
              <th key={h} className="px-2 py-1 text-2xl">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payment?.map((p) => (
            <tr key={p.id} className="text-2xl">
              <td className="px-2 py-1">{formatPeso(p.amount)}</td>
              <td className="px-2 py-1">{p.paidAt}</td>
              <td className="px-2 py-1">{p.method ?? "NO METHOD"}</td>
              <td className="px-2 py-1">DEBT ID: {p.debtId}</td>
              <td className="px-2 py-1">
                <button
                  onClick={() => setToDelete(p)}
                  className="text-center border-2 border-mint-green bg-black text-mint-green px-2 active:bg-mint-green active:text-dark-cyan rounded-sm"
                >
                  DEL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payment?.length === 0 && (
        <p className="text-2xl text-center text-cloud-sky">
          {"[ "}NO PAYMENTS RECORDED{" ]"}
        </p>
      )}

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)}>
        {toDelete && (
          <ConfirmDelete
            title={`DELETE PAYMENT #${toDelete.id}`}
            message={`${formatPeso(toDelete.amount)} paid on ${toDelete.paidAt} for debt #${toDelete.debtId}.`}
            onConfirm={() => deletePayment(toDelete.id)}
            onDeleted={() => {
              setToDelete(null);
              onChanged();
            }}
            onClose={() => setToDelete(null)}
          />
        )}
      </Modal>
    </>
  );
}
