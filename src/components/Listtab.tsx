import { useEffect, useRef, type KeyboardEvent } from "react";
import { formatPeso } from "../utils/format";
import { useDebts } from "../hooks/useDebts";
import type { Debtor } from "../types/types";

export default function Listtab({
  debtors,
  selected,
  onSelect,
  refreshKey,
  focused,
  onFocus,
  query,
  searching,
  onQueryChange,
  onSearchingChange,
  onSearchKey,
}: {
  debtors: Debtor[];
  selected: number | null;
  onSelect: (id: number) => void;
  refreshKey: number;
  focused: boolean;
  onFocus: () => void;
  query: string;
  searching: boolean;
  onQueryChange: (query: string) => void;
  onSearchingChange: (searching: boolean) => void;
  onSearchKey: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  const { debts, loading, error } = useDebts(refreshKey);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  if (loading) return <p>Loading list...</p>;

  if (error) return <p>{error}</p>;

  // TODO: needs to handle partial payments
  const totalDebt = (id: number) =>
    (debts ?? [])
      .filter((d) => d.debtorId === id && d.status !== "PAID")
      .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex border-2 border-mint-green p-2" onMouseDown={onFocus}>
      <div className="flex flex-col min-h-0">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">{debtors.length}</h1>
          </div>
          <div
            className={`flex-1 text-2xl px-2 ${
              focused || searching
                ? "bg-mint-green text-dark-cyan"
                : "text-mint-green"
            }`}
          >
            LIST OF RECORDS
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>

        {(searching || query !== "") && (
          <label className="flex flex-row mt-2 border-2 border-mint-green text-2xl">
            <span className="bg-mint-green text-dark-cyan px-2">{"[ / ]"}</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onSearchKey}
              onFocus={() => onSearchingChange(true)}
              onBlur={() => onSearchingChange(false)}
              placeholder="SEARCH NAME, PHONE, EMAIL..."
              className="flex-1 min-w-0 bg-black text-mint-green outline-none px-2 placeholder:text-deep-teal"
            />
          </label>
        )}

        <div className="flex mt-2 flex-col flex-1 min-h-0 overflow-y-auto border-2 border-mint-green p-2">
          {debtors.map((d) => (
            <Card
              key={d.id}
              debtor={d}
              debt={totalDebt(d.id)}
              isSelected={d.id === selected}
              onSelect={() => onSelect(d.id)}
            />
          ))}

          {debtors.length === 0 && (
            <p className="w-100 text-2xl text-center text-cloud-sky">
              {query !== "" ? "[ NO MATCHES ]" : "[ NO RECORDS ]"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({
  debtor,
  debt,
  isSelected,
  onSelect,
}: {
  debtor: Debtor;
  debt: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the keyboard selection visible in long lists
  useEffect(() => {
    if (isSelected) ref.current?.scrollIntoView({ block: "nearest" });
  }, [isSelected]);

  return (
    <div ref={ref} className="w-100">
      <div className="text-2xl">
        <div className="flex flex-row gap-5 justify-between">
          <button
            tabIndex={-1}
            onClick={onSelect}
            className={`flex-1 px-2 text-left ${isSelected ? "text-dark-cyan bg-mint-green" : "text-mint-green bg-black"}`}
          >
            {debtor.firstName} {debtor.lastName} :{" "}
          </button>
          <span>{formatPeso(debt)}</span>
        </div>
      </div>
    </div>
  );
}
