import { FormTitle } from "./FormParts";

const sections = [
  {
    title: "LIST [ VIEW ]",
    keys: [
      ["↑ ↓ / J K", "Select debtor"],
      ["HOME / END", "First / last debtor"],
      ["ENTER / →", "Open debt information"],
      ["/", "Search"],
      ["E", "Edit debtor"],
      ["A", "Add debtor"],
      ["W", "Add debt"],
      ["D / DEL", "Delete debtor"],
      ["ESC", "Clear search filter"],
    ],
  },
  {
    title: "DEBT INFO [ OPEN ]",
    keys: [
      ["← → / 1 2 3", "Switch tab"],
      ["↑ ↓ / J K", "Select row"],
      ["P / ENTER", "Pay debt"],
      ["E", "Edit debt"],
      ["D / DEL", "Delete debt / payment"],
      ["ESC", "Back to list"],
    ],
  },
  {
    title: "SEARCH",
    keys: [
      ["↑ ↓", "Select result"],
      ["ENTER", "Keep filter"],
      ["ESC", "Clear and close"],
    ],
  },
  {
    title: "MODALS",
    keys: [
      ["TAB", "Next field"],
      ["ENTER", "Save"],
      ["ESC", "Cancel"],
      ["Y / N", "Confirm / cancel delete"],
    ],
  },
];

export default function KeyboardHelp() {
  return (
    <div className="flex flex-col gap-2">
      <FormTitle>KEYBOARD SHORTCUTS</FormTitle>
      <div className="grid grid-cols-2 gap-x-10 gap-y-4">
        {sections.map(({ title, keys }) => (
          <div key={title} className="flex flex-col">
            <div className="bg-mint-green text-dark-cyan text-2xl px-2 mb-1">
              {title}
            </div>
            {keys.map(([shortcut, label]) => (
              <div key={shortcut} className="flex flex-row gap-5 text-2xl">
                <span className="flex-1 text-cloud-sky whitespace-nowrap">
                  {"[ "}
                  {shortcut}
                  {" ]"}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-2xl text-center text-cloud-sky mt-2">
        PRESS [ ESC ] TO CLOSE
      </div>
    </div>
  );
}
