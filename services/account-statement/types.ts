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

export interface ApiBankStatementItem {
  ClientID: string;
  AcctID: number;
  Trno: number;
  Trdate: string;
  OrigRqUid: string;
  TransDate: string;
  AcctBank: string;
  AcctNo: string;
  TransName: string;
  Channel: string;
  TransType: BankTransType;
  NameTh: string;
  NameEn: string;
  Amount: number;
  AcctAvail: number;
  UClientID: string;
  ReqTransID: number;
  DpwdTransID: number;
  Status: number;
  CreateDate: string;
  UpdateDate: string;
}

export function mapApiBankStatementItem(api: ApiBankStatementItem): BankStatementItem {
  return {
    client_id: api.ClientID,
    acct_id: api.AcctID,
    trno: api.Trno,
    trdate: api.Trdate,
    orig_rq_uid: api.OrigRqUid,
    trans_date: api.TransDate,
    acct_bank: api.AcctBank,
    acct_no: api.AcctNo,
    trans_name: api.TransName,
    channel: api.Channel,
    trans_type: api.TransType,
    name_th: api.NameTh,
    name_en: api.NameEn,
    amount: api.Amount,
    acct_avail: api.AcctAvail,
    u_client_id: api.UClientID,
    req_trans_id: api.ReqTransID,
    dpwd_trans_id: api.DpwdTransID,
    status: api.Status,
    create_date: api.CreateDate,
    update_date: api.UpdateDate,
  };
}

export interface ApiBankStatementPage {
  Before: string;
  After: string;
  Limit: number;
  Items: ApiBankStatementItem[];
  Header: Record<string, unknown>;
  StartDateTime: string;
  EndDateTime: string;
}

export function mapApiBankStatementPage(api: ApiBankStatementPage): BankStatementPage {
  return {
    before: api.Before,
    after: api.After,
    limit: api.Limit,
    items: api.Items.map(mapApiBankStatementItem),
    header: api.Header,
  };
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