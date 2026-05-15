export interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
}

export function getColumns(t: (key: string) => string): ColumnDef[] {
  return [
    { key: "name", label: t("colName"), sortable: false },
    { key: "parent", label: t("colParent"), sortable: false },
    { key: "createdAt", label: t("colCreated"), sortable: false },
    { key: "actions", label: "", sortable: false },
  ];
}