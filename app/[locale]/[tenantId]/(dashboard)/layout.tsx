"use client";

import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { TenantGuard } from "@/components/TenantGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantId = params.tenantId as string;

  return (
    <AuthGuard>
      <TenantGuard tenantId={tenantId}>
        {children}
      </TenantGuard>
    </AuthGuard>
  );
}