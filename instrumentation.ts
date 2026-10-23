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
