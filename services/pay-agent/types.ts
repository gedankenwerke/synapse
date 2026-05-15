export interface PayAgentRequest {
  aglevel?: string;
  clientidadd: string;
  parentclient: string;
  secret: string;
}

export interface PayAgentResponse {
  admin_id: string;
  admin_password: string;
  api_endpoint: string;
  backend: string;
  callback_key: string;
  client_id: string;
  key: string;
}