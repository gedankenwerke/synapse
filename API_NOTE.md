# Synapse API Reference — Tested 2026-05-25

**Base URL:** `http://203.156.127.23:18080/api/v1`

## Response Wrapper

Most endpoints return:

```json
{
  "code": 1,        // 1 = success
  "data": ...,      // payload
  "message": "..."  // human-readable
}
```

## Auth

All protected endpoints require `Authorization: Bearer <access_token>` header.

### POST /login

```bash
curl http://203.156.127.23:18080/api/v1/login \
  -X POST -H 'Content-Type: application/json' \
  -d '{"username": "string", "password": "string"}'
```

Response: `{ code, data: { access_token, refresh_token, token_type: "Bearer", expires_in: 900, user: { id, username, tenant_id, created_at, updated_at } } }`

No role/permissions field yet.

### POST /me

```bash
curl http://203.156.127.23:18080/api/v1/me \
  -X POST -H 'Authorization: Bearer <token>'
```

Response: `{ code, data: { id, username, tenant_id, created_at, updated_at } }`

### GET /token

Generate new token pair using current access token.

```bash
curl http://203.156.127.23:18080/api/v1/token \
  -H 'Authorization: Bearer <token>'
```

Response: `{ code, data: { access_token, refresh_token, token_type, expires_in } }`

### POST /token/refresh

```bash
curl http://203.156.127.23:18080/api/v1/token/refresh \
  -X POST -H 'Content-Type: application/json' \
  -d '{"refresh_token": "<refresh_token>"}'
```

Response: same as `/token`

## Health

```bash
curl http://203.156.127.23:18080/api/v1/health
```

Response: `{ code: 200 }`

## Policy

### GET /policies

```bash
curl http://203.156.127.23:18080/api/v1/policies \
  -H 'Authorization: Bearer <token>'
```

Response: `{ code, data: { policies: [{ name, detail, superadmin_only }] } }`

**28 policies found:**

| Name | Detail | SuperAdmin Only |
|------|--------|----------------|
| ListPolicies | ดูรายการนโยบาย | true |
| UpdateTenantRole | แก้ไขบทบาทเทนแนนท์ | false |
| GetTenantRole | ดูรายละเอียดบทบาทเทนแนนท์ | false |
| AssignPermissions | กำหนดสิทธิ์ให้บทบาท | false |
| UpdateTenant | แก้ไขเทนแนนท์ | false |
| ChangeUserRole | เปลี่ยนบทบาทผู้ใช้เทนแนนท์ | false |
| ListTenantUsers | ดูรายการผู้ใช้เทนแนนท์ | false |
| DeleteTenant | ลบเทนแนนท์ | false |
| DeassignPermissions | ลบสิทธิ์จากบทบาท | false |
| SearchTransactionHistory | ค้นหาประวัติธุรกรรม | false |
| UpdateUser | แก้ไขผู้ใช้ | false |
| GetTenant | ดูรายละเอียดเทนแนนท์ | false |
| DeleteTenantUser | ลบผู้ใช้เทนแนนท์ | false |
| CreateTenant | สร้างเทนแนนท์ | false |
| Settlement | ยืนยันการถอนเงิน | true |
| DeleteUser | ลบผู้ใช้ | false |
| DeleteTenantRole | ลบบทบาทเทนแนนท์ | false |
| CreateTenantRole | สร้างบทบาทเทนแนนท์ | false |
| ListTenantRoles | ดูรายการบทบาทเทนแนนท์ | false |
| CreateUser | สร้างผู้ใช้ | false |
| CreateTenantUser | สร้างผู้ใช้เทนแนนท์ | false |
| SearchBankStatement | ค้นหาสมุดบัญชี | false |
| CreatePayAgent | สร้างเอเจนท์รับชำระเงิน | true |
| ListTenants | ดูรายการเทนแนนท์ | false |
| SearchNetBalance | ค้นหาสุทธิรายวัน | false |
| ListUsers | ดูรายการผู้ใช้ | false |
| ReloadPolicies | โหลดนโยบายใหม่ | true |
| GetUser | ดูรายละเอียดผู้ใช้ | false |

### POST /policies/reload

SuperAdmin only. Returns `{ code, data: "policies reloaded" }`

## Tenant

**Note:** API returns **PascalCase** field names: `ID`, `Name`, `ParentID`, `CreatedAt`, `UpdatedAt`

### GET /tenants

Query: `parent_id` (optional)

Returns: `{ code, data: [{ ID, ParentID, Name, CreatedAt, UpdatedAt }] }`

