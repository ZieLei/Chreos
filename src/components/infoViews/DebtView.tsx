import { useEffect, useRef, useState } from "react";
import { formatPeso } from "../../utils/format";
import { useDebt } from "../../hooks/useDebt";
import { deleteDebt, updateDebt } from "../../api/debt.api";
import type { Debt } from "../../types/types";
import Modal from "../Modal";
import DebtForm from "../modals/DebtForm";
import PaymentForm from "../modals/PaymentForm";
import ConfirmDelete from "../modals/ConfirmDelete";
import { useKeyboard } from "../../hooks/useKeyboard";

const headers = ["AMNT", "DATE", "DUE", "STAT", "ACT"];

const actionButtonClass =
  "text-center border-2 border-mint-green bg-black text-mint-green px-2 active:bg-mint-green active:text-dark-cyan rounded-sm";

type DebtModal = { type: "pay" | "edit" | "delete"; debt: Debt } | null;

export default function DebtView({
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
  const { debts, loading, error } = useDebt(selected, refreshKey);
  const [modal, setModal] = useState<DebtModal>(null);
  const [cursor, setCursor] = useState(0);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const rows = debts ?? [];
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
    }

    if (!current) return;

    switch (key) {
      case "p":
      case "Enter":
        if (current.status !== "PAID") setModal({ type: "pay", debt: current });
        return true;
      case "e":
        setModal({ type: "edit", debt: current });
        return true;
      case "d":
      case "Delete":
        setModal({ type: "delete", debt: current });
        return true;
    }
  }, active);

  if (loading) return <p>loading..</p>;

  if (error) return <p>{error}</p>;

  const closeModal = () => setModal(null);

  const handleSaved = () => {
    setModal(null);
    onChanged();
  };

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
          {rows.map((d, i) => (
            <tr
              key={d.id}
              onClick={() => setCursor(i)}
              className={`text-2xl ${
                active && i === row ? "bg-mint-green text-dark-cyan" : ""
              }`}
            >
              <td className="px-2 py-1">{formatPeso(d.amount)}</td>
              <td className="px-2 py-1">{d.createdAt}</td>
              <td className="px-2 py-1">{d.dueDate ?? "NO DUE DATE"}</td>
              <td className="px-2 py-1">{d.status}</td>
              <td className="px-2 py-1">
                <div className="flex flex-row gap-2">
                  <button
                    tabIndex={-1}
                    disabled={d.status === "PAID"}
                    onClick={() => setModal({ type: "pay", debt: d })}
                    className="w-15 text-center border-2 border-mint-green bg-black text-mint-green px-2 active:bg-mint-green active:text-dark-cyan rounded-sm disabled:active:bg-mint-green disabled:active:text-dark-cyan disabled:bg-mint-green disabled:text-dark-cyan disabled:cursor-not-allowed"
                  >
                    {d.status === "PAID" ? "PAID" : "PAY"}
                  </button>
                  <button
                    tabIndex={-1}
                    onClick={() => setModal({ type: "edit", debt: d })}
                    className={actionButtonClass}
                  >
                    EDT
                  </button>
                  <button
                    tabIndex={-1}
                    onClick={() => setModal({ type: "delete", debt: d })}
                    className={actionButtonClass}
                  >
                    DEL
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {debts?.length === 0 && (
        <p className="text-2xl text-center text-cloud-sky">
          {"[ "}NO DEBTS RECORDED{" ]"}
        </p>
      )}

      <Modal open={modal?.type === "pay"} onClose={closeModal}>
        {modal && (
          <PaymentForm
            debt={modal.debt}
            onSaved={handleSaved}
            onClose={closeModal}
          />
        )}
      </Modal>

      <Modal open={modal?.type === "edit"} onClose={closeModal}>
        {modal && (
          <DebtForm
            title={`EDIT DEBT #${modal.debt.id}`}
            submitLabel="[ ENTER ] SAVE"
            debt={modal.debt}
            onSubmit={(input) => updateDebt(modal.debt.id, input)}
            onSaved={handleSaved}
            onClose={closeModal}
          />
        )}
      </Modal>

      <Modal open={modal?.type === "delete"} onClose={closeModal}>
        {modal && (
          <ConfirmDelete
            title={`DELETE DEBT #${modal.debt.id}`}
            message={`${formatPeso(modal.debt.amount)} and all its payments will be removed.`}
            onConfirm={() => deleteDebt(modal.debt.id)}
            onDeleted={handleSaved}
            onClose={closeModal}
          />
        )}
      </Modal>
    </>
  );
}
