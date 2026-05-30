import { useTranslations } from "next-intl";

export interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
}

export function getColumns(t: ReturnType<typeof useTranslations>) {
  return [
    { key: "id", label: t("colSettlementId"), sortable: true },
    { key: "requestDate", label: t("colRequestDate"), sortable: true },
    { key: "userName", label: t("colUser"), sortable: true },
    { key: "bankDetails", label: t("colBankDetails"), sortable: false },
    { key: "amount", label: t("colAmount"), sortable: true },
    { key: "status", label: t("colStatus"), sortable: false },
    { key: "actions", label: "", sortable: false },
  ] as ColumnDef[];
}