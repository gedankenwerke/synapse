export interface PolicyCatalogItem {
  Name: string;
  Detail: string;
  SuperAdminOnly: boolean;
}

// API returns lowercase/snake_case fields — map to PascalCase frontend type
export interface ApiPolicyItem {
  name: string;
  detail: string;
  superadmin_only: boolean;
}

export function mapApiPolicy(api: ApiPolicyItem): PolicyCatalogItem {
  return {
    Name: api.name,
    Detail: api.detail,
    SuperAdminOnly: api.superadmin_only,
  };
}

export interface PolicyReloadResponse {
  message: string;
}

// Type-safe catalog — single source of truth for all policy names.
// Matches the 28 policies from the API exactly.
// The derived PolicyName union type ensures typos are caught at compile time.
export const POLICY_CATALOG = {
  SearchTransactionHistory: { Detail: "ค้นหาประวัติธุรกรรม", SuperAdminOnly: false },
  UpdateTenantRole: { Detail: "แก้ไขบทบาทเทนแนนท์", SuperAdminOnly: false },
  GetTenantRole: { Detail: "ดูรายละเอียดบทบาทเทนแนนท์", SuperAdminOnly: false },
  AssignPermissions: { Detail: "กำหนดสิทธิ์ให้บทบาท", SuperAdminOnly: false },
  UpdateTenant: { Detail: "แก้ไขเทนแนนท์", SuperAdminOnly: false },
  ChangeUserRole: { Detail: "เปลี่ยนบทบาทผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  ListTenantUsers: { Detail: "ดูรายการผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  DeleteTenant: { Detail: "ลบเทนแนนท์", SuperAdminOnly: false },
  DeassignPermissions: { Detail: "ลบสิทธิ์จากบทบาท", SuperAdminOnly: false },
  UpdateUser: { Detail: "แก้ไขผู้ใช้", SuperAdminOnly: false },
  GetTenant: { Detail: "ดูรายละเอียดเทนแนนท์", SuperAdminOnly: false },
  DeleteTenantUser: { Detail: "ลบผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  CreateTenant: { Detail: "สร้างเทนแนนท์", SuperAdminOnly: false },
  Settlement: { Detail: "ยืนยันการถอนเงิน", SuperAdminOnly: true },
  DeleteUser: { Detail: "ลบผู้ใช้", SuperAdminOnly: false },
  DeleteTenantRole: { Detail: "ลบบทบาทเทนแนนท์", SuperAdminOnly: false },
  CreateTenantRole: { Detail: "สร้างบทบาทเทนแนนท์", SuperAdminOnly: false },
  ListTenantRoles: { Detail: "ดูรายการบทบาทเทนแนนท์", SuperAdminOnly: false },
  CreateUser: { Detail: "สร้างผู้ใช้", SuperAdminOnly: false },
  CreateTenantUser: { Detail: "สร้างผู้ใช้เทนแนนท์", SuperAdminOnly: false },
  SearchBankStatement: { Detail: "ค้นหาสมุดบัญชี", SuperAdminOnly: false },
  CreatePayAgent: { Detail: "สร้างเอเจนท์รับชำระเงิน", SuperAdminOnly: true },
  ListTenants: { Detail: "ดูรายการเทนแนนท์", SuperAdminOnly: false },
  SearchNetBalance: { Detail: "ค้นหาสุทธิรายวัน", SuperAdminOnly: false },
  ListUsers: { Detail: "ดูรายการผู้ใช้", SuperAdminOnly: false },
  ReloadPolicies: { Detail: "โหลดนโยบายใหม่", SuperAdminOnly: true },
  GetUser: { Detail: "ดูรายละเอียดผู้ใช้", SuperAdminOnly: false },
  ListPolicies: { Detail: "ดูรายการนโยบาย", SuperAdminOnly: true },
  ListPats: { Detail: "ดูรายการโทเค็นส่วนตัว", SuperAdminOnly: false },
  CreatePat: { Detail: "สร้างโทเค็นส่วนตัว", SuperAdminOnly: false },
  DeletePat: { Detail: "ลบโทเค็นส่วนตัว", SuperAdminOnly: false },
} as const;

export type PolicyName = keyof typeof POLICY_CATALOG;