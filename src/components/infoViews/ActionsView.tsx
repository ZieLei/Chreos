import { useState } from "react";

const sendButtons = [
  { label: "SEND TO PHONE", channel: "phone" },
  { label: "SEND TO EMAIL", channel: "email" },
];

export default function ActionView() {
  const [message, setMessage] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-3xl text-cloud-sky text-center">
          {"[ "}SEND REMINDER{" ]"}
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Type reminder message..."
          className="border-2 border-mint-green bg-black text-2xl outline-none p-2 resize-none min-h-[4lh]"
        />
        <div className="flex flex-row justify-center gap-5 mt-4">
          {sendButtons.map(({ label, channel }) => (
            <button
              key={channel}
              className="border-2 border-mint-green p-2 text-2xl active:bg-mint-green active:text-dark-cyan rounded-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
