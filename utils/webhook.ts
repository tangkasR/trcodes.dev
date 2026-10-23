import { createHmac, timingSafeEqual } from "crypto";

/**
 * Utilitas Enterprise Webhook Signature Verification.
 * Mencegah serangan timing attack dan tampering pada payload webhook pihak ketiga.
 */

export function signHmacSha256(payload: string | Buffer, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmacSha256(
  payload: string | Buffer,
  headerSignature: string,
  secret: string
): boolean {
  if (!headerSignature || !secret) return false;

  const expectedSignature = signHmacSha256(payload, secret);
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const providedBuffer = Buffer.from(headerSignature.replace(/^sha256=/i, ""), "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}
