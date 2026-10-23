import { NextResponse, type NextRequest } from "next/server";
import { apiError, PRIVATE_HEADERS } from "@/utils/api";
import { requirePermission } from "@/lib/auth";
import { listParamsSchema } from "@/utils/zod";
import { getEducations } from "@/modules/dashboard/education/education.queries";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("education", "read");
    const params = listParamsSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    const data = await getEducations(params);
    return NextResponse.json(
      { ...data, page: params.page, limit: params.limit },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    return apiError(e);
  }
}
