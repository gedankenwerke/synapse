export const PERMISSION_ACTIONS = [
  "SearchBankStatement",
  "SearchNetBalance",
  "SearchTransactionHistory",
  "CreateTenant",
  "ListTenants",
  "GetTenant",
  "UpdateTenant",
  "DeleteTenant",
  "CreateTenantRole",
  "ListTenantRoles",
  "GetTenantRole",
  "UpdateTenantRole",
  "DeleteTenantRole",
  "CreateTenantPermission",
  "ListTenantPermissions",
  "GetTenantPermission",
  "UpdateTenantPermission",
  "DeleteTenantPermission",
  "CreateTenantUser",
  "ListTenantUsers",
  "GetTenantUser",
  "UpdateTenantUser",
  "DeleteTenantUser",
  "CreateUser",
  "ListUsers",
  "GetUser",
  "UpdateUser",
  "DeleteUser",
] as const;

export type PermissionAction = typeof PERMISSION_ACTIONS[number];

export interface PermissionCategory {
  key: string;
  actions: string[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    key: "bankTransaction",
    actions: [
      "SearchBankStatement",
      "SearchNetBalance",
      "SearchTransactionHistory",
    ],
  },
  {
    key: "tenant",
    actions: [
      "CreateTenant",
      "ListTenants",
      "GetTenant",
      "UpdateTenant",
      "DeleteTenant",
    ],
  },
  {
    key: "tenantRole",
    actions: [
      "CreateTenantRole",
      "ListTenantRoles",
      "GetTenantRole",
      "UpdateTenantRole",
      "DeleteTenantRole",
    ],
  },
  {
    key: "tenantPermission",
    actions: [
      "CreateTenantPermission",
      "ListTenantPermissions",
      "GetTenantPermission",
      "UpdateTenantPermission",
      "DeleteTenantPermission",
    ],
  },
  {
    key: "tenantUser",
    actions: [
      "CreateTenantUser",
      "ListTenantUsers",
      "GetTenantUser",
      "UpdateTenantUser",
      "DeleteTenantUser",
    ],
  },
  {
    key: "user",
    actions: [
      "CreateUser",
      "ListUsers",
      "GetUser",
      "UpdateUser",
      "DeleteUser",
    ],
  },
];