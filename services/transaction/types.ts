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
  createDate: string;
  dpwdTransID: number;
  acctID: number;
  uclientID: string;
  reqTransID: number;
  transType: string;
  dpwdAmt: number;
  dws: number;
  cs: number;
  sendID: number;
  sendStatus: string;
  resStatus: string;
  userID: string;
  tAcctBank: string;
  tAcctNo: string;
  remark2: string;
}

export function mapApiTransactionItem(api: ApiTransactionItem): TransactionItem {
  return {
    create_date: api.createDate,
    dpwd_trans_id: api.dpwdTransID,
    acct_id: api.acctID,
    u_client_id: api.uclientID,
    req_trans_id: api.reqTransID,
    trans_type: api.transType as TransactionTransType,
    dp_wd_amt: api.dpwdAmt,
    dws: api.dws,
    cs: api.cs,
    send_id: api.sendID,
    send_status: api.sendStatus,
    res_status: api.resStatus,
    user_id: api.userID,
    t_acct_bank: api.tAcctBank,
    t_acct_no: api.tAcctNo,
    remark2: api.remark2,
  };
}

export interface ApiTransactionPage {
  after: string;
  before: string;
  limit: number;
  items: ApiTransactionItem[];
  header: Record<string, unknown>;
  startDateTime: string;
  endDateTime: string;
}

export function mapApiTransactionPage(api: ApiTransactionPage): TransactionPage {
  return {
    before: api.before,
    after: api.after,
    limit: api.limit,
    items: api.items.map(mapApiTransactionItem),
    header: api.header,
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