export interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
}

export function getColumns(t: (key: string) => string): ColumnDef[] {
  return [
    { key: "username", label: t("colUsername"), sortable: false },
    { key: "role", label: t("colRole"), sortable: false },
    { key: "created", label: t("colCreated"), sortable: false },
    { key: "actions", label: "", sortable: false },
  ];
}