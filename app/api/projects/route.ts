import { NextResponse, type NextRequest } from "next/server";
import { apiError, PRIVATE_HEADERS } from "@/utils/api";
import { requirePermission } from "@/lib/auth";
import { listParamsSchema } from "@/utils/zod";
import { getProjects } from "@/modules/dashboard/project/project.queries";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("project", "read");
    const params = listParamsSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    const data = await getProjects(params);
    return NextResponse.json(
      { ...data, page: params.page, limit: params.limit },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    return apiError(e);
  }
}
