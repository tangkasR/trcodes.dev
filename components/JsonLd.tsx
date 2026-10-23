import React from "react";
import { headers } from "next/headers";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Komponen penyaji Schema.org JSON-LD yang aman untuk mesin pencari konvensional
 * dan mesin pencari generatif (GEO: ChatGPT, Perplexity, Google Gemini).
 */
export default async function JsonLd({ data }: JsonLdProps) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

