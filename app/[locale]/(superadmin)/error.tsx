"use client";

import { Container, Group, Text, Title, Button } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <Container size="sm" py="xl">
      <Title order={2} ta="center" mb="md">
        {t("error")}
      </Title>
      <Text c="dimmed" ta="center" mb="lg">
        {error.message || t("somethingWentWrong")}
      </Text>
      <Group justify="center">
        <Button onClick={reset}>{t("tryAgain")}</Button>
      </Group>
    </Container>
  );
}