export type Debtor = {
  id: string;
  picture?: string;
  firstName: string;
  lastName: string;
  birthday: string;
  phoneNumber?: string;
  email?: string;
  facebook?: string;
  lastReminded?: string;
};

export type Debt = {
  id: string;
  amount: number;
  createdAt: string;
  dueDate?: string;
  status: "UNPAID" | "PARTIAL" | "PAID";
};

export type Payment = {
  id: string;
  debtId: string;
  amount: number;
  paidAt: string;
  method?: string;
};
