export interface NetBalanceItem {
  acct_id: number;
  client_id: string;
  year_month_day: string;
  acct_deposit: number;
  acct_withdraw: number;
  create_date: string;
  update_date: string;
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