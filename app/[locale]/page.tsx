"use client";

import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Center,
  Box,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { authentication } from "@/services/authentication";
import { useAppStore, getLayer } from "@/store/useAppStore";
import { usePermissionStore } from "@/store/usePermissionStore";
import { IconAlertCircle } from "@tabler/icons-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { setLogin } = useAppStore();

  const t = useTranslations("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      setError(t("error.fieldsRequired"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authentication.login({
        username,
        password,
      });

      setLogin(response.data.access_token, response.data.refresh_token, response.data.user);
      await usePermissionStore.getState().fetchPolicies();
      await usePermissionStore.getState().fetchUserPermissions();
      const layer = getLayer();
      router.push(`/${layer}/dashboard`);
    } catch (err: any) {
      const errorMessage = err?.message || t("error.loginFailed");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <Box
      mih="100vh"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-color-gray-1)",
      }}
    >
      <Box pos="absolute" top="1rem" right="1rem">
        <LanguageSwitcher variant="segmented" />
      </Box>

      <Paper shadow="sm" p="xl" radius="md" w={420}>
        <Center mb="lg">
          <Stack align="center" gap={4}>
            <Title fw={900} c="orange" order={2}>
              {t("title")}
            </Title>
            <Text c="dimmed" size="sm">
              {t("subtitle")}
            </Text>
          </Stack>
        </Center>

        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              title={t("error.title")}
            >
              {error}
            </Alert>
          )}

          <TextInput
            label={t("form.username")}
            placeholder={t("form.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            disabled={loading}
            onKeyPress={handleKeyPress}
          />

          <PasswordInput
            label={t("form.password")}
            placeholder={t("form.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            disabled={loading}
            onKeyPress={handleKeyPress}
          />

          <Button
            fullWidth
            size="md"
            onClick={handleSignIn}
            loading={loading}
            disabled={!username || !password}
          >
            {loading ? t("button.loading") : t("button.submit")}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}