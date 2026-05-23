#!/bin/bash
# Seed test users for 3-layer architecture
# Creates 2 tenants + 6 users (superadmin, senior, user per tenant)
#
# Usage: bash seed-test-users.sh <BASE_URL> <ADMIN_USERNAME> <ADMIN_PASSWORD>
# Example: bash seed-test-users.sh http://192.168.144.74:18080/api/v1 admin password123

BASE_URL="${1:-http://192.168.144.74:18080/api/v1}"
USERNAME="${2:?Usage: bash seed-test-users.sh BASE_URL USERNAME PASSWORD}"
PASSWORD="${3:?Usage: bash seed-test-users.sh BASE_URL USERNAME PASSWORD}"

set -e

echo "========================================="
echo " Synapse Test User Seeder"
echo " Base URL: $BASE_URL"
echo "========================================="

# ── Login ──
echo ""
echo "[1/7] Logging in..."
LOGIN_RESP=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Login failed. Response:"
  echo "$LOGIN_RESP"
  exit 1
fi

echo "✓ Logged in successfully"

AUTH_HEADER="Authorization: Bearer $TOKEN"

# ── Create Tenants ──
echo ""
echo "[2/7] Creating tenants..."

TENANT_A_RESP=$(curl -s -X POST "$BASE_URL/tenants" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{"Name": "Acme Corp"}')
TENANT_A_ID=$(echo "$TENANT_A_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant A (Acme Corp): $TENANT_A_ID"

TENANT_B_RESP=$(curl -s -X POST "$BASE_URL/tenants" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{"Name": "Beta Inc"}')
TENANT_B_ID=$(echo "$TENANT_B_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant B (Beta Inc): $TENANT_B_ID"

# ── Create Tenant Roles ──
echo ""
echo "[3/7] Creating tenant roles..."

# Tenant A roles
ROLE_A_SENIOR_RESP=$(curl -s -X POST "$BASE_URL/tenant-roles" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Name\": \"Senior Admin\", \"TenantID\": \"$TENANT_A_ID\"}")
ROLE_A_SENIOR_ID=$(echo "$ROLE_A_SENIOR_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant A Senior Admin role: $ROLE_A_SENIOR_ID"

ROLE_A_USER_RESP=$(curl -s -X POST "$BASE_URL/tenant-roles" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Name\": \"Operator\", \"TenantID\": \"$TENANT_A_ID\"}")
ROLE_A_USER_ID=$(echo "$ROLE_A_USER_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant A Operator role: $ROLE_A_USER_ID"

# Tenant B roles
ROLE_B_SENIOR_RESP=$(curl -s -X POST "$BASE_URL/tenant-roles" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Name\": \"Senior Admin\", \"TenantID\": \"$TENANT_B_ID\"}")
ROLE_B_SENIOR_ID=$(echo "$ROLE_B_SENIOR_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant B Senior Admin role: $ROLE_B_SENIOR_ID"

ROLE_B_USER_RESP=$(curl -s -X POST "$BASE_URL/tenant-roles" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Name\": \"Operator\", \"TenantID\": \"$TENANT_B_ID\"}")
ROLE_B_USER_ID=$(echo "$ROLE_B_USER_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Tenant B Operator role: $ROLE_B_USER_ID"

# ── Create Users ──
echo ""
echo "[4/7] Creating users..."

# Superadmin (Tenant 1 = the system tenant)
SA_RESP=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{"Username": "superadmin", "Password": "superadmin123", "TenantID": "1"}')
SA_ID=$(echo "$SA_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Superadmin user: superadmin / superadmin123 (ID: $SA_ID)"

# Tenant A - Senior
TA_SENIOR_RESP=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Username\": \"acme.senior\", \"Password\": \"senior123\", \"TenantID\": \"$TENANT_A_ID\"}")
TA_SENIOR_ID=$(echo "$TA_SENIOR_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Acme Senior user: acme.senior / senior123 (ID: $TA_SENIOR_ID)"

# Tenant A - User
TA_USER_RESP=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Username\": \"acme.user\", \"Password\": \"user123\", \"TenantID\": \"$TENANT_A_ID\"}")
TA_USER_ID=$(echo "$TA_USER_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Acme User user: acme.user / user123 (ID: $TA_USER_ID)"

# Tenant B - Senior
TB_SENIOR_RESP=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Username\": \"beta.senior\", \"Password\": \"senior123\", \"TenantID\": \"$TENANT_B_ID\"}")
TB_SENIOR_ID=$(echo "$TB_SENIOR_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Beta Senior user: beta.senior / senior123 (ID: $TB_SENIOR_ID)"

# Tenant B - User
TB_USER_RESP=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"Username\": \"beta.user\", \"Password\": \"user123\", \"TenantID\": \"$TENANT_B_ID\"}")
TB_USER_ID=$(echo "$TB_USER_RESP" | grep -o '"ID":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Beta User user: beta.user / user123 (ID: $TB_USER_ID)"

# ── Assign Tenant Users (map users to roles) ──
echo ""
echo "[5/7] Assigning users to tenant roles..."

# Superadmin to Tenant 1 (system tenant) - no role assignment needed for superadmin
echo "✓ Superadmin in system tenant (no role assignment needed)"

# Tenant A Senior
curl -s -X POST "$BASE_URL/tenant-users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"UserID\": \"$TA_SENIOR_ID\", \"TenantID\": \"$TENANT_A_ID\", \"TenantRoleID\": \"$ROLE_A_SENIOR_ID\"}" > /dev/null
echo "✓ acme.senior → Tenant A Senior Admin role"

# Tenant A User
curl -s -X POST "$BASE_URL/tenant-users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"UserID\": \"$TA_USER_ID\", \"TenantID\": \"$TENANT_A_ID\", \"TenantRoleID\": \"$ROLE_A_USER_ID\"}" > /dev/null
echo "✓ acme.user → Tenant A Operator role"

# Tenant B Senior
curl -s -X POST "$BASE_URL/tenant-users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"UserID\": \"$TB_SENIOR_ID\", \"TenantID\": \"$TENANT_B_ID\", \"TenantRoleID\": \"$ROLE_B_SENIOR_ID\"}" > /dev/null
echo "✓ beta.senior → Tenant B Senior Admin role"

# Tenant B User
curl -s -X POST "$BASE_URL/tenant-users" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"UserID\": \"$TB_USER_ID\", \"TenantID\": \"$TENANT_B_ID\", \"TenantRoleID\": \"$ROLE_B_USER_ID\"}" > /dev/null
echo "✓ beta.user → Tenant B Operator role"

# ── Assign Permissions to Roles ──
echo ""
echo "[6/7] Assigning permissions to roles..."

# Senior Admin gets user management permissions
SENIOR_PERMISSIONS='["ListUsers","GetUser","CreateUser","UpdateUser","DeleteUser","ListTenantUsers","GetTenantUser","CreateTenantUser","UpdateTenantUser","DeleteTenantUser","ListTenantRoles","GetTenantRole","CreateTenantRole","UpdateTenantRole","DeleteTenantRole","ListPolicies","SearchTransactionHistory","SearchNetBalance","SearchBankStatement","Settlement"]'

curl -s -X POST "$BASE_URL/tenant-roles/$ROLE_A_SENIOR_ID/permissions" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"actions\": $SENIOR_PERMISSIONS}" > /dev/null
echo "✓ Tenant A Senior Admin permissions assigned"

curl -s -X POST "$BASE_URL/tenant-roles/$ROLE_B_SENIOR_ID/permissions" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"actions\": $SENIOR_PERMISSIONS}" > /dev/null
echo "✓ Tenant B Senior Admin permissions assigned"

# Operator gets basic wallet permissions
USER_PERMISSIONS='["SearchTransactionHistory","SearchNetBalance","SearchBankStatement","Settlement"]'

curl -s -X POST "$BASE_URL/tenant-roles/$ROLE_A_USER_ID/permissions" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"actions\": $USER_PERMISSIONS}" > /dev/null
echo "✓ Tenant A Operator permissions assigned"

curl -s -X POST "$BASE_URL/tenant-roles/$ROLE_B_USER_ID/permissions" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "{\"actions\": $USER_PERMISSIONS}" > /dev/null
echo "✓ Tenant B Operator permissions assigned"

# ── Summary ──
echo ""
echo "========================================="
echo " ✓ SEED COMPLETE"
echo "========================================="
echo ""
echo " Test Accounts:"
echo " ┌──────────────────────────────────────────────────────────┐"
echo " │ Layer       │ Username      │ Password      │ Tenant     │"
echo " ├──────────────────────────────────────────────────────────┤"
echo " │ Superadmin  │ superadmin    │ superadmin123 │ System (1) │"
echo " │ Senior (A)  │ acme.senior   │ senior123    │ Acme Corp  │"
echo " │ User (A)    │ acme.user     │ user123      │ Acme Corp  │"
echo " │ Senior (B)  │ beta.senior   │ senior123    │ Beta Inc   │"
echo " │ User (B)    │ beta.user     │ user123      │ Beta Inc   │"
echo " └──────────────────────────────────────────────────────────┘"
echo ""
echo " ⚠️  NOTE: Senior and User layers require backend 'role' field."
echo "     Until backend adds role to /login response, use the ?layer="
echo "     query param to test different layers:"
echo ""
echo "     /th/dashboard?layer=superadmin"
echo "     /th/dashboard?layer=senior"
echo "     /th/dashboard?layer=user"
echo ""