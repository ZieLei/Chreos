import type { Debtor } from "../types/types";
import DecryptText from "./DecryptText";

interface ProfileTabProps {
  debtor: Debtor;
}

export default function ProfileTab({ debtor }: ProfileTabProps) {
  // `encrypted` fields are stored with AES-256-GCM, they get the decrypt effect
  const infos = [
    ["FIRST NAME", debtor.firstName, true],
    ["LAST NAME", debtor.lastName, true],
    ["BIRTHDATE", debtor.birthday, true],
    ["PHONE", debtor.phoneNumber, true],
    ["EMAIL", debtor.email, true],
    ["FACEBOOK", debtor.facebook, true],
    [
      "LAST REMINDED",
      debtor.lastReminded ? debtor.lastReminded : "Not reminded yet",
      false,
    ],
  ] as const;

  return (
    <div className="flex border-2 w-fit whitespace-nowrap shrink-0 border-mint-green p-2">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center border-2 border-mint-green rounded-xs aspect-square h-8">
            <h1 className="text-2xl">{debtor.id}</h1>
          </div>
          <div className="flex-1 text-mint-green text-2xl px-2">
            PROFILE INFORMATION
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        {debtor.picture ? (
          <img
            className="aspect-square my-2 h-40 w-auto object-cover self-center border-2 border-mint-green p-2"
            src={debtor.picture}
            alt={debtor.firstName}
          />
        ) : (
          <div className="flex aspect-square my-2 h-40 self-center justify-center items-center border-2 border-mint-green p-2 text-2xl text-deep-teal">
            {"[ NO PICTURE ]"}
          </div>
        )}
        <div className="flex flex-col border-2 border-mint-green h-full justify-between p-2 gap-2">
          {infos.map(([label, value, encrypted]) => (
            <div key={label} className="flex flex-row gap-10">
              <span className="flex-1 text-2xl text-cloud-sky">
                {"["} {label} {"] -"}
              </span>

              <span className="text-2xl">
                {encrypted && value ? (
                  // Keyed by debtor so it replays on every record switch, even
                  // when two debtors share a value (e.g. the same phone number)
                  <DecryptText key={debtor.id} text={value} />
                ) : (
                  value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
