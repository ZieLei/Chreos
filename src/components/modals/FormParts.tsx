import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

// Meant to be placed inside a `grid-cols-[auto_1fr]` grid
export function FormField({ label, ...input }: FormFieldProps) {
  return (
    <label className="contents">
      <span className="text-2xl text-cloud-sky whitespace-nowrap">
        {"["} {label} {"] -"}
      </span>
      <input
        {...input}
        className="border-2 border-mint-green bg-black text-2xl text-mint-green outline-none px-2 placeholder:text-deep-teal focus:bg-mint-green focus:text-dark-cyan"
      />
    </label>
  );
}

export function FormTitle({ children }: { children: string }) {
  return (
    <div className="text-3xl text-cloud-sky text-center mb-2">
      {"[ "}
      {children}
      {" ]"}
    </div>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;

  return <div className="text-2xl text-cloud-sky">{`>> ERROR: ${error}`}</div>;
}

export function FormButtons({
  submitLabel,
  saving,
  onCancel,
}: {
  submitLabel: string;
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-row justify-center gap-5 mt-4">
      <button
        type="submit"
        disabled={saving}
        className="border-2 border-mint-green p-2 text-2xl outline-none active:bg-mint-green active:text-dark-cyan focus:bg-mint-green focus:text-dark-cyan rounded-sm disabled:cursor-wait"
      >
        {saving ? "SAVING..." : submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="border-2 border-mint-green p-2 text-2xl outline-none active:bg-mint-green active:text-dark-cyan focus:bg-mint-green focus:text-dark-cyan rounded-sm"
      >
        [ ESC ] CANCEL
      </button>
    </div>
  );
}
