export interface PolicyCatalogItem {
  Name: string;
  Detail: string;
  SuperAdminOnly: boolean;
}

export interface PolicyReloadResponse {
  message: string;
}

// Type-safe catalog — single source of truth for all policy names.
// Add new entries here as the backend adds them.
// The derived PolicyName union type ensures typos are caught at compile time.
export const POLICY_CATALOG = {
  SearchTransactionHistory: { Detail: "ค้นหาประวัติธุรกรรม", SuperAdminOnly: false },
  CreateUser: { Detail: "สร้างผู้ใช้", SuperAdminOnly: false },
  ListTenantUsers: { Detail: "ดูรายการผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  ListUsers: { Detail: "ดูรายการผู้ใช้", SuperAdminOnly: false },
  ReloadPolicies: { Detail: "โหลดนโยบายใหม่", SuperAdminOnly: true },
  CreatePayAgent: { Detail: "สร้างเอเจนท์รับชำระเงิน", SuperAdminOnly: true },
  CreateTenantPermission: { Detail: "สร้างสิทธิ์เทนแนนท์", SuperAdminOnly: false },
  CreateTenantRole: { Detail: "สร้างบทบาทเทนแนนท์", SuperAdminOnly: false },
  GetTenant: { Detail: "ดูรายละเอียดเทนแนนท์", SuperAdminOnly: false },
  Settlement: { Detail: "ยืนยันการถอนเงิน / settlement processing", SuperAdminOnly: true },
  GetTenantUser: { Detail: "ดูรายละเอียดผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  DeleteTenant: { Detail: "ลบเทนแนนท์", SuperAdminOnly: false },
  DeleteUser: { Detail: "ลบผู้ใช้", SuperAdminOnly: false },
  ListTenants: { Detail: "ดูรายการเทนแนนท์", SuperAdminOnly: false },
  UpdateTenantUser: { Detail: "แก้ไขผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  SearchNetBalance: { Detail: "ค้นหาสุทธิรายวัน", SuperAdminOnly: false },
  CreateTenant: { Detail: "สร้างเทนแนนท์", SuperAdminOnly: false },
  GetUser: { Detail: "ดูรายละเอียดผู้ใช้", SuperAdminOnly: false },
  DeleteTenantRole: { Detail: "ลบบทบาทเทนแนนท์", SuperAdminOnly: false },
  UpdateUser: { Detail: "แก้ไขผู้ใช้", SuperAdminOnly: false },
  ListPolicies: { Detail: "ดูรายการนโยบาย", SuperAdminOnly: true },
  ListTenantPermissions: { Detail: "ดูรายการสิทธิ์เทนแนนท์", SuperAdminOnly: false },
  DeleteTenantPermission: { Detail: "ลบสิทธิ์เทนแนนท์", SuperAdminOnly: false },
  UpdateTenant: { Detail: "แก้ไขเทนแนนท์", SuperAdminOnly: false },
  UpdateTenantPermission: { Detail: "แก้ไขสิทธิ์เทนแนนท์", SuperAdminOnly: false },
  GetTenantRole: { Detail: "ดูรายละเอียดบทบาทเทนแนนท์", SuperAdminOnly: false },
  GetTenantPermission: { Detail: "ดูรายละเอียดสิทธิ์เทนแนนท์", SuperAdminOnly: false },
  ListTenantRoles: { Detail: "ดูรายการบทบาทเทนแนนท์", SuperAdminOnly: false },
  UpdateTenantRole: { Detail: "แก้ไขบทบาทเทนแนนท์", SuperAdminOnly: false },
  SearchBankStatement: { Detail: "ค้นหาสมุดบัญชี", SuperAdminOnly: false },
  DeleteTenantUser: { Detail: "ลบผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  CreateTenantUser: { Detail: "สร้างผู้ใช้เทนแนนท์", SuperAdminOnly: false },
} as const;

export type PolicyName = keyof typeof POLICY_CATALOG;