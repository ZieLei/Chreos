import type { ReactNode } from "react";
import "../styles/crt.css";
import CRTEffect from "vault66-crt-effect";
import "vault66-crt-effect/style.css";

type Props = { children: ReactNode };

export default function CRTScreen({ children }: Props) {
  return <CRTEffect preset="fallout">{children}</CRTEffect>;
}
