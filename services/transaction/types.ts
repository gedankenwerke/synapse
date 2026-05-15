export type TransactionTransType = "Deposit" | "Withdraw";

export interface TransactionItem {
  create_date: string;
  dpwd_trans_id: number;
  acct_id: number;
  u_client_id: string;
  req_trans_id: number;
  trans_type: TransactionTransType;
  dp_wd_amt: number;
  dws: number;
  cs: number;
  send_id: number;
  send_status: string;
  res_status: string;
  user_id: string;
  t_acct_bank: string;
  t_acct_no: string;
  remark2: string;
}

export interface TransactionPage {
  before: string;
  after: string;
  limit: number;
  items: TransactionItem[];
  header: Record<string, unknown>;
}

export interface TransactionRequest {
  after: string;
  before: string;
  limit: number;
  start_date_time: string;
  end_date_time: string;
}

export const DWS_STATUS_MAP: Record<number, { label: string; color: string }> = {
  3: { label: "Success", color: "green" },
  0: { label: "Pending", color: "yellow" },
};