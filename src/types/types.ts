import type { ReactNode } from "react";

export interface Debtor {
  id: number;
  picture?: string;
  firstName: string;
  lastName: string;
  birthday: string;
  phoneNumber?: string;
  email?: string;
  facebook?: string;
  lastReminded?: string;
}

export interface Debt {
  id: number;
  debtorId: number;
  amount: number;
  createdAt: string;
  dueDate?: string;
  status: DebtStatus;
}

export type DebtStatus = "UNPAID" | "PAID" | "PARTIAL" | "OVERDUE";

export interface Payment {
  id: number;
  debtId: number;
  amount: number;
  paidAt: string;
  method?: string;
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export type DebtorInput = Omit<Debtor, "id" | "lastReminded">;

export type DebtInput = Pick<Debt, "amount" | "createdAt" | "dueDate">;

export type PaymentInput = Pick<Payment, "amount" | "paidAt" | "method">;

export interface CryptoInfo {
  algorithm: string;
  encryptedFields: (keyof Debtor)[];
}

// VIEW: moving through the list, OPEN: inside debt information, SEARCH: typing a filter
export type Mode = "VIEW" | "OPEN" | "SEARCH";
