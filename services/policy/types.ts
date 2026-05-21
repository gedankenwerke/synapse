export interface PolicyCatalogItem {
  name: string;
  detail: string;
  superadmin_only: boolean;
}

export interface PolicyReloadResponse {
  message: string;
}

// Type-safe catalog — single source of truth for all policy names.
// Add new entries here as the backend adds them.
// The derived PolicyName union type ensures typos are caught at compile time.
export const POLICY_CATALOG = {
  SearchTransactionHistory: { detail: "ค้นหาประวัติธุรกรรม", superadmin_only: false },
  CreateUser: { detail: "สร้างผู้ใช้", superadmin_only: false },
  ListTenantUsers: { detail: "ดูรายการผู้ใช้เทนแนนท์", superadmin_only: false },
  ListUsers: { detail: "ดูรายการผู้ใช้", superadmin_only: false },
  ReloadPolicies: { detail: "โหลดนโยบายใหม่", superadmin_only: true },
  CreatePayAgent: { detail: "สร้างเอเจนท์รับชำระเงิน", superadmin_only: true },
  CreateTenantPermission: { detail: "สร้างสิทธิ์เทนแนนท์", superadmin_only: false },
  CreateTenantRole: { detail: "สร้างบทบาทเทนแนนท์", superadmin_only: false },
  GetTenant: { detail: "ดูรายละเอียดเทนแนนท์", superadmin_only: false },
  Settlement: { detail: "ยืนยันการถอนเงิน / settlement processing", superadmin_only: true },
  GetTenantUser: { detail: "ดูรายละเอียดผู้ใช้เทนแนนท์", superadmin_only: false },
  DeleteTenant: { detail: "ลบเทนแนนท์", superadmin_only: false },
  DeleteUser: { detail: "ลบผู้ใช้", superadmin_only: false },
  ListTenants: { detail: "ดูรายการเทนแนนท์", superadmin_only: false },
  UpdateTenantUser: { detail: "แก้ไขผู้ใช้เทนแนนท์", superadmin_only: false },
  SearchNetBalance: { detail: "ค้นหาสุทธิรายวัน", superadmin_only: false },
  CreateTenant: { detail: "สร้างเทนแนนท์", superadmin_only: false },
  GetUser: { detail: "ดูรายละเอียดผู้ใช้", superadmin_only: false },
  DeleteTenantRole: { detail: "ลบบทบาทเทนแนนท์", superadmin_only: false },
  UpdateUser: { detail: "แก้ไขผู้ใช้", superadmin_only: false },
  ListPolicies: { detail: "ดูรายการนโยบาย", superadmin_only: true },
  ListTenantPermissions: { detail: "ดูรายการสิทธิ์เทนแนนท์", superadmin_only: false },
  DeleteTenantPermission: { detail: "ลบสิทธิ์เทนแนนท์", superadmin_only: false },
  UpdateTenant: { detail: "แก้ไขเทนแนนท์", superadmin_only: false },
  UpdateTenantPermission: { detail: "แก้ไขสิทธิ์เทนแนนท์", superadmin_only: false },
  GetTenantRole: { detail: "ดูรายละเอียดบทบาทเทนแนนท์", superadmin_only: false },
  GetTenantPermission: { detail: "ดูรายละเอียดสิทธิ์เทนแนนท์", superadmin_only: false },
  ListTenantRoles: { detail: "ดูรายการบทบาทเทนแนนท์", superadmin_only: false },
  UpdateTenantRole: { detail: "แก้ไขบทบาทเทนแนนท์", superadmin_only: false },
  SearchBankStatement: { detail: "ค้นหาสมุดบัญชี", superadmin_only: false },
  DeleteTenantUser: { detail: "ลบผู้ใช้เทนแนนท์", superadmin_only: false },
  CreateTenantUser: { detail: "สร้างผู้ใช้เทนแนนท์", superadmin_only: false },
} as const;

export type PolicyName = keyof typeof POLICY_CATALOG;