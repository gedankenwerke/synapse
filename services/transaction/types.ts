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

export interface ApiTransactionItem {
  CreateDate: string;
  DPwdTransID: number;
  AcctID: number;
  UClientID: string;
  ReqTransID: number;
  TransType: TransactionTransType;
  DPWDAmt: number;
  DWS: number;
  CS: number;
  SendID: number;
  SendStatus: string;
  ResStatus: string;
  UserID: string;
  TAcctBank: string;
  TAcctNo: string;
  Remark2: string;
}

export function mapApiTransactionItem(api: ApiTransactionItem): TransactionItem {
  return {
    create_date: api.CreateDate,
    dpwd_trans_id: api.DPwdTransID,
    acct_id: api.AcctID,
    u_client_id: api.UClientID,
    req_trans_id: api.ReqTransID,
    trans_type: api.TransType,
    dp_wd_amt: api.DPWDAmt,
    dws: api.DWS,
    cs: api.CS,
    send_id: api.SendID,
    send_status: api.SendStatus,
    res_status: api.ResStatus,
    user_id: api.UserID,
    t_acct_bank: api.TAcctBank,
    t_acct_no: api.TAcctNo,
    remark2: api.Remark2,
  };
}

export interface ApiTransactionPage {
  Before: string;
  After: string;
  Limit: number;
  Items: ApiTransactionItem[];
  Header: Record<string, unknown>;
}

export function mapApiTransactionPage(api: ApiTransactionPage): TransactionPage {
  return {
    before: api.Before,
    after: api.After,
    limit: api.Limit,
    items: api.Items.map(mapApiTransactionItem),
    header: api.Header,
  };
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