import "server-only";

type LogLevel = "info" | "warn" | "error" | "debug";

export type TelemetryEvent = {
  name: string;
  durationMs?: number;
  properties?: Record<string, unknown>;
  error?: Error | unknown;
};

/**
 * Enterprise Telemetry & APM Observability layer.
 * Memungkinkan distributed tracing, latency profiling, dan structured error logging.
 */
class TelemetryService {
  private formatLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(meta ? { meta } : {}),
    };
    return JSON.stringify(payload);
  }

  info(message: string, meta?: Record<string, unknown>) {
    console.log(this.formatLog("info", message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.formatLog("warn", message, meta));
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    const errorDetails =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
        : { error };
    console.error(this.formatLog("error", message, { ...meta, ...errorDetails }));
  }

  /**
   * Profiler untuk mengukur latensi eksekusi query atau mutasi kritis (p95/p99 tracking).
   */
  async measure<T>(name: string, fn: () => Promise<T>, meta?: Record<string, unknown>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      if (durationMs > 500) {
        this.warn(`[Slow Operation] ${name} memakan waktu ${durationMs}ms`, { ...meta, durationMs });
      }
      return result;
    } catch (err) {
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      this.error(`[Operation Failed] ${name} gagal setelah ${durationMs}ms`, err, { ...meta, durationMs });
      throw err;
    }
  }
}

export const telemetry = new TelemetryService();
