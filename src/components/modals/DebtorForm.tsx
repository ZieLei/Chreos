import { useState, type FormEvent } from "react";
import type { Debtor, DebtorInput } from "../../types/types";
import {
  FormButtons,
  FormDateField,
  FormError,
  FormField,
  FormImageField,
  FormTitle,
} from "./FormParts";

const fields = [
  { name: "firstName", label: "FIRST NAME", required: true },
  { name: "lastName", label: "LAST NAME", required: true },
  { name: "birthday", label: "BIRTHDATE", required: true },
  { name: "phoneNumber", label: "PHONE", type: "tel" },
  { name: "email", label: "EMAIL", type: "email" },
  { name: "facebook", label: "FACEBOOK" },
  { name: "picture", label: "PICTURE" },
] as const;

type DebtorFormProps = {
  title: string;
  submitLabel: string;
  debtor?: Debtor | null;
  onSubmit: (input: DebtorInput) => Promise<Debtor>;
  onSaved: (debtor: Debtor) => void;
  onClose: () => void;
};

export default function DebtorForm({
  title,
  submitLabel,
  debtor,
  onSubmit,
  onSaved,
  onClose,
}: DebtorFormProps) {
  const [form, setForm] = useState<Record<keyof DebtorInput, string>>({
    firstName: debtor?.firstName ?? "",
    lastName: debtor?.lastName ?? "",
    birthday: debtor?.birthday ?? "",
    phoneNumber: debtor?.phoneNumber ?? "",
    email: debtor?.email ?? "",
    facebook: debtor?.facebook ?? "",
    picture: debtor?.picture ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const saved = await onSubmit(form);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save debtor");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-xl">
      <FormTitle>{title}</FormTitle>
      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 items-center">
        {fields.map((field, i) =>
          field.name === "picture" ? (
            <FormImageField
              key={field.name}
              label={field.label}
              value={form.picture}
              onChange={(picture) => setForm({ ...form, picture })}
            />
          ) : field.name === "birthday" ? (
            <FormDateField
              key={field.name}
              label={field.label}
              value={form.birthday}
              onChange={(birthday) => setForm({ ...form, birthday })}
            />
          ) : (
            <FormField
              key={field.name}
              {...field}
              autoFocus={i === 0}
              value={form[field.name]}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
            />
          ),
        )}
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
