"use client";

import { ActionIcon, Anchor, Breadcrumbs, Group, Text } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { UserAvatar } from "@/components/UserAvatar";
import { useAppStore } from "@/store/useAppStore";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderBarProps {
  breadcrumbs?: BreadcrumbItem[];
}

const ROUTE_BREADCRUMBS: Record<string, { labelKey: string; hrefKey?: string }[]> = {
  "/dashboard": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "dashboard" }],
  "/account-statement": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "accountStatement" }],
  "/net-balance": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "netBalance" }],
  "/deposits-withdrawals": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "transaction" }],
  "/customer-settlement": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "customerSettlement" }],
  "/pay-agent": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "payAgent" }],
  "/user-management": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "userManagement" }],
  "/transactions": [{ labelKey: "home", hrefKey: "/dashboard" }, { labelKey: "transactions" }],
};

export function HeaderBar({ breadcrumbs }: HeaderBarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumb");
  const ta = useTranslations("a11y");
  const items = breadcrumbs ?? (() => {
    const routeItems = ROUTE_BREADCRUMBS[pathname];
    if (routeItems) {
      return routeItems.map((item) => ({
        label: t(item.labelKey),
        href: item.hrefKey ? `/${locale}${item.hrefKey}` : undefined,
      }));
    }
    return [{ label: t("home"), href: `/${locale}` }, { label: t("dashboard") }];
  })();
  const { colorScheme, toggleColorScheme } = useAppStore();

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