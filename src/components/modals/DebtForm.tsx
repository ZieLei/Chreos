import { useState, type FormEvent } from "react";
import type { Debt, DebtInput } from "../../types/types";
import { today } from "../../utils/format";
import {
  FormButtons,
  FormDateField,
  FormError,
  FormField,
  FormTitle,
} from "./FormParts";

type DebtFormProps = {
  title: string;
  submitLabel: string;
  debt?: Debt | null;
  onSubmit: (input: DebtInput) => Promise<Debt>;
  onSaved: (debt: Debt) => void;
  onClose: () => void;
};

export default function DebtForm({
  title,
  submitLabel,
  debt,
  onSubmit,
  onSaved,
  onClose,
}: DebtFormProps) {
  const [amount, setAmount] = useState(debt ? String(debt.amount) : "");
  const [createdAt, setCreatedAt] = useState(debt?.createdAt ?? today());
  const [dueDate, setDueDate] = useState(debt?.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const saved = await onSubmit({
        amount: Number(amount),
        createdAt,
        dueDate: dueDate || undefined,
      });
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save debt");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-xl">
      <FormTitle>{title}</FormTitle>
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
        <FormDateField label="DATE" value={createdAt} onChange={setCreatedAt} />
        <FormDateField
          label="DUE DATE"
          optional
          placeholder="NO DUE DATE"
          value={dueDate}
          onChange={setDueDate}
        />
      </div>
      <FormError error={error} />
      <FormButtons
        submitLabel={submitLabel}
        saving={saving}
        onCancel={onClose}
      />
    </form>
  );
}
