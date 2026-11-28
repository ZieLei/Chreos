export default function Toolbar({
  mode,
  records,
  filter,
}: {
  mode: string;
  records: number;
  filter: string;
}) {
  return (
    <div className="flex flex-row justify-between w-full border-2 border-mint-green p-2">
      <div className="flex flex-col">
        {/* Convert this to a button component */}
        <div className="flex flex-row border-2 border-mint-green">
          <div className="bg-mint-green text-dark-cyan text-2xl px-3">
            MODE:
          </div>
          <div className="px-3 text-2xl text-mint-green">{mode}</div>
        </div>
        <div className="flex-1 flex flex-row justify-between items-center">
          {["■", "■", "■", "▣", "■", "■", "■"].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-2xl text-cloud-sky">Targeting...</div>
        <div className="text-2xl text-mint-green">#004ATSH</div>
      </div>
      <div className="flex flex-col text-2xl">
        <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-2xl">
          <div className="text-cloud-sky">Records :</div>
          <div className="bg-mint-green text-dark-cyan px-2">{records}</div>
          <div className="text-cloud-sky">Owed :</div>
          <div className="bg-mint-green text-dark-cyan px-2">₱4,250</div>
        </div>
      </div>
      <div className="flex flex-col text-2xl">
        <div className="text-cloud-sky text-center">Navigation</div>
        <div className="flex flex-row justify-between">
          <span>{"<"}</span>
          <span>{">"}</span>
          <span className="inline-block rotate-90">{"<"}</span>
          <span className="inline-block -rotate-90">{"<"}</span>
        </div>
      </div>

      <div className="flex flex-col text-2xl">
        <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-2xl">
          <div className="text-cloud-sky">Filter :</div>
          <div className="bg-mint-green text-dark-cyan px-2 max-w-40 truncate">
            {filter || "All"}
          </div>
          <div className="text-cloud-sky">Cipher :</div>
          <div className="bg-mint-green text-dark-cyan px-2">AES-256</div>
        </div>
      </div>
    </div>
  );
}
