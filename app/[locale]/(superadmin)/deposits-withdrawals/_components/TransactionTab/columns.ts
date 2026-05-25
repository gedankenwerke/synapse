import type { useTranslations } from "next-intl";

export interface ColumnDef {
  key: string;
  label: string;
}

export function getColumns(t: ReturnType<typeof useTranslations<"transaction">>): ColumnDef[] {
  return [
    { key: "dpwd_trans_id", label: t("colTransId") },
    { key: "create_date", label: t("colDate") },
    { key: "user_display", label: t("colUser") },
    { key: "trans_type", label: t("colType") },
    { key: "dp_wd_amt", label: t("colAmount") },
    { key: "dws", label: t("colStatus") },
    { key: "actions", label: "" },
  ];
}