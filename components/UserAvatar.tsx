"use client";

import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Avatar, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import {
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { useAppStore } from "@/store/useAppStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useQuery } from "@tanstack/react-query";
import { tenant } from "@/services/tenant";

export function UserAvatar() {
  const router = useRouter();
  const { user, setLogout } = useAppStore();
  const t = useTranslations("user");

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => tenant.list(),
    staleTime: 60_000,
    enabled: !!user,
  });

  const handleLogout = () => {
    setLogout();
    router.push("/");
  };

  const initials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "U";

  const tenantName = user?.tenant_id
    ? tenants.find((t) => t.id === user.tenant_id)?.name
    : undefined;

  const roleLabel = user?.isSuperAdmin
    ? t("role.superAdmin")
    : undefined;

  const subtitle = tenantName && roleLabel
    ? `${tenantName} / ${roleLabel}`
    : tenantName ?? roleLabel ?? t("role.superAdmin");

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar size={36} radius="xl" color="orange">
              {initials}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {user?.username ?? t("unknown")}
              </Text>
              <Text size="xs" c="dimmed">
                {subtitle}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t("menu.account")}</Menu.Label>
        <Menu.Item leftSection={<IconUserCircle size={14} />}>
          {t("menu.profile")}
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          {t("menu.settings")}
        </Menu.Item>
        <Menu.Divider />
        <LanguageSwitcher variant="menu" />
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          {t("menu.logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}