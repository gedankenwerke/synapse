"use client";

import { ActionIcon, Anchor, Breadcrumbs, Group, Text } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { UserAvatar } from "@/components/UserAvatar";
import { useAppStore } from "@/store/useAppStore";
import { getHomePath } from "@/utils/role";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderBarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function HeaderBar({ breadcrumbs }: HeaderBarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumb");
  const ta = useTranslations("a11y");
  const userRole = useAppStore((s) => s.userRole);
  const { colorScheme, toggleColorScheme } = useAppStore();

  const items = breadcrumbs ?? (() => {
    const homeHref = getHomePath(userRole);
    const routeConfig: Record<string, { labelKey: string }[]> = {
      "/superadmin": [{ labelKey: "superadmin" }],
      "/senior": [{ labelKey: "dashboard" }],
      "/agent": [{ labelKey: "dashboard" }],
      "/account-statement": [{ labelKey: "accountStatement" }],
      "/net-balance": [{ labelKey: "netBalance" }],
      "/deposits-withdrawals": [{ labelKey: "transaction" }],
      "/customer-settlement": [{ labelKey: "customerSettlement" }],
      "/pay-agent": [{ labelKey: "payAgent" }],
      "/user-management": [{ labelKey: "userManagement" }],
      "/transactions": [{ labelKey: "transactions" }],
    };
    const routeItems = routeConfig[pathname];
    if (routeItems) {
      return [
        { label: t("home"), href: `/${locale}${homeHref}` } as BreadcrumbItem,
        ...routeItems.map((item): BreadcrumbItem => ({ label: t(item.labelKey) })),
      ];
    }
    return [{ label: t("home"), href: `/${locale}${homeHref}` } as BreadcrumbItem];
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