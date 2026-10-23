"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/utils/errors";
import { listParamsToSearch } from "@/utils/zod";
import type { ListParams, ListResponse } from "@/utils/zod";

import type { ProjectRow } from "./project.schema";

export const projectKeys = {
  all: ["projects"] as const,
  list: (params: ListParams) => ["projects", "list", params] as const,
};

export function useProjects(params: ListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/projects?${listParamsToSearch(params)}`, {
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
      return res.json() as Promise<ListResponse<ProjectRow>>;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}
