import { NextResponse, type NextRequest } from "next/server";
import { apiError, PRIVATE_HEADERS } from "@/utils/api";
import { requirePermission } from "@/lib/auth";
import { listParamsSchema, uuidSchema } from "@/utils/zod";

import { getChaptersByProject } from "@/modules/dashboard/chapter/chapter.queries";

type RouteContext = {
  params: Promise<{ uuid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requirePermission("chapter", "read");
    const { uuid } = await context.params;
    const projectUuid = uuidSchema.parse(uuid);

    const params = listParamsSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    const data = await getChaptersByProject(projectUuid, params);
    return NextResponse.json(
      { ...data, page: params.page, limit: params.limit },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    return apiError(e);
  }
}
