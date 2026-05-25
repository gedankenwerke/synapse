import type { BankStatementItem } from "@/services/account-statement/types";

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

export function formatBankName(bank: string, tb?: (key: string) => string): string {
  if (bank === "label.bank.other.account") return tb ? tb("other") : "Other Bank";
  return bank;
}

export function displayOrNA(value: string | number | undefined, naText = "N/A"): string {
  if (value === undefined || value === null || String(value).trim() === "") return naText;
  return String(value);
}

export function getDisplayName(item: BankStatementItem): string {
  return item.name_th?.trim() || item.name_en?.trim() || "";
}