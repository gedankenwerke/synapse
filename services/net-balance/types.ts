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
  AcctID: number;
  ClientID: string;
  YearMonthDay: string;
  AcctDeposit: number;
  AcctWithdraw: number;
  CreateDate: string;
  UpdateDate: string;
}

export function mapApiNetBalanceItem(api: ApiNetBalanceItem): NetBalanceItem {
  return {
    acct_id: api.AcctID,
    client_id: api.ClientID,
    year_month_day: api.YearMonthDay,
    acct_deposit: api.AcctDeposit,
    acct_withdraw: api.AcctWithdraw,
    create_date: api.CreateDate,
    update_date: api.UpdateDate,
  };
}

export interface ApiNetBalancePage {
  Before: string;
  After: string;
  Limit: number;
  Items: ApiNetBalanceItem[];
  Header: Record<string, unknown>;
  YearMonthDay: string;
}

export function mapApiNetBalancePage(api: ApiNetBalancePage): NetBalancePage {
  return {
    before: api.Before,
    after: api.After,
    limit: api.Limit,
    items: api.Items.map(mapApiNetBalanceItem),
    header: api.Header,
    year_month_day: api.YearMonthDay,
  };
}

export interface NetBalancePage {
  before: string;
  after: string;
  limit: number;
  items: NetBalanceItem[];
  header: Record<string, unknown>;
  year_month_day: string;
}

export interface NetBalanceRequest {
  after: string;
  before: string;
  limit: number;
  start_date_time: string;
  end_date_time: string;
}