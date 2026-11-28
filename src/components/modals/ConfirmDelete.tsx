import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FormError, FormTitle } from "./FormParts";

type ConfirmDeleteProps = {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onDeleted: () => void;
  onClose: () => void;
};

export default function ConfirmDelete({
  title,
  message,
  onConfirm,
  onDeleted,
  onClose,
}: ConfirmDeleteProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key.toLowerCase()) {
      case "y":
        if (!deleting) handleConfirm();
        break;
      case "n":
        onClose();
        break;
      case "arrowleft":
        deleteRef.current?.focus();
        break;
      case "arrowright":
        cancelRef.current?.focus();
        break;
      default:
        return;
    }

    e.preventDefault();
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  async function handleConfirm() {
    setDeleting(true);
    setError(null);

    try {
      await onConfirm();
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-xl">
      <FormTitle>{title}</FormTitle>
      <div className="text-2xl text-center">{message}</div>
      <div className="text-2xl text-center text-cloud-sky">
        THIS CANNOT BE UNDONE.
      </div>
      <FormError error={error} />
      <div className="flex flex-row justify-center gap-5 mt-4">
        <button
          ref={deleteRef}
          onClick={handleConfirm}
          disabled={deleting}
          className="border-2 border-mint-green p-2 text-2xl outline-none active:bg-mint-green active:text-dark-cyan focus:bg-mint-green focus:text-dark-cyan rounded-sm disabled:cursor-wait"
        >
          {deleting ? "DELETING..." : "[ Y ] DELETE"}
        </button>
        {/* Focused by default so a stray ENTER doesn't delete anything */}
        <button
          ref={cancelRef}
          autoFocus
          onClick={onClose}
          className="border-2 border-mint-green p-2 text-2xl outline-none active:bg-mint-green active:text-dark-cyan focus:bg-mint-green focus:text-dark-cyan rounded-sm"
        >
          [ N ] CANCEL
        </button>
      </div>
    </div>
  );
}
