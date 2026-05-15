export type BankTransType = "Deposit" | "Withdraw";

export interface BankStatementItem {
  client_id: string;
  acct_id: number;
  trno: number;
  trdate: string;
  orig_rq_uid: string;
  trans_date: string;
  acct_bank: string;
  acct_no: string;
  trans_name: string;
  channel: string;
  trans_type: BankTransType;
  name_th: string;
  name_en: string;
  amount: number;
  acct_avail: number;
  u_client_id: string;
  req_trans_id: number;
  dpwd_trans_id: number;
  status: number;
  create_date: string;
  update_date: string;
}

export interface BankStatementPage {
  before: string;
  after: string;
  limit: number;
  items: BankStatementItem[];
  header: Record<string, unknown>;
}

export interface BankStatementRequest {
  after: string;
  before: string;
  limit: number;
  start_date_time: string;
  end_date_time: string;
}

export const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "Success", color: "green" },
  1: { label: "Failed", color: "red" },
};