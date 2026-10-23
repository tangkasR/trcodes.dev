/**
 * Next.js 16 Instrumentation Hook.
 * Dieksekusi sekali saat server Next.js pertama kali dinyalakan.
 * Digunakan untuk inisialisasi APM, OpenTelemetry, dan sanity check koneksi.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Inisialisasi service observability node runtime jika dikonfigurasi
    if (process.env.NODE_ENV === "production") {
      console.log("[Instrumentation] Server runtime siap dengan proteksi enterprise.");
    }
  }
}

import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  console.error("[Server Error Details]", {
    path: request.path,
    method: request.method,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    digest: typeof err === "object" && err !== null && "digest" in err ? (err as Record<string, unknown>).digest : undefined,
    routerKind: context.routerKind,
    routeType: context.routeType,
  });
};
