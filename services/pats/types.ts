export interface Pat {
  id: string;
  name: string;
  tokenPrefix: string;
  createdAt: string;
  /** Only present on creation — shown once, never stored */
  token?: string;
}

export interface PatCreateRequest {
  name: string;
}