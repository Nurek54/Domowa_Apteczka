import type { ExpiryStatus } from "../types";

export function expiryStatus(expISO: string): ExpiryStatus {
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(expISO); exp.setHours(0,0,0,0);
  const in30 = new Date(today); in30.setDate(in30.getDate() + 30);
  if (exp < today) return "expired";
  if (exp <= in30) return "warning";
  return "ok";
}
