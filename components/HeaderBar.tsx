"use client";

import { ActionIcon, Anchor, Breadcrumbs, Group, Text } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/UserAvatar";
import { useAppStore } from "@/store/useAppStore";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderBarProps {
  breadcrumbs?: BreadcrumbItem[];
}

/** Layer prefixes used in 3-layer routing */
const LAYER_PREFIXES = ["/superadmin", "/senior", "/user"];

/**
 * Strip the layer prefix from a pathname to get the route suffix.
 * e.g. "/superadmin/dashboard" → "/dashboard"
 */
function stripLayerPrefix(pathname: string): { layer: string; suffix: string } {
  for (const prefix of LAYER_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return { layer: prefix, suffix: pathname.slice(prefix.length) || "/" };
    }
  }
  return { layer: "", suffix: pathname };
}

const ROUTE_BREADCRUMBS: Record<string, { labelKey: string; hrefSuffix?: string }[]> = {
  "/dashboard": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "dashboard" }],
  "/account-statement": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "accountStatement" }],
  "/net-balance": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "netBalance" }],
  "/deposits-withdrawals": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "transaction" }],
  "/settlement": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "settlement" }],
  "/pay-agent": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "payAgent" }],
  "/user-management": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "userManagement" }],
  "/tenants": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "tenants" }],
  "/policies": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "policies" }],
  "/transactions": [{ labelKey: "home", hrefSuffix: "/dashboard" }, { labelKey: "transactions" }],
};

export function HeaderBar({ breadcrumbs }: HeaderBarProps) {
  const pathname = usePathname();
  const t = useTranslations("breadcrumb");
  const ta = useTranslations("a11y");
  const items = breadcrumbs ?? (() => {
    const { layer, suffix } = stripLayerPrefix(pathname);
    const routeItems = ROUTE_BREADCRUMBS[suffix];
    if (routeItems) {
      return routeItems.map((item) => ({
        label: t(item.labelKey),
        href: item.hrefSuffix ? `${layer}${item.hrefSuffix}` : undefined,
      }));
    }
    return [{ label: t("home"), href: `${layer}/dashboard` }, { label: t("dashboard") }];
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