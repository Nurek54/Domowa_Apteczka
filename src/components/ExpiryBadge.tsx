import { expiryStatus } from "../utils/expiry";
import type { ExpiryStatus } from "../types";

export default function ExpiryBadge({ expDate }: { expDate: string }) {
  const st: ExpiryStatus = expiryStatus(expDate);
  const cls =
    st === "ok" ? "pill-ok" :
    st === "warning" ? "pill-warn" :
    "pill-danger";
  const label = st === "ok" ? "OK" : st === "warning" ? "≤30 dni" : "Po terminie";
  return <span className={cls}>{label}</span>;
}
