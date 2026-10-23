"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/utils/errors";
import { listParamsToSearch } from "@/utils/zod";
import type { ListParams, ListResponse } from "@/utils/zod";

import type { ExperienceRow } from "./experience.schema";

export const experienceKeys = {
  all: ["experiences"] as const,
  list: (params: ListParams) => ["experiences", "list", params] as const,
};

export function useExperiences(params: ListParams) {
  return useQuery({
    queryKey: experienceKeys.list(params),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/experiences?${listParamsToSearch(params)}`, {
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
      return res.json() as Promise<ListResponse<ExperienceRow>>;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}
