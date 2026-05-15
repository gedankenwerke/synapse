export interface PolicyItem {
  id: number;
  name: string;
  value: string;
  description?: string;
}

export interface PolicyReloadResponse {
  message: string;
}