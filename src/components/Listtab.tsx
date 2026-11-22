import { formatPeso } from "../utils/format";

export default function Listtab() {
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
          <Card name="Hougetsu Shimamura" debt={1700} />
        </div>
      </div>
    </div>
  );
}

function Card({ name, debt }: { name: string; debt: number }) {
  return (
    <div className="w-100">
      <div className="text-2xl">
        <div className="flex flex-row gap-5 justify-between">
          <span className="flex-1 px-2 text-dark-cyan bg-mint-green">
            {name} :{" "}
          </span>
          <span>{formatPeso(debt)}</span>
        </div>
      </div>
    </div>
  );
}
