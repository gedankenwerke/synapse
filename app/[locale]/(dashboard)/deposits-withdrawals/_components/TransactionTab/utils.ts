import type { useTranslations } from "next-intl";
import type { TransactionItem } from "@/services/transaction/types";

export function formatBaht(amount: number): string {
  return `฿ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function getUserDisplay(item: TransactionItem): string {
  return item.u_client_id?.trim() || item.user_id?.trim() || "";
}

export function formatBankName(
  bank: string,
  tb?: ReturnType<typeof useTranslations<"bank">>
): string {
  if (bank === "label.bank.other.account") {
    return tb ? tb("other") : "Other Bank";
  }
  return bank;
}

export function displayOrNA(
  value: string | number | undefined,
  tc: ReturnType<typeof useTranslations<"common">>
): string {
  if (value === undefined || value === null || String(value).trim() === "") return tc("na");
  return String(value);
}