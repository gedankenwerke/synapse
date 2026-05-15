export interface SettlementRequest {
  acctbank: string;
  acctno: string;
  amount: number;
  clientid: string;
  userid: string;
  ip?: string;
  remark?: string;
  settlement: number;
}

export interface SettlementResult {
  amount: number;
  bankstatus: string;
  date: string;
  id: string;
  tacctbank: string;
  tacctname: string;
  tacctno: string;
}

export interface SettlementResponse {
  message: string;
  result: SettlementResult;
  status: string;
  withdraw: number;
}