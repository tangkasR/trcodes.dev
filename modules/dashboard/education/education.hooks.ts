"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/utils/errors";
import { listParamsToSearch } from "@/utils/zod";
import type { ListParams, ListResponse } from "@/utils/zod";

import type { EducationRow } from "./education.schema";

export const educationKeys = {
  all: ["educations"] as const,
  list: (params: ListParams) => ["educations", "list", params] as const,
};

export function useEducations(params: ListParams) {
  return useQuery({
    queryKey: educationKeys.list(params),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/educations?${listParamsToSearch(params)}`, {
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
      return res.json() as Promise<ListResponse<EducationRow>>;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}
