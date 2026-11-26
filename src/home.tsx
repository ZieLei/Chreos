import { useState, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import Listtab from "./components/Listtab";
import ProfileTab from "./components/ProfileTab";
import DebtInfoTab from "./components/DebtInfoTab";
import { useDebtor } from "./hooks/useDebtor";

const actionButtons = [
  { label: "SEARCH", shortcut: "/" },
  { label: "OPEN", shortcut: "ENTER" },
  { label: "EDIT", shortcut: "E" },
  { label: "ADD DEBTOR", shortcut: "A" },
  { label: "ADD DEBT", shortcut: "W" },
];

export default function Home() {
  const [selected, setSelected] = useState(1);
  const [now, setNow] = useState(new Date());
  const { debtor, loading, error } = useDebtor(selected);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (loading) return <p>Loading debtors...</p>;

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
          <Listtab selected={selected} onSelect={setSelected} />
          <DebtInfoTab selected={selected} />
          <ProfileTab debtor={debtor} />
        </div>
        <div className="flex flex-row justify-between">
          {actionButtons.map(({ label, shortcut }) => (
            <button
              key={shortcut}
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
      </div>
    </div>
  );
}
