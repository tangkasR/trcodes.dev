import { NextResponse, type NextRequest } from "next/server";
import { apiError, PRIVATE_HEADERS } from "@/utils/api";
import { requirePermission } from "@/lib/auth";
import { listParamsSchema } from "@/utils/zod";
import { getContactLinks } from "@/modules/dashboard/contact-link/contact-link.queries";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("contact-link", "read");
    const params = listParamsSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    const data = await getContactLinks(params);
    return NextResponse.json(
      { ...data, page: params.page, limit: params.limit },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    return apiError(e);
  }
}
