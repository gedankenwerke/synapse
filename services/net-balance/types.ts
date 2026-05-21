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
  ClientID: string;
  AcctID: number;
  YearMonthDay: string;
  AcctDeposit: number;
  AcctWithdraw: number;
  CreateDate: string;
  UpdateDate: string;
}

export function mapApiNetBalanceItem(api: ApiNetBalanceItem): NetBalanceItem {
  return {
    client_id: api.ClientID,
    acct_id: api.AcctID,
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
  StartDateTime: string;
  EndDateTime: string;
}

export function mapApiNetBalancePage(api: ApiNetBalancePage): NetBalancePage {
  return {
    before: api.Before,
    after: api.After,
    limit: api.Limit,
    items: api.Items.map(mapApiNetBalanceItem),
    header: api.Header,
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