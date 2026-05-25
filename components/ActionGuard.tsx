"use client";

import { usePermissionStore } from "@/store/usePermissionStore";

interface ActionGuardProps {
  action: string;
  children: React.ReactNode;
}

export function ActionGuard({ action, children }: ActionGuardProps) {
  const hasAction = usePermissionStore((s) => s.hasAction);

  if (!hasAction(action)) return null;

  return <>{children}</>;
}