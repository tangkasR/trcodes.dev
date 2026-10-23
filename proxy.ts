// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/config";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/login/mfa",
  "/experiences",
  "/blog",
  "/llms.txt",
  "/llms-full.txt",
  "/robots.txt",
  "/sitemap.xml",
];

const isDevelopment = process.env.NODE_ENV === "development";

function createContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    isDevelopment
      ? // HMR membutuhkan eval dan inline script.
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : // Next.js menempelkan nonce ke script framework dan bootstrap-nya.
        `script-src 'self' 'nonce-${nonce}'`,
    isDevelopment
      ? // HMR dan React dev overlay menyuntikkan style inline.
        "style-src 'self' 'unsafe-inline'"
      : // Next.js menempelkan nonce ke seluruh <style> yang dibuatnya.
        `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: https: http:",
    "font-src 'self' data:",
    isDevelopment ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    "media-src 'self' data: https: http:",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");
}

function nextWithCsp(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = createContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  if (!isDevelopment) {
    // Next.js membaca header ini saat render untuk menempelkan nonce.
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set(
    isDevelopment
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy",
    contentSecurityPolicy
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/experiences/");

  if (isPublic) return nextWithCsp(request);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;

  let valid = false;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret), {
        algorithms: ["HS256"],
      });
      valid = true;
    } catch {
      // token rusak atau kedaluwarsa
    }
  }

  if (!valid) return NextResponse.redirect(new URL("/login", request.url));
  return nextWithCsp(request);
}

export const config = {
  // api dikecualikan: Route Handler mengecek auth sendiri dan membalas 401 (bukan redirect)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|txt|xml)$).*)",
  ],
};
