/**
 * Seed script for Senior/Agent tenant hierarchy test data.
 *
 * Creates (if missing):
 *   - Building1 (Senior tenant, parent_id="1")
 *   - Building1-Agent (Agent tenant under Building1)
 *   - SeniorAdmin role in Building1 with full management permissions
 *   - AgentOperator role in Building1-Agent with daily operation permissions
 *   - steve user (Senior admin, Building1)
 *   - stand user (Agent operator, Building1-Agent)
 *   - TenantUser assignments linking users to their roles
 *
 * Idempotent: skips creation if entities already exist by name.
 *
 * Usage:
 *   npx tsx scripts/seed.ts [--api-url http://192.168.144.74:8080]
 */

const API_URL = process.argv.find((a) => a.startsWith("--api-url"))
  ? process.argv[process.argv.indexOf("--api-url") + 1]
  : "http://192.168.144.74:8080";

const ADMIN_USERNAME = "string";
const ADMIN_PASSWORD = "string";
const ROOT_TENANT_ID = "1"; // Default root tenant — parent of Senior tenants

// ─── Permissions ──────────────────────────────────────────────────────────────

const SENIOR_ADMIN_ACTIONS = [
  "CreateUser", "ListUsers", "GetUser", "UpdateUser", "DeleteUser",
  "CreateTenant", "ListTenants", "GetTenant", "UpdateTenant", "DeleteTenant",
  "CreateTenantRole", "ListTenantRoles", "GetTenantRole", "UpdateTenantRole", "DeleteTenantRole",
  "CreateTenantPermission", "ListTenantPermissions", "GetTenantPermission", "UpdateTenantPermission", "DeleteTenantPermission",
  "CreateTenantUser", "ListTenantUsers", "GetTenantUser", "UpdateTenantUser", "DeleteTenantUser",
  "SearchBankStatement", "SearchNetBalance", "SearchTransactionHistory",
];

