// Cloudflare Pages Functions: /api/releases
// PR TIMES (日本語) または Newswire (英語) の RSS をサーバー側で取得・パースして JSON を返す API

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const lang = (url.searchParams.get("lang") || "ja").toLowerCase();

  const isEn = lang === "en";
  const feedUrl = isEn
    ? "https://www.newswire.com/newsroom/rss/all"
    : "https://prtimes.jp/index.rdf";

  const sourceName = isEn ? "Newswire" : "PR TIMES";

  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PRQuizBot/1.0; +https://prquiz.com)",
        "Accept": "application/rss+xml, application/rdf+xml, application/xml, text/xml, */*"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: status ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseRssItems(xmlText);

    return new Response(
      JSON.stringify({
        ok: true,
        source: sourceName,
        lang: isEn ? "en" : "ja",
        count: items.length,
        items
      }),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          // 5分間キャッシュ（配信元への負荷軽減と高速化）
          "Cache-Control": "public, max-age=300, s-maxage=300"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        source: sourceName,
        error: error.message || "Unknown error",
        items: []
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}

// RSS / RDF の XML から <item> を抽出し、タイトルとリンクを取り出すパーサー
function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemBlock = itemMatch[0];

    // タイトル抽出
    let title = "";
    const titleMatch = itemBlock.match(/<title(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = cleanText(titleMatch[1]);
    }

    // リンク抽出 (<link>タグまたは rdf:about 属性)
    let link = "";
    const linkMatch = itemBlock.match(/<link(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    if (linkMatch && linkMatch[1]) {
      link = cleanText(linkMatch[1]);
    } else {
      const rdfAboutMatch = itemBlock.match(/<item\s+[^>]*rdf:about=["']([^"']+)["']/i);
      if (rdfAboutMatch && rdfAboutMatch[1]) {
        link = cleanText(rdfAboutMatch[1]);
      }
    }

    // タイトルとリンクが両方取れた場合のみ追加
    if (title && link) {
      items.push({ title, link });
    }
  }

  return items;
}

// HTML特殊文字（実体参照）のデコードとトリム
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
