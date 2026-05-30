"use client";

import { ActionIcon, Anchor, Breadcrumbs, Group, Text } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { useAppStore } from "@/store/useAppStore";
import { tenantHomePath } from "@/utils/role";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderBarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function HeaderBar({ breadcrumbs }: HeaderBarProps) {
  const pathname = usePathname();
  const params = useParams();
  const tenantId = params.tenantId as string;
  const t = useTranslations("breadcrumb");
  const ta = useTranslations("a11y");
  const { colorScheme, toggleColorScheme } = useAppStore();

  const items = breadcrumbs ?? (() => {
    const homeHref = tenantHomePath(tenantId);
    // pathname from next-intl excludes locale prefix: e.g. "/1/dashboard"
    // Route config uses paths without tenantId prefix — we match by suffix
    const routeConfig: Record<string, { labelKey: string }[]> = {
      "/dashboard": [{ labelKey: "dashboard" }],
      "/account-statement": [{ labelKey: "accountStatement" }],
      "/net-balance": [{ labelKey: "netBalance" }],
      "/deposits-withdrawals": [{ labelKey: "transaction" }],
      "/customer-settlement": [{ labelKey: "customerSettlement" }],
      "/pay-agent": [{ labelKey: "payAgent" }],
      "/user-management": [{ labelKey: "userManagement" }],
      "/transactions": [{ labelKey: "transactions" }],
    };
    // Match by stripping tenantId from the path: /{tenantId}/dashboard → /dashboard
    const pathWithoutTenant = pathname.replace(/^\/[^/]+/, "") || "/";
    const routeItems = routeConfig[pathWithoutTenant];
    if (routeItems) {
      return [
        { label: t("home"), href: homeHref } as BreadcrumbItem,
        ...routeItems.map((item): BreadcrumbItem => ({ label: t(item.labelKey) })),
      ];
    }
    return [{ label: t("home"), href: homeHref } as BreadcrumbItem];
  })();

  return (
    <Group h="100%" justify="space-between" px="md">
      <Group gap="md">
        <Breadcrumbs separator="/">
          {items.map((item, index) =>
            item.href ? (
              <Anchor key={index} component={Link} href={item.href} size="sm">
                {item.label}
              </Anchor>
            ) : (
              <Text key={index} size="sm" fw={500}>
                {item.label}
              </Text>
            )
          )}
        </Breadcrumbs>
      </Group>

      <Group gap="xs">
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={toggleColorScheme}
          aria-label={ta("toggleColorScheme")}
        >
          {colorScheme === "light" ? <IconMoonStars size={18} /> : <IconSun size={18} />}
        </ActionIcon>
        <UserAvatar />
      </Group>
    </Group>
  );
}