export interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
}

export function getColumns(t: (key: string) => string): ColumnDef[] {
  return [
    { key: "action", label: t("colAction"), sortable: false },
    { key: "role", label: t("colRole"), sortable: false },
    { key: "createdAt", label: t("colCreated"), sortable: false },
    { key: "actions", label: "", sortable: false },
  ];
}