import { formatPeso } from "../utils/format";
import { useDebtors } from "../hooks/useDebtors";
import { useDebts } from "../hooks/useDebts";
import type { Debtor } from "../types/types";

export default function Listtab({
  selected,
  onSelect,
  refreshKey,
}: {
  selected: number | null;
  onSelect: (id: number) => void;
  refreshKey: number;
}) {
  const { debts, loading: l1, error: e1 } = useDebts(refreshKey);
  const { debtor, loading: l2, error: e2 } = useDebtors(refreshKey);

  if (l1 || l2) return <p>Loading list...</p>;

  if (e1 || e2) return <p>{e1 ?? e2}</p>;

  // TODO: needs to handle partial payments
  const totalDebt = (id: number) =>
    (debts ?? [])
      .filter((d) => d.debtorId === id && d.status !== "PAID")
      .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex border-2 border-mint-green p-2">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">12</h1>
          </div>
          <div className="flex-1 text-mint-green text-2xl px-2">
            LIST OF RECORDS
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        <div className="flex mt-2 flex-col h-full border-2 border-mint-green p-2">
          {debtor?.map((d) => (
            <Card
              key={d.id}
              debtor={d}
              debt={totalDebt(d.id)}
              isSelected={d.id === selected}
              onSelect={() => onSelect(d.id)}
            />
          ))}
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
  return (
    <div className="w-100">
      <div className="text-2xl">
        <div className="flex flex-row gap-5 justify-between">
          <button
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
