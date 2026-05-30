export interface ColumnDef {
  key: string;
  label: string;
}

export const COLUMNS: ColumnDef[] = [
  { key: "trans_date", label: "colDate" },
  { key: "trno", label: "colTransactionId" },
  { key: "trans_type", label: "colType" },
  { key: "amount", label: "colAmount" },
  { key: "acct_bank", label: "colBank" },
  { key: "acct_no", label: "colAccountNo" },
  { key: "name_display", label: "colName" },
  { key: "actions", label: "" },
];