import type { Debtor, Mode } from "../types/types";
import { formatPeso } from "../utils/format";
import DecryptText from "./DecryptText";

const SQUARES = 7;

// Which arrow keys do something in each mode
const arrows: Record<
  Mode,
  { left: boolean; right: boolean; up: boolean; down: boolean }
> = {
  VIEW: { left: false, right: true, up: true, down: true },
  OPEN: { left: true, right: true, up: true, down: true },
  SEARCH: { left: false, right: false, up: true, down: true },
};

type ToolbarProps = {
  mode: Mode;
  target: Debtor | null;
  position: number;
  records: number;
  totalRecords: number;
  owed: number;
  filter: string;
  cipher: string | null;
};

export default function Toolbar({
  mode,
  target,
  position,
  records,
  totalRecords,
  owed,
  filter,
  cipher,
}: ToolbarProps) {
  // Scrollbar-like indicator: where the selected record sits in the list
  const marker =
    records <= 1
      ? Math.floor(SQUARES / 2)
      : Math.round((position / (records - 1)) * (SQUARES - 1));

  const active = arrows[mode];
  const arrowClass = (on: boolean) =>
    `inline-block px-1 ${on ? "bg-mint-green text-dark-cyan" : "text-deep-teal"}`;

  return (
    <div className="flex flex-row justify-between w-full border-2 border-mint-green p-2">
      <div className="flex flex-col">
        <div className="flex flex-row border-2 border-mint-green">
          <div className="bg-mint-green text-dark-cyan text-2xl px-3">
            MODE:
          </div>
          <div className="px-3 text-2xl text-mint-green">{mode}</div>
        </div>
        <div className="flex-1 flex flex-row justify-between items-center">
          {Array.from({ length: SQUARES }, (_, i) => (
            <span key={i}>
              {records === 0 ? "□" : i === marker ? "▣" : "■"}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-2xl text-cloud-sky">
          {mode === "SEARCH" ? "Targeting..." : "Target :"}
        </div>
        <div className="text-2xl text-mint-green">
          {target ? (
            <>
              #{String(target.id).padStart(3, "0")}{" "}
              <DecryptText text={target.lastName.toUpperCase()} />
            </>
          ) : (
            "NO TARGET"
          )}
        </div>
      </div>
      <div className="flex flex-col text-2xl">
        <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-2xl">
          <div className="text-cloud-sky">Records :</div>
          <div className="bg-mint-green text-dark-cyan px-2">
            {records === totalRecords ? records : `${records}/${totalRecords}`}
          </div>
          <div className="text-cloud-sky">Owed :</div>
          <div className="bg-mint-green text-dark-cyan px-2">
            {formatPeso(owed)}
          </div>
        </div>
      </div>
      <div className="flex flex-col text-2xl">
        <div className="text-cloud-sky text-center">Navigation</div>
        <div className="flex flex-row justify-between gap-1">
          <span className={arrowClass(active.left)}>{"<"}</span>
          <span className={arrowClass(active.right)}>{">"}</span>
          <span className={arrowClass(active.up)}>
            <span className="inline-block rotate-90">{"<"}</span>
          </span>
          <span className={arrowClass(active.down)}>
            <span className="inline-block -rotate-90">{"<"}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col text-2xl">
        <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-2xl">
          <div className="text-cloud-sky">Filter :</div>
          <div className="bg-mint-green text-dark-cyan px-2 max-w-40 truncate">
            {filter || "All"}
          </div>
          <div className="text-cloud-sky">Cipher :</div>
          <div className="bg-mint-green text-dark-cyan px-2">
            {cipher ?? "UNKNOWN"}
          </div>
        </div>
      </div>
    </div>
  );
}
