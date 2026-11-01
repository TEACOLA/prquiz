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
    const allItems = parseRssItems(xmlText);
    // 1フィードにつき10問（10件）を取得
    const items = allItems.slice(0, 10);

    // 次の64分更新タイミングまでのキャッシュ秒数を算出（PRサイトへの負荷を最小限に抑制）
    const ttlSeconds = getSecondsUntilNext64MinUpdate();
    const updatedAt = getLast64MinUpdate();

    return new Response(
      JSON.stringify({
        ok: true,
        source: sourceName,
        lang: isEn ? "en" : "ja",
        count: items.length,
        updatedAt,
        items
      }),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          // 64分周期でエッジキャッシュ（配信元へのアクセスは64分に1回のみ）
          "Cache-Control": `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`
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

    // リンク抽出 (個別記事URL: rdf:about 属性または <link> タグ)
    let link = "";
    const rdfAboutMatch = itemBlock.match(/<item\s+[^>]*rdf:about=["']([^"']+)["']/i);
    if (rdfAboutMatch && rdfAboutMatch[1] && rdfAboutMatch[1].startsWith("http")) {
      link = cleanText(rdfAboutMatch[1]);
    }

    if (!link) {
      const linkMatch = itemBlock.match(/<link(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      if (linkMatch && linkMatch[1]) {
        link = cleanText(linkMatch[1]);
      }
    }

    // 配信日時抽出 (<dc:date> または <pubDate>)
    let date = "";
    const dateMatch = itemBlock.match(/<(?:dc:date|pubDate)(?:\s[^>]*)?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:dc:date|pubDate)>/i);
    if (dateMatch && dateMatch[1]) {
      date = cleanText(dateMatch[1]);
    }

    // タイトルと記事個別リンクが両方取れた場合のみ追加
    if (title && link && link.startsWith("http")) {
      items.push({ title, link, date });
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

const INTERVAL_SECONDS = 64 * 60; // 64分周期（3,840秒）

// 次の64分更新タイミングまでの残り秒数を算出
function getSecondsUntilNext64MinUpdate() {
  const nowSec = Math.floor(Date.now() / 1000);
  const currentBatch = Math.floor(nowSec / INTERVAL_SECONDS);
  const nextBatchSec = (currentBatch + 1) * INTERVAL_SECONDS;
  const remaining = nextBatchSec - nowSec;
  return Math.max(60, remaining); // 最低60秒
}

// 直近の64分更新タイミングのISO日時文字列を取得
function getLast64MinUpdate() {
  const nowSec = Math.floor(Date.now() / 1000);
  const currentBatch = Math.floor(nowSec / INTERVAL_SECONDS);
  const lastBatchSec = currentBatch * INTERVAL_SECONDS;
  return new Date(lastBatchSec * 1000).toISOString();
}

