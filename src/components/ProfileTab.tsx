import type { Debtor } from "../types/types";

export default function ProfileTab({
  id,
  picture,
  firstName,
  lastName,
  birthday,
  phoneNumber,
  email,
  facebook,
  lastReminded,
}: Debtor) {
  const infos = [
    ["FIRST NAME", firstName],
    ["LAST NAME", lastName],
    ["BIRTHDATE", birthday],
    ["PHONE", phoneNumber],
    ["EMAIL", email],
    ["FACEBOOK", facebook],
    ["LAST REMINDED", lastReminded],
  ];

  return (
    <div className="flex border-2 w-fit whitespace-nowrap shrink-0 border-mint-green p-2">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">{id}</h1>
          </div>
          <div className="flex-1 text-mint-green text-2xl px-2">
            PROFILE INFORMATION
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        <img
          className="aspect-square my-2 h-40 w-auto object-cover self-center border-2 border-mint-green p-2"
          src={picture}
          alt={firstName}
        />
        <div className="flex flex-col border-2 border-mint-green h-full justify-between p-2 gap-2">
          {infos.map(([label, value]) => (
            <div key={label} className="flex flex-row gap-10">
              <span className="flex-1 text-2xl text-cloud-sky">
                {"["} {label} {"] -"}
              </span>

              <span className="text-2xl">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
