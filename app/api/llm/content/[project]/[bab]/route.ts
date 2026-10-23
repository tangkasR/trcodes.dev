import { NextResponse, type NextRequest } from "next/server";
import { getBlogChapterPageData } from "@/modules/public/blog-chapter/blog-chapter.queries";
import { getSiteUrl } from "@/utils/site";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ project: string; bab: string }> }
) {
  const { project, bab } = await params;
  const data = await getBlogChapterPageData(project, bab);

  if (!data) {
    return new NextResponse("# 404 - Bab tidak ditemukan\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  const { project: P, chapter: c, profile } = data;
  const siteUrl = getSiteUrl();

  const lines: string[] = [];
  lines.push(`# ${c.title}`);
  lines.push(`\n**Proyek**: ${P.name} (${siteUrl}/#${P.hash})`);
  lines.push(`**Penulis**: ${profile?.fullName ?? "Tangkas Risdianto"}`);
  lines.push(`**Tautan Kanonikal**: ${siteUrl}/blog/${P.slug}/${c.slug}\n`);

  lines.push(`## Ringkasan Konsep`);
  lines.push(`- **Apa itu**: ${c.what}`);
  lines.push(`- **Cara saya memakainya**: ${c.use}`);
  if (c.more) {
    lines.push(`- **Catatan**: ${c.more}`);
  }
  lines.push(`\n---\n`);

  if (c.content && c.content.length > 0) {
    for (const block of c.content) {
      switch (block.t) {
        case "h":
          lines.push(`\n## ${block.x}\n`);
          break;
        case "p":
          lines.push(`\n${block.x}\n`);
          break;
        case "quote":
          lines.push(`\n> ${block.x}\n`);
          break;
        case "code":
          lines.push(`\n\`\`\`\n${block.x}\n\`\`\`\n`);
          break;
        case "ul":
          lines.push("");
          for (const item of block.x) {
            lines.push(`- ${item}`);
          }
          lines.push("");
          break;
        case "note":
          lines.push(`\n> [!NOTE]\n> ${block.x}\n`);
          break;
      }
    }
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
