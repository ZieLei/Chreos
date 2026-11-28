import { useState, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import Listtab from "./components/Listtab";
import ProfileTab from "./components/ProfileTab";
import DebtInfoTab from "./components/DebtInfoTab";
import { useDebtor } from "./hooks/useDebtor";
import Modal from "./components/Modal";
import AddNewDebtor from "./components/modals/AddNewDebtor";
import DebtorForm from "./components/modals/DebtorForm";
import DebtForm from "./components/modals/DebtForm";
import ConfirmDelete from "./components/modals/ConfirmDelete";
import { useDebtors } from "./hooks/useDebtors";
import { deleteDebtor, updateDebtor } from "./api/debtor.api";
import { createDebt } from "./api/debt.api";

const actionButtons = [
  { id: "search", label: "SEARCH", shortcut: "/", key: "/" },
  { id: "open", label: "OPEN", shortcut: "ENTER", key: "Enter" },
  { id: "edit", label: "EDIT", shortcut: "E", key: "e" },
  { id: "addDebtor", label: "ADD DEBTOR", shortcut: "A", key: "a" },
  { id: "addDebt", label: "ADD DEBT", shortcut: "W", key: "w" },
  { id: "delete", label: "DELETE", shortcut: "D", key: "d" },
] as const;

type ActionId = (typeof actionButtons)[number]["id"];

type ModalName = "addDebtor" | "addDebt" | "edit" | "delete" | null;

export default function Home() {
  const [selected, setSelected] = useState(1);
  const [now, setNow] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const { debtor: debtors, loading: debtorsLoading } = useDebtors(refreshKey);

  // Fall back to the first debtor when the selected one doesn't exist (anymore)
  const selectedId = debtors?.some((d) => d.id === selected)
    ? selected
    : (debtors?.[0]?.id ?? null);

  const { debtor, loading, error } = useDebtor(selectedId, refreshKey);
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const refresh = () => setRefreshKey((k) => k + 1);
  const closeModal = () => setActiveModal(null);

  function runAction(id: ActionId) {
    switch (id) {
      case "addDebtor":
        setActiveModal("addDebtor");
        break;
      case "addDebt":
        if (debtor) setActiveModal("addDebt");
        break;
      case "edit":
        if (debtor) setActiveModal("edit");
        break;
      case "delete":
        if (debtor) setActiveModal("delete");
        break;
      case "search":
        break;
      case "open":
        break;
    }
  }

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activeModal !== null) return;
      // Modals opened from inside the tabs (pay, edit debt...) also block shortcuts
      if (document.getElementById("modal-root")?.hasChildNodes()) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const action = actionButtons.find(
        (b) => b.key === e.key.toLowerCase() || b.key === e.key,
      );
      if (!action) return;

      e.preventDefault();
      runAction(action.id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModal, debtor]);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (loading || debtorsLoading) return <p>Loading debtors...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="h-screen bg-black p-3">
      <div className="flex flex-col gap-2 h-full bg-black rounded-sm border-2 border-mint-green py-2 px-2">
        <div className="flex flex-row gap-2">
          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">CH</h1>
          </div>

          <div className="flex flex-row justify-between w-full h-8 bg-mint-green px-6 rounded-xs">
            <h1 className="flex-1 text-left font-terminal text-dark-cyan text-2xl">
              CHREOS DEBT TRACKER
            </h1>
            <h1 className="font-terminal text-dark-cyan text-2xl">{time}</h1>
            <h1 className="flex-1 text-right font-terminal text-dark-cyan text-2xl">
              USER: Adachi{"<3"}
            </h1>
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        <Toolbar />
        <div className="flex flex-row flex-1 min-h-0 gap-2">
          <Listtab
            selected={selectedId}
            onSelect={setSelected}
            refreshKey={refreshKey}
          />
          {debtor ? (
            <>
              <DebtInfoTab
                selected={debtor.id}
                refreshKey={refreshKey}
                onChanged={refresh}
              />
              <ProfileTab debtor={debtor} />
            </>
          ) : (
            <div className="flex flex-1 justify-center items-center border-2 border-mint-green text-2xl text-cloud-sky">
              {"[ "}NO RECORD SELECTED - PRESS [ A ] TO ADD A DEBTOR{" ]"}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between">
          {actionButtons.map(({ id, label, shortcut }) => (
            <button
              key={id}
              onClick={() => runAction(id)}
              className="flex flex-col bg-mint-green text-2xl px-2 text-dark-cyan"
            >
              <span>
                {"[ "}
                {shortcut}
                {" ]"}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <Modal open={activeModal === "addDebtor"} onClose={closeModal}>
          <AddNewDebtor
            onSaved={(saved) => {
              closeModal();
              setSelected(saved.id);
              refresh();
            }}
            onClose={closeModal}
          />
        </Modal>

        <Modal open={activeModal === "edit"} onClose={closeModal}>
          {debtor && (
            <DebtorForm
              title={`EDIT DEBTOR #${debtor.id}`}
              submitLabel="[ ENTER ] SAVE"
              debtor={debtor}
              onSubmit={(input) => updateDebtor(debtor.id, input)}
              onSaved={() => {
                closeModal();
                refresh();
              }}
              onClose={closeModal}
            />
          )}
        </Modal>

        <Modal open={activeModal === "addDebt"} onClose={closeModal}>
          {debtor && (
            <DebtForm
              title={`NEW DEBT FOR ${debtor.firstName} ${debtor.lastName}`}
              submitLabel="[ ENTER ] ADD"
              onSubmit={(input) => createDebt(debtor.id, input)}
              onSaved={() => {
                closeModal();
                refresh();
              }}
              onClose={closeModal}
            />
          )}
        </Modal>

        <Modal open={activeModal === "delete"} onClose={closeModal}>
          {debtor && (
            <ConfirmDelete
              title={`DELETE DEBTOR #${debtor.id}`}
              message={`${debtor.firstName} ${debtor.lastName} and all their debts and payments will be removed.`}
              onConfirm={() => deleteDebtor(debtor.id)}
              onDeleted={() => {
                closeModal();
                refresh();
              }}
              onClose={closeModal}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
