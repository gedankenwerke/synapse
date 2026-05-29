"use client";

import { useState, useRef } from "react";
import {
  Container,
  Stack,
  Text,
  Loader,
  Center,
  Group,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { IconPlus } from "@tabler/icons-react";
import { usePageGuard } from "@/hooks/usePageGuard";
import { usePatsQuery } from "./hooks/usePatsQuery";
import { useCreatePat, useDeletePat } from "./hooks/usePatMutations";
import { PatsTable } from "./_components/PatsTab/PatsTable";
import {
  CreatePatModal,
  DeletePatModal,
} from "./_components/PatsTab/PatsModals";
import type { Pat } from "@/services/pats/types";
import { ActionGuard } from "@/components/ActionGuard";

export default function PatsPage() {
  const t = useTranslations("pats");
  const tc = useTranslations("common");
  const { allowed, loading: guardLoading } = usePageGuard("ListPats");
  if (guardLoading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

  const [createOpened, createHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);
  const [selectedPat, setSelectedPat] = useState<Pat | null>(null);
  const [createdPat, setCreatedPat] = useState<Pat | null>(null);
  const notifiedRef = useRef(false);

  const { data: pats = [], isLoading } = usePatsQuery();
  const createMutation = useCreatePat();
  const deleteMutation = useDeletePat();

  const handleCreate = async (values: { name: string }) => {
    notifiedRef.current = false;
    try {
      const pat = await createMutation.mutateAsync(values);
      setCreatedPat(pat);
      notifications.show({
        title: tc("success"),
        message: t("success.created"),
        color: "green",
      });
    } catch (error: any) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        notifications.show({
          title: tc("error"),
          message: error?.message || tc("somethingWentWrong"),
          color: "red",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedPat) return;
    notifiedRef.current = false;
    try {
      await deleteMutation.mutateAsync(selectedPat.id);
      notifications.show({
        title: tc("success"),
        message: t("success.deleted"),
        color: "green",
      });
      deleteHandlers.close();
      setSelectedPat(null);
    } catch (error: any) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        notifications.show({
          title: tc("error"),
          message: error?.message || tc("somethingWentWrong"),
          color: "red",
        });
      }
    }
  };

  const openDelete = (pat: Pat) => {
    setSelectedPat(pat);
    deleteHandlers.open();
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="md">
        <Text fz="xl" fw={700}>
          {t("title")}
        </Text>
        <ActionGuard action="CreatePat">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setCreatedPat(null);
              createHandlers.open();
            }}
          >
            {t("createPat")}
          </Button>
        </ActionGuard>
      </Group>

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <PatsTable pats={pats} onDelete={openDelete} />
      )}

      <CreatePatModal
        opened={createOpened}
        onClose={() => {
          setCreatedPat(null);
          createHandlers.close();
        }}
        onSubmit={handleCreate}
        loading={createMutation.isPending}
        createdPat={createdPat}
      />

      <DeletePatModal
        opened={deleteOpened}
        onClose={deleteHandlers.close}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        patName={selectedPat?.name ?? ""}
      />
    </Container>
  );
}