import { useEffect, useRef, useState } from "react";
import type { Payment } from "../../types/types";
import { formatPeso } from "../../utils/format";
import { usePayments } from "../../hooks/usePayments";
import { deletePayment } from "../../api/payment.api";
import Modal from "../Modal";
import ConfirmDelete from "../modals/ConfirmDelete";
import { useKeyboard } from "../../hooks/useKeyboard";

const headers = ["AMNT", "PD.AT", "MTHD", "FOR", "ACT"];

export default function PaymentView({
  selected,
  refreshKey,
  onChanged,
  active,
}: {
  selected: number;
  refreshKey: number;
  onChanged: () => void;
  active: boolean;
}) {
  const { payment, loading, error } = usePayments({ selected, refreshKey });
  const [toDelete, setToDelete] = useState<Payment | null>(null);
  const [cursor, setCursor] = useState(0);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const rows = payment ?? [];
  // Clamp in case the row under the cursor was deleted
  const row = Math.max(0, Math.min(cursor, rows.length - 1));
  const current = rows[row];

  useEffect(() => {
    tbodyRef.current?.children[row]?.scrollIntoView({ block: "nearest" });
  }, [row]);

  useKeyboard((key) => {
    switch (key) {
      case "ArrowDown":
      case "j":
        setCursor(Math.min(row + 1, rows.length - 1));
        return true;
      case "ArrowUp":
      case "k":
        setCursor(Math.max(row - 1, 0));
        return true;
      case "Home":
        setCursor(0);
        return true;
      case "End":
        setCursor(rows.length - 1);
        return true;
      case "d":
      case "Delete":
        if (current) setToDelete(current);
        return true;
    }
  }, active);

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
        <tbody ref={tbodyRef}>
          {rows.map((p, i) => (
            <tr
              key={p.id}
              onClick={() => setCursor(i)}
              className={`text-2xl ${
                active && i === row ? "bg-mint-green text-dark-cyan" : ""
              }`}
            >
              <td className="px-2 py-1">{formatPeso(p.amount)}</td>
              <td className="px-2 py-1">{p.paidAt}</td>
              <td className="px-2 py-1">{p.method ?? "NO METHOD"}</td>
              <td className="px-2 py-1">DEBT ID: {p.debtId}</td>
              <td className="px-2 py-1">
                <button
                  tabIndex={-1}
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
