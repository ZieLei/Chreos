import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logout } from "./api/auth.api";
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
import KeyboardHelp from "./components/modals/KeyboardHelp";
import { useDebtors } from "./hooks/useDebtors";
import { pressKey, useKeyboard } from "./hooks/useKeyboard";
import { deleteDebtor, updateDebtor } from "./api/debtor.api";
import { createDebt } from "./api/debt.api";
import type { Debtor, Mode } from "./types/types";
import { useDebts } from "./hooks/useDebts";
import { useAllPayments } from "./hooks/useAllPayments";
import { useCryptoInfo } from "./hooks/useCryptoInfo";
import { getBalances } from "./utils/balance";

// Every button just presses its key, so clicking and typing share one code path
const actionButtons: Record<
  Mode,
  { label: string; shortcut: string; key: string }[]
> = {
  VIEW: [
    { label: "SEARCH", shortcut: "/", key: "/" },
    { label: "OPEN", shortcut: "ENTER", key: "Enter" },
    { label: "EDIT", shortcut: "E", key: "e" },
    { label: "ADD DEBTOR", shortcut: "A", key: "a" },
    { label: "ADD DEBT", shortcut: "W", key: "w" },
    { label: "DELETE", shortcut: "D", key: "d" },
    { label: "HELP", shortcut: "?", key: "?" },
  ],
  OPEN: [
    { label: "BACK", shortcut: "ESC", key: "Escape" },
    { label: "NEXT TAB", shortcut: "← →", key: "ArrowRight" },
    { label: "NEXT ROW", shortcut: "↑ ↓", key: "ArrowDown" },
    { label: "PAY", shortcut: "P", key: "p" },
    { label: "EDIT", shortcut: "E", key: "e" },
    { label: "DELETE", shortcut: "D", key: "d" },
    { label: "HELP", shortcut: "?", key: "?" },
  ],
  SEARCH: [
    { label: "SELECT", shortcut: "↑ ↓", key: "ArrowDown" },
    { label: "DONE", shortcut: "ENTER", key: "Enter" },
    { label: "CLEAR", shortcut: "ESC", key: "Escape" },
  ],
};

type ModalName = "addDebtor" | "addDebt" | "edit" | "delete" | "help" | null;

const matchesQuery = (debtor: Debtor, query: string) => {
  const q = query.trim().toLowerCase();
  if (q === "") return true;

  return [
    `${debtor.firstName} ${debtor.lastName}`,
    debtor.phoneNumber,
    debtor.email,
    debtor.facebook,
    `#${debtor.id}`,
  ].some((field) => field?.toLowerCase().includes(q));
};

