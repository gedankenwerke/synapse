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
  acctAvail: number;
  acctBank: string;
  acctID: number;
  acctNo: string;
  amount: number;
  channel: string;
  clientID: string;
  createDate: string;
  dpwdTransID: number;
  nameEn: string;
  nameTh: string;
  origRqUid: string;
  reqTransID: number;
  status: number;
  transDate: string;
  transName: string;
  transType: string;
  trdate: string;
  trno: number;
  uclientID: string;
  updateDate: string;
}

export function mapApiBankStatementItem(api: ApiBankStatementItem): BankStatementItem {
  return {
    client_id: api.clientID,
    acct_id: api.acctID,
    trno: api.trno,
    trdate: api.trdate,
    orig_rq_uid: api.origRqUid,
    trans_date: api.transDate,
    acct_bank: api.acctBank,
    acct_no: api.acctNo,
    trans_name: api.transName,
    channel: api.channel,
    trans_type: api.transType as BankTransType,
    name_th: api.nameTh,
    name_en: api.nameEn,
    amount: api.amount,
    acct_avail: api.acctAvail,
    u_client_id: api.uclientID,
    req_trans_id: api.reqTransID,
    dpwd_trans_id: api.dpwdTransID,
    status: api.status,
    create_date: api.createDate,
    update_date: api.updateDate,
  };
}

export interface ApiBankStatementPage {
  after: string;
  before: string;
  limit: number;
  items: ApiBankStatementItem[];
  header: Record<string, unknown>;
  startDateTime: string;
  endDateTime: string;
}

export function mapApiBankStatementPage(api: ApiBankStatementPage): BankStatementPage {
  return {
    before: api.before,
    after: api.after,
    limit: api.limit,
    items: api.items.map(mapApiBankStatementItem),
    header: api.header,
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