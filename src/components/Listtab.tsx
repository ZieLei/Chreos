export default function Listtab() {
  return (
    <div className="border-2 border-mint-green p-2">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">12</h1>
          </div>
          <div className="flex-1 bg-mint-green text-dark-cyan text-2xl px-5">
            LIST OF RECORDS
          </div>
        </div>
        <div className="flex mt-2 flex-row">
          <Card name="Lucia Caminos" debt={1000} />
        </div>
      </div>
    </div>
  );
}

function Card({ name, debt }: { name: string; debt: number }) {
  return (
    <div className="w-100">
      <div className="text-2xl">
        <div className="flex flex-row justify-between">
          <span className="text-cloud-sky">{name} : </span>
          <span>₱ {debt}</span>
        </div>
      </div>
    </div>
  );
}