export default function Home() {
  const [selected, setSelected] = useState(1);
  const [now, setNow] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [mode, setMode] = useState<Mode>("VIEW");
  const [query, setQuery] = useState("");
  const { debtor: debtors, loading: debtorsLoading } = useDebtors(refreshKey);
  const { debts, loading: debtsLoading } = useDebts(refreshKey);
  const { payments, loading: paymentsLoading } = useAllPayments(refreshKey);
  const { cryptoInfo } = useCryptoInfo();

  const visibleDebtors = (debtors ?? []).filter((d) => matchesQuery(d, query));
  const balances = getBalances(debts ?? [], payments ?? []);
  const visibleOwed = visibleDebtors.reduce(
    (sum, d) => sum + (balances.get(d.id)?.owed ?? 0),
    0,
  );

  // Fall back to the first debtor when the selected one doesn't exist (anymore)
  // or is hidden by the search filter
  const selectedId = visibleDebtors.some((d) => d.id === selected)
    ? selected
    : (visibleDebtors[0]?.id ?? null);

  const { debtor, loading, error } = useDebtor(selectedId, refreshKey);
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  // Can't be inside a record that isn't there
  const currentMode: Mode = mode === "OPEN" && !debtor ? "VIEW" : mode;

  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);
  const closeModal = () => setActiveModal(null);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    navigate("/", { replace: true });
  }

  function selectAt(index: number) {
    const target = visibleDebtors[index];
    if (target) setSelected(target.id);
  }

  function moveSelection(delta: number) {
    const index = visibleDebtors.findIndex((d) => d.id === selectedId);
    const next = Math.min(
      Math.max(index + delta, 0),
      visibleDebtors.length - 1,
    );
    selectAt(next);
  }

  function stopSearching(clear: boolean) {
    if (clear) setQuery("");
    setMode("VIEW");
    // Give the keys back to the page shortcuts
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleSearchKey(key: string): boolean {
    switch (key) {
      case "ArrowDown":
        moveSelection(1);
        return true;
      case "ArrowUp":
        moveSelection(-1);
        return true;
      case "Enter":
        stopSearching(false);
        return true;
      case "Escape":
        stopSearching(true);
        return true;
    }
    return false;
  }

  // Keys that work in both VIEW and OPEN
  function handleCommonKey(key: string): boolean {
    switch (key) {
      case "/":
        setMode("SEARCH");
        return true;
      case "a":
        setActiveModal("addDebtor");
        return true;
      case "w":
        if (debtor) setActiveModal("addDebt");
        return true;
      case "?":
        setActiveModal("help");
        return true;
      case "q":
        handleLogout();
        return true;
    }
    return false;
  }

  function handleViewKey(key: string): boolean {
    switch (key) {
      case "ArrowDown":
      case "j":
        moveSelection(1);
        return true;
      case "ArrowUp":
      case "k":
        moveSelection(-1);
        return true;
      case "Home":
        selectAt(0);
        return true;
      case "End":
        selectAt(visibleDebtors.length - 1);
        return true;
      case "Enter":
      case "ArrowRight":
      case "l":
        if (debtor) setMode("OPEN");
        return true;
      case "e":
        if (debtor) setActiveModal("edit");
        return true;
      case "d":
      case "Delete":
        if (debtor) setActiveModal("delete");
        return true;
      case "Escape":
        if (query === "") return false;
        setQuery("");
        return true;
    }
    return handleCommonKey(key);
  }

  function handleOpenKey(key: string): boolean {
    switch (key) {
      case "Escape":
      case "Backspace":
        setMode("VIEW");
        return true;
    }
    // Everything else (rows, tabs, pay...) is handled inside DebtInfoTab
    return handleCommonKey(key);
  }

  useKeyboard((key) => {
    switch (currentMode) {
      case "VIEW":
        return handleViewKey(key);
      case "OPEN":
        return handleOpenKey(key);
      case "SEARCH":
        return handleSearchKey(key);
    }
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (loading || debtorsLoading || debtsLoading || paymentsLoading) {
    return <p>Loading debtors...</p>;
  }

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

          <button
            tabIndex={-1}
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex border-2 bg-black border-mint-green h-8 px-2 justify-center items-center rounded-xs whitespace-nowrap active:bg-mint-green active:text-dark-cyan disabled:cursor-wait"
          >
            <h1 className="font-terminal text-2xl text-center">
              {loggingOut ? "LOGGING OUT..." : "[ Q ] LOGOUT"}
            </h1>
          </button>

          <button
            tabIndex={-1}
            onClick={() => setActiveModal("help")}
            className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs active:bg-mint-green active:text-dark-cyan"
          >
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </button>
        </div>
        <Toolbar
          mode={currentMode}
          target={debtor}
          position={visibleDebtors.findIndex((d) => d.id === selectedId)}
          records={visibleDebtors.length}
          totalRecords={debtors?.length ?? 0}
          owed={visibleOwed}
          filter={query}
          cipher={cryptoInfo?.algorithm ?? null}
        />
        <div className="flex flex-row flex-1 min-h-0 gap-2">
          <Listtab
            debtors={visibleDebtors}
            selected={selectedId}
            onSelect={setSelected}
            balances={balances}
            focused={currentMode === "VIEW"}
            onFocus={() => mode === "OPEN" && setMode("VIEW")}
            query={query}
            searching={currentMode === "SEARCH"}
            onQueryChange={setQuery}
            onSearchingChange={(searching) =>
              setMode(searching ? "SEARCH" : "VIEW")
            }
            onSearchKey={(e) => {
              if (handleSearchKey(e.key)) e.preventDefault();
            }}
          />
          {debtor ? (
            <>
              <DebtInfoTab
                selected={debtor.id}
                refreshKey={refreshKey}
                onChanged={refresh}
                focused={currentMode === "OPEN"}
                onFocus={() => setMode("OPEN")}
              />
              <ProfileTab debtor={debtor} />
            </>
          ) : (
            <div className="flex flex-1 justify-center items-center border-2 border-mint-green text-2xl text-cloud-sky">
              {query !== ""
                ? "[ NO MATCHES - PRESS [ ESC ] TO CLEAR THE SEARCH ]"
                : "[ NO RECORD SELECTED - PRESS [ A ] TO ADD A DEBTOR ]"}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between">
          {actionButtons[currentMode].map(({ label, shortcut, key }) => (
            <button
              key={label}
              tabIndex={-1}
              // Don't steal focus (keeps the search input focused while clicking)
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pressKey(key)}
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

        <Modal open={activeModal === "help"} onClose={closeModal}>
          <KeyboardHelp />
        </Modal>

        <Modal open={activeModal === "addDebtor"} onClose={closeModal}>
          <AddNewDebtor
            onSaved={(saved) => {
              closeModal();
              setQuery("");
              setSelected(saved.id);
              setMode("VIEW");
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
                setMode("VIEW");
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
