"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/utils/errors";
import { listParamsToSearch } from "@/utils/zod";
import type { ListParams, ListResponse } from "@/utils/zod";

import type { ChapterRow } from "./chapter.schema";

export const chapterKeys = {
  all: ["chapters"] as const,
  project: (projectUuid: string) => ["chapters", "project", projectUuid] as const,
  list: (projectUuid: string, params: ListParams) =>
    ["chapters", "project", projectUuid, "list", params] as const,
};

export function useChapters(projectUuid: string, params: ListParams) {
  return useQuery({
    queryKey: chapterKeys.list(projectUuid, params),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/projects/${projectUuid}/chapters?${listParamsToSearch(params)}`, {
        signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(
          res.status,
          typeof body?.message === "string" ? body.message : "Gagal memuat data"
        );
      }
      return res.json() as Promise<ListResponse<ChapterRow>>;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    enabled: !!projectUuid,
  });
}
