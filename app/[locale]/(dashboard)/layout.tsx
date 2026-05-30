"use client";

import { AuthGuard } from "@/components/AuthGuard";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}