### GET /tenants/{id}

Returns single tenant object.

### POST /tenants

Body: `{ name, parent_id }`

### PUT /tenants/{id}

Body: `{ name?, parent_id? }`

### DELETE /tenants/{id}

Returns: `{ code, data: <deleted_id> }`

## TenantRole

### GET /tenant-roles

Query: `tenant_id` (optional)

Returns: `{ code, data: [{ ID, TenantID, Name, CreatedAt, UpdatedAt }] }`

### GET /tenant-roles/{id}

Returns single role object.

### POST /tenant-roles

Body: `{ name, tenant_id }`

### PUT /tenant-roles/{id}

Body: `{ name? }`

### DELETE /tenant-roles/{id}

Returns: `{ code, data: <deleted_id> }`

### POST /tenant-roles/{id}/permissions

Assign actions to a role.

Body: `{ actions: ["ListUsers", "CreateUser"] }`

Returns: `{ code, data: [{ ID, RoleID, Action, CreatedAt, UpdatedAt }] }`

### DELETE /tenant-roles/{id}/permissions

Remove actions from a role.

Body: `{ actions: ["ListUsers"] }`

Returns: `{ code, data: <count_removed> }`

## TenantUser

### GET /tenant-users

Query: `tenant_id`, `user_id` (both optional)

Returns: `{ code, data: [{ ID, TenantID, TenantRoleID, UserID, CreatedAt, UpdatedAt }] }`

### POST /tenant-users

Body: `{ tenant_id, tenant_role_id, user_id }`

### DELETE /tenant-users/{id}

Returns: `{ code, data: <deleted_id> }`

### PUT /tenant-users/{id}/role

Body: `{ tenant_role_id }`

Returns: updated tenant-user record.

**Note:** `GET /tenant-users/{id}` returns 404 — not implemented.

## User

### GET /users

Query: `before`, `after` (cursors), `limit` (default 25, max 100), `username` (LIKE filter), `tenant_id`

Returns: `{ code, data: { Items: [{ ID, Username, Password, TenantID, CreatedAt, UpdatedAt }], Before, After, Limit, Total } }`

### GET /users/{id}

Returns single user object.

### POST /users

Body: `{ username, password, tenant_id }`

### PUT /users/{id}

Body: partial update fields.

### DELETE /users/{id}

Returns: `{ code, data: <deleted_id> }`

## Bank (all cursor-paginated)

Common request body: `{ after?, before?, end_date_time, limit, start_date_time }`

Common response: `{ code, data: { Before, After, Items: [...], Limit, StartDateTime, EndDateTime, Header: {...} } }`

### POST /search-bank-statement

Items: `{ ClientID, AcctID, Trno, Trdate, TransDate, AcctBank, AcctNo, TransName, Channel, TransType, NameTh, NameEn, Amount, AcctAvail, UClientID, ReqTransID, DpwdTransID, Status, CreateDate, UpdateDate }`

### POST /search-net-balance

Items: `{ ClientID, AcctID, YearMonthDay, AcctDeposit, AcctWithdraw, CreateDate, UpdateDate }`

### POST /search-transaction-history

Items: `{ CreateDate, DPwdTransID, AcctID, UClientID, ReqTransID, TransType, DPWDAmt, DWS, CS, SendID, SendStatus, ResStatus, UserID, TAcctBank, TAcctNo, Remark2 }`

## PayAgent

### POST /add-pay-agent

Body: `{ aglevel, clientidadd, parentclient }`

`aglevel` enum: Company, Director, AD, SM, Manager, Super, Senior, Master, Agent

Returns: `{ code, data: { admin_id, admin_password, api_endpoint, backend, callback_key, client_id, key } }`

## Settlement

### POST /settlement

Body: `{ acctbank, acctno, amount, clientid, userid, ip?, remark?, settlement }`

Returns: `{ code, data: { message, result: { amount, bankstatus, date, id, tacctbank, tacctname, tacctno }, status, withdraw } }`

---

## Key Notes

- **Field naming**: Auth endpoints (`/login`, `/me`) return **snake_case**. All other endpoints return **PascalCase** (`ID`, `Name`, `CreatedAt`, etc.)
- **Auth header**: Must use `Authorization: Bearer <token>` (bare token returns 401 "invalid authorization token format")
- **Token expiry**: `expires_in: 900` (15 minutes)
- **Not implemented**: `GET /tenant-users/{id}` returns 404
- **SuperAdminOnly policies**: ListPolicies, Settlement, CreatePayAgent, ReloadPolicies