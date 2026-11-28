import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { getSession } from "../api/client";

// Sends anyone without a valid session back to the login screen
export default function RequireAuth({ children }: { children: ReactNode }) {
  if (!getSession()) return <Navigate to="/" replace />;

  return children;
}
