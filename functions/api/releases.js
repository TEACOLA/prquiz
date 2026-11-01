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

    // 次のJST毎時1分までのキャッシュ秒数を算出（PRサイトへの負荷を最小限に抑制）
    const ttlSeconds = getSecondsUntilNextHourlyUpdate();
    const updatedAt = getLastHourlyUpdateJst();

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
          // 次の毎時1分までエッジキャッシュ（1時間1回のみの取得を保証）
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

// 次の毎時1分（JST XX:01）までの残り秒数を算出
function getSecondsUntilNextHourlyUpdate() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let minutesUntil;
  if (minutes < 1) {
    minutesUntil = 1 - minutes;
  } else {
    minutesUntil = 60 - minutes + 1;
  }
  const secondsUntil = (minutesUntil * 60) - seconds;
  return Math.max(60, secondsUntil); // 最低60秒
}

// 直近の毎時1分（JST）の日時文字列を取得
function getLastHourlyUpdateJst() {
  const now = new Date();
  // JST は UTC+9
  const jstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  let y = jstTime.getUTCFullYear();
  let m = jstTime.getUTCMonth();
  let d = jstTime.getUTCDate();
  let h = jstTime.getUTCHours();
  let min = jstTime.getUTCMinutes();

  if (min < 1) {
    h -= 1;
  }
  const lastHourDate = new Date(Date.UTC(y, m, d, h, 1, 0));
  return lastHourDate.toISOString();
}

