import type { Debt } from "../../types/types";
import { formatPeso } from "../../utils/format";

const headers = ["AMNT", "DATE", "DUE", "STAT", "ACT"];

export default function DebtView() {
  const debts: Debt[] = [
    { id: "1", amount: 500, createdAt: "2026-11-01", status: "UNPAID" },
    {
      id: "2",
      amount: 1200,
      createdAt: "2026-11-05",
      dueDate: "2026-12-01",
      status: "PARTIAL",
    },
    {
      id: "3",
      amount: 1000,
      createdAt: "2026-09-25",
      dueDate: "2026-11-01",
      status: "PAID",
    },
  ];

  return (
    <table className="w-full my-3">
      <thead>
        <tr className="text-cloud-sky text-left">
          {headers.map((h) => (
            <th className="px-2 py-1 text-2xl">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {debts.map((d) => (
          <tr key={d.id} className="text-2xl">
            <td className="px-2 py-1">{formatPeso(d.amount)}</td>
            <td className="px-2 py-1">{d.createdAt}</td>
            <td className="px-2 py-1">{d.dueDate ?? "NO DUE DATE"}</td>
            <td className="px-2 py-1">{d.status}</td>
            <td className="px-2 py-1">
              <button
                disabled={d.status === "PAID"}
                className="w-15 text-center border-2 border-mint-green bg-black text-mint-green px-2 active:bg-mint-green active:text-dark-cyan rounded-sm disabled:active:bg-mint-green disabled:active:text-dark-cyan disabled:bg-mint-green disabled:text-dark-cyan disabled:cursor-not-allowed"
              >
                {d.status === "PAID" ? "PAID" : "PAY"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
