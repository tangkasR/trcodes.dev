"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/utils/errors";
import { listParamsToSearch } from "@/utils/zod";
import type { ListParams, ListResponse } from "@/utils/zod";


import type { ContactLinkRow } from "./contact-link.schema";

export const contactLinkKeys = {
  all: ["contact-links"] as const,
  list: (params: ListParams) => ["contact-links", "list", params] as const,
};

export function useContactLinks(params: ListParams) {
  return useQuery({
    queryKey: contactLinkKeys.list(params),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/contact-links?${listParamsToSearch(params)}`, {
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
      return res.json() as Promise<ListResponse<ContactLinkRow>>;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}
