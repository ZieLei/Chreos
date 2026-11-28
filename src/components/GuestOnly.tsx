import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { getSession } from "../api/client";

// The login screen: already logged in users go straight to the app. Checked on
// every render (not once in App) so it's never stale after login/logout.
export default function GuestOnly({ children }: { children: ReactNode }) {
  if (getSession()) return <Navigate to="/home" replace />;

  return children;
}
