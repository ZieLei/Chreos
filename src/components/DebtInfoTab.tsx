import { useState } from "react";
import DebtView from "./infoViews/DebtView";
import PaymentView from "./infoViews/PaymentView";
import ActionView from "./infoViews/ActionsView";
import { useKeyboard } from "../hooks/useKeyboard";

const tabs = [
  { label: "Debts", View: DebtView },
  { label: "Payments", View: PaymentView },
  { label: "Actions", View: ActionView },
];

export default function DebtInfoTab({
  selected,
  refreshKey,
  onChanged,
  focused,
  onFocus,
}: {
  selected: number;
  refreshKey: number;
  onChanged: () => void;
  focused: boolean;
  onFocus: () => void;
}) {
  const [active, setActive] = useState(0);
  const ActiveView = tabs[active].View;

  useKeyboard((key) => {
    switch (key) {
      case "ArrowLeft":
      case "h":
        setActive((active - 1 + tabs.length) % tabs.length);
        return true;
      case "ArrowRight":
      case "l":
        setActive((active + 1) % tabs.length);
        return true;
      case "1":
      case "2":
      case "3":
        setActive(Number(key) - 1);
        return true;
    }
  }, focused);

  return (
    <div
      className="flex flex-col flex-1 min-h-0 w-screen h-full border-2 border-mint-green p-2"
      onMouseDown={onFocus}
    >
      <div className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">O</h1>
          </div>
          <div
            className={`flex-1 text-2xl px-2 ${
              focused ? "bg-mint-green text-dark-cyan" : "text-mint-green"
            }`}
          >
            DEBT INFORMATION
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0 border-2 border-mint-green p-2">
          <div className="flex flex-row">
            {tabs.map(({ label }, i) => (
              <button
                key={label}
                tabIndex={-1}
                onClick={() => setActive(i)}
                className={`text-2xl px-4 ${
                  i === active
                    ? "bg-mint-green text-dark-cyan"
                    : "text-mint-green"
                }`}
              >
                {focused && `${i + 1}:`}
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Keyed by debtor so the row cursor resets when switching records */}
            <ActiveView
              key={selected}
              selected={selected}
              refreshKey={refreshKey}
              onChanged={onChanged}
              active={focused}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