const AGENT_OPERATOR_ACTIONS = [
  "ListUsers", "GetUser", "UpdateUser",
  "GetTenant", "ListTenants",
  "ListTenantRoles", "GetTenantRole",
  "ListTenantPermissions", "GetTenantPermission",
  "ListTenantUsers", "GetTenantUser", "UpdateTenantUser", "CreateTenantUser",
  "SearchBankStatement", "SearchNetBalance", "SearchTransactionHistory",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let token = "";

async function api(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

async function apiIgnore409(method: string, path: string, body?: unknown) {
  try {
    return await api(method, path, body);
  } catch (err: any) {
    // Ignore 409 Conflict (already exists)
    if (err.message.includes("409")) {
      console.log("   (already exists, skipping)");
      return null;
    }
    throw err;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed: Senior/Agent Tenant Hierarchy ===\n");
  console.log(`API URL: ${API_URL}\n`);

  // Step 1: Login as SuperAdmin
  console.log("1. Logging in as SuperAdmin...");
  const loginData = await api("POST", "/api/v1/login", {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });
  token = loginData.token;
  console.log(`   ✓ Logged in. Token: ${token.slice(0, 12)}...`);

  // Step 2: Get existing data
  console.log("\n2. Fetching existing data...");
  const [existingTenants, existingRoles, existingUsers, existingTenantUsers, existingPermissions] = await Promise.all([
    api("GET", "/api/v1/tenants"),
    api("GET", "/api/v1/tenant-roles"),
    api("GET", "/api/v1/users?limit=100").then((r: any) => r.Items ?? r),
    api("GET", "/api/v1/tenant-users"),
    api("GET", "/api/v1/tenant-permissions"),
  ]);

  const tenants: any[] = existingTenants ?? [];
  const roles: any[] = existingRoles ?? [];
  const users: any[] = Array.isArray(existingUsers) ? existingUsers : (existingUsers ?? []);
  const tenantUsers: any[] = existingTenantUsers ?? [];
  const permissions: any[] = existingPermissions ?? [];

  console.log(`   ✓ Found ${tenants.length} tenants, ${roles.length} roles, ${users.length} users`);

  // Step 3: Create or find Building1 (Senior tenant)
  let building1 = tenants.find((t: any) => t.Name === "Building1");
  if (building1) {
    console.log(`\n3. Building1 already exists: ID=${building1.ID}`);
  } else {
    console.log("\n3. Creating Building1 (Senior tenant)...");
    building1 = await api("POST", "/api/v1/tenants", {
      name: "Building1",
      parent_id: ROOT_TENANT_ID,
    });
    console.log(`   ✓ Building1 created: ID=${building1.ID}`);
  }

  // Step 4: Create Building1-Agent (Agent tenant under Building1)
  let building1Agent = tenants.find((t: any) => t.Name === "Building1-Agent");
  if (building1Agent) {
    console.log(`\n4. Building1-Agent already exists: ID=${building1Agent.ID}`);
  } else {
    console.log("\n4. Creating Building1-Agent (Agent tenant)...");
    building1Agent = await api("POST", "/api/v1/tenants", {
      name: "Building1-Agent",
      parent_id: building1.ID,
    });
    console.log(`   ✓ Building1-Agent created: ID=${building1Agent.ID}`);
  }

  // Step 5: Create or find steve user
  const getUserId = (u: any) => u.id || u.ID;
  let steve = users.find((u: any) => u.Username === "steve" || u.username === "steve");
  if (steve) {
    console.log(`\n5. steve already exists: ID=${getUserId(steve)}`);
    // Update home tenant to Building1 if needed
    const steveTenantId = steve.tenant_id || steve.TenantID;
    if (steveTenantId !== building1.ID) {
      console.log(`   Updating steve home tenant from ${steveTenantId} to Building1...`);
      await api("PUT", `/api/v1/users/${getUserId(steve)}`, {
        username: "steve",
        tenant_id: building1.ID,
      });
      console.log("   ✓ Home tenant updated");
    }
  } else {
    console.log("\n5. Creating steve user...");
    steve = await api("POST", "/api/v1/users", {
      username: "steve",
      password: "steve123",
      tenant_id: building1.ID,
    });
    console.log(`   ✓ steve created: ID=${getUserId(steve)}`);
  }

  // Step 6: Create or find stand user
  let stand = users.find((u: any) => u.Username === "stand" || u.username === "stand");
  if (stand) {
    console.log(`\n6. stand already exists: ID=${getUserId(stand)}`);
    // Update home tenant to Building1-Agent if needed
    const standTenantId = stand.tenant_id || stand.TenantID;
    if (standTenantId !== building1Agent.ID) {
      console.log(`   Updating stand home tenant from ${standTenantId} to Building1-Agent...`);
      await api("PUT", `/api/v1/users/${getUserId(stand)}`, {
        username: "stand",
        tenant_id: building1Agent.ID,
      });
      console.log("   ✓ Home tenant updated");
    }
  } else {
    console.log("\n6. Creating stand user...");
    stand = await api("POST", "/api/v1/users", {
      username: "stand",
      password: "stand123",
      tenant_id: building1Agent.ID,
    });
    console.log(`   ✓ stand created: ID=${getUserId(stand)}`);
  }

  // Step 7: Create or find SeniorAdmin role in Building1
  let seniorAdminRole = roles.find((r: any) => r.Name === "SeniorAdmin" && r.TenantID === building1.ID);
  if (seniorAdminRole) {
    console.log(`\n7. SeniorAdmin role already exists: ID=${seniorAdminRole.ID}`);
  } else {
    console.log("\n7. Creating SeniorAdmin role in Building1...");
    seniorAdminRole = await api("POST", "/api/v1/tenant-roles", {
      name: "SeniorAdmin",
      tenant_id: building1.ID,
    });
    console.log(`   ✓ SeniorAdmin role created: ID=${seniorAdminRole.ID}`);
  }

  // Step 8: Create or find AgentOperator role in Building1-Agent
  let agentOperatorRole = roles.find((r: any) => r.Name === "AgentOperator" && r.TenantID === building1Agent.ID);
  if (agentOperatorRole) {
    console.log(`\n8. AgentOperator role already exists: ID=${agentOperatorRole.ID}`);
  } else {
    console.log("\n8. Creating AgentOperator role in Building1-Agent...");
    agentOperatorRole = await api("POST", "/api/v1/tenant-roles", {
      name: "AgentOperator",
      tenant_id: building1Agent.ID,
    });
    console.log(`   ✓ AgentOperator role created: ID=${agentOperatorRole.ID}`);
  }

  // Step 9: Assign SeniorAdmin permissions (skip if already assigned)
  console.log("\n9. Assigning SeniorAdmin permissions...");
  const seniorPermActions = new Set(
    permissions.filter((p: any) => p.RoleID === seniorAdminRole.ID).map((p: any) => p.Action)
  );
  let seniorAdded = 0;
  for (const action of SENIOR_ADMIN_ACTIONS) {
    if (seniorPermActions.has(action)) {
      continue; // Already assigned
    }
    await api("POST", "/api/v1/tenant-permissions", {
      action,
      role_id: seniorAdminRole.ID,
    });
    process.stdout.write(`   ✓ ${action}\n`);
    seniorAdded++;
  }
  if (seniorAdded === 0) console.log("   (all permissions already assigned)");

  // Step 10: Assign AgentOperator permissions (skip if already assigned)
  console.log("\n10. Assigning AgentOperator permissions...");
  const agentPermActions = new Set(
    permissions.filter((p: any) => p.RoleID === agentOperatorRole.ID).map((p: any) => p.Action)
  );
  let agentAdded = 0;
  for (const action of AGENT_OPERATOR_ACTIONS) {
    if (agentPermActions.has(action)) {
      continue; // Already assigned
    }
    await api("POST", "/api/v1/tenant-permissions", {
      action,
      role_id: agentOperatorRole.ID,
    });
    process.stdout.write(`   ✓ ${action}\n`);
    agentAdded++;
  }
  if (agentAdded === 0) console.log("   (all permissions already assigned)");

  // Step 11: Assign steve → Building1 + SeniorAdmin
  const steveId = getUserId(steve);
  const standId = getUserId(stand);
  const steveAssignment = tenantUsers.find(
    (tu: any) => tu.UserID === steveId && tu.TenantID === building1.ID
  );
  if (steveAssignment) {
    console.log("\n11. steve → Building1 assignment already exists (updating role to SeniorAdmin)...");
    await api("PUT", `/api/v1/tenant-users/${steveAssignment.ID}`, {
      tenant_role_id: seniorAdminRole.ID,
    });
    console.log("   ✓ Role updated to SeniorAdmin");
  } else {
    console.log("\n11. Assigning steve to Building1 as SeniorAdmin...");
    await apiIgnore409("POST", "/api/v1/tenant-users", {
      tenant_id: building1.ID,
      user_id: steveId,
      tenant_role_id: seniorAdminRole.ID,
    });
    console.log("   ✓ Assignment created");
  }

  // Step 12: Assign stand → Building1-Agent + AgentOperator
  const standAssignment = tenantUsers.find(
    (tu: any) => tu.UserID === standId && tu.TenantID === building1Agent.ID
  );
  if (standAssignment) {
    console.log("\n12. stand → Building1-Agent assignment already exists (updating role to AgentOperator)...");
    await api("PUT", `/api/v1/tenant-users/${standAssignment.ID}`, {
      tenant_role_id: agentOperatorRole.ID,
    });
    console.log("   ✓ Role updated to AgentOperator");
  } else {
    console.log("\n12. Assigning stand to Building1-Agent as AgentOperator...");
    await apiIgnore409("POST", "/api/v1/tenant-users", {
      tenant_id: building1Agent.ID,
      user_id: standId,
      tenant_role_id: agentOperatorRole.ID,
    });
    console.log("   ✓ Assignment created");
  }

  // Summary
  console.log("\n=== Seed Complete ===\n");
  console.log("Tenants:");
  console.log(`  Building1       (Senior): ${building1.ID} (parent: ${building1.ParentID})`);
  console.log(`  Building1-Agent (Agent):  ${building1Agent.ID} (parent: ${building1Agent.ParentID})`);
  console.log("\nUsers:");
  console.log(`  steve  (ID: ${steveId}) — home tenant: ${steve.tenant_id || steve.TenantID || building1.ID}`);
  console.log(`  stand  (ID: ${standId}) — home tenant: ${stand.tenant_id || stand.TenantID || building1Agent.ID}`);
  console.log("\nRoles:");
  console.log(`  SeniorAdmin   (Building1):         ${seniorAdminRole.ID}`);
  console.log(`  AgentOperator (Building1-Agent):   ${agentOperatorRole.ID}`);
  console.log("\nAssignments:");
  console.log(`  steve  → Building1       / SeniorAdmin`);
  console.log(`  stand  → Building1-Agent  / AgentOperator`);
  console.log("\nLogin credentials:");
  console.log("  string / string  → SuperAdmin (sees everything)");
  console.log("  steve  / steve123 → Senior admin in Building1 (sees Building1 + Building1-Agent)");
  console.log("  stand  / stand123 → Agent operator in Building1-Agent (sees only Building1-Agent)");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});