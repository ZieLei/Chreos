import { useState, type FormEvent } from "react";
import { createPayment } from "../../api/payment.api";
import type { Debt, Payment } from "../../types/types";
import { formatPeso, today } from "../../utils/format";
import { FormButtons, FormError, FormField, FormTitle } from "./FormParts";

const methods = ["CASH", "GCASH", "BANK"];

export default function PaymentForm({
  debt,
  onSaved,
  onClose,
}: {
  debt: Debt;
  onSaved: (payment: Payment) => void;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(today());
  const [method, setMethod] = useState(methods[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const saved = await createPayment(debt.id, {
        amount: Number(amount),
        paidAt,
        method,
      });
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add payment");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-xl">
      <FormTitle>{`PAY DEBT #${debt.id}`}</FormTitle>
      <div className="text-2xl text-center">
        TOTAL: {formatPeso(debt.amount)} | STATUS: {debt.status}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 items-center">
        <FormField
          label="AMOUNT"
          type="number"
          min="0.01"
          step="0.01"
          required
          autoFocus
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <FormField
          label="PAID AT"
          required
          placeholder="YYYY-MM-DD"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
        />
        <span className="text-2xl text-cloud-sky whitespace-nowrap">
          {"[ METHOD ] -"}
        </span>
        <div className="flex flex-row gap-2">
          {methods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`text-2xl px-4 border-2 border-mint-green ${
                m === method
                  ? "bg-mint-green text-dark-cyan"
                  : "text-mint-green"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <FormError error={error} />
      <FormButtons
        submitLabel="[ ENTER ] PAY"
        saving={saving}
        onCancel={onClose}
      />
    </form>
  );
}
