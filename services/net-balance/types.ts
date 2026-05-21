export interface NetBalanceItem {
  acct_id: number;
  client_id: string;
  year_month_day: string;
  acct_deposit: number;
  acct_withdraw: number;
  create_date: string;
  update_date: string;
}

export interface ApiNetBalanceItem {
  acctID: number;
  clientID: string;
  yearMonthDay: string;
  acctDeposit: number;
  acctWithdraw: number;
  createDate: string;
  updateDate: string;
}

export function mapApiNetBalanceItem(api: ApiNetBalanceItem): NetBalanceItem {
  return {
    acct_id: api.acctID,
    client_id: api.clientID,
    year_month_day: api.yearMonthDay,
    acct_deposit: api.acctDeposit,
    acct_withdraw: api.acctWithdraw,
    create_date: api.createDate,
    update_date: api.updateDate,
  };
}

export interface ApiNetBalancePage {
  after: string;
  before: string;
  limit: number;
  items: ApiNetBalanceItem[];
  header: Record<string, unknown>;
  startDateTime: string;
  endDateTime: string;
}

export function mapApiNetBalancePage(api: ApiNetBalancePage): NetBalancePage {
  return {
    before: api.before,
    after: api.after,
    limit: api.limit,
    items: api.items.map(mapApiNetBalanceItem),
    header: api.header,
  };
}

export interface NetBalancePage {
  before: string;
  after: string;
  limit: number;
  items: NetBalanceItem[];
  header: Record<string, unknown>;
}

export interface NetBalanceRequest {
  after: string;
  before: string;
  limit: number;
  start_date_time: string;
  end_date_time: string;
}