import { createDebtor } from "../../api/debtor.api";
import type { Debtor } from "../../types/types";
import DebtorForm from "./DebtorForm";

export default function AddNewDebtor({
  onSaved,
  onClose,
}: {
  onSaved: (debtor: Debtor) => void;
  onClose: () => void;
}) {
  return (
    <DebtorForm
      title="NEW DEBTOR"
      submitLabel="[ ENTER ] ADD"
      onSubmit={createDebtor}
      onSaved={onSaved}
      onClose={onClose}
    />
  );
}
