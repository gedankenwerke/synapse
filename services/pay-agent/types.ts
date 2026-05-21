export type AGLevel = "Company" | "Director" | "AD" | "SM" | "Manager" | "Super" | "Senior" | "Master" | "Agent";

export const AG_LEVELS: AGLevel[] = [
  "Company",
  "Director",
  "AD",
  "SM",
  "Manager",
  "Super",
  "Senior",
  "Master",
  "Agent",
];

export interface PayAgentRequest {
  aglevel: AGLevel;
  clientidadd: string;
  parentclient: string;
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