import React from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Komponen penyaji Schema.org JSON-LD yang aman untuk mesin pencari konvensional
 * dan mesin pencari generatif (GEO: ChatGPT, Perplexity, Google Gemini).
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
