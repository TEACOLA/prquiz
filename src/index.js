// Cloudflare Workers with Static Assets: Entry point
// 静的ファイル（public/）の配信と /api/releases エンドポイントの処理を担当

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API リクエスト: /api/releases
    if (url.pathname === "/api/releases") {
      return handleReleases(request);
    }

    // /sources/ の末尾スラッシュ付きアクセスは /sources へ正規化リダイレクト
    if (url.pathname === "/sources/") {
      url.pathname = "/sources";
      return Response.redirect(url.toString(), 301);
    }

    // /sources へのアクセスは sources.html を配信
    if (url.pathname === "/sources") {
      const sourcesReq = new Request(new URL("/sources.html", request.url), request);
      return env.ASSETS.fetch(sourcesReq);
    }

    // 静的アセット（HTML, CSS, JS等）へのフォールバック
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};

async function handleReleases(request) {
  const url = new URL(request.url);
  const lang = (url.searchParams.get("lang") || "ja").toLowerCase();
  const isEn = lang === "en";

  try {
    let items = [];
    let sourceName = "";

    if (isEn) {
      sourceName = "Newswire / NASA";
      // 英語フィードを並行取得（各ソースから最新10件ずつ取得）
      const [nwItems, nasaItems] = await Promise.all([
        fetchFeedItems("https://www.newswire.com/newsroom/rss/all", "Newswire"),
        fetchFeedItems("https://www.nasa.gov/news-release/feed/", "NASA")
      ]);

      const nwSlice = nwItems.slice(0, 10);
      const nasaSlice = nasaItems.slice(0, 10);

      // 交互にバランスよくインターリーブして結合
      const maxLen = Math.max(nwSlice.length, nasaSlice.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < nwSlice.length) items.push(nwSlice[i]);
        if (i < nasaSlice.length) items.push(nasaSlice[i]);
      }
    } else {
      sourceName = "PR TIMES / JAXA / 官公庁 / IPA / サイエンスポータル";
      // 日本語フィードを並行取得（各ソースから最新記事を取得）
      const [
        prItems,
        spItems,
        ipaAlertItems,
        ipaNewsItems,
        ipaPressItems,
        jaxaItems,
        govItems,
        digitalItems,
        npaItems,
        mhlwItems,
        egovListItems,
        egovResultItems,
        caaItems
      ] = await Promise.all([
        fetchFeedItems("https://prtimes.jp/index.rdf", "PR TIMES"),
        fetchFeedItems("https://scienceportal.jst.go.jp/feed/rss.xml", "サイエンスポータル"),
        fetchFeedItems("https://www.ipa.go.jp/security/alert-rss.rdf", "IPA セキュリティ"),
        fetchFeedItems("https://www.ipa.go.jp/about/newsonly-rss.rdf", "IPA お知らせ"),
        fetchFeedItems("https://www.ipa.go.jp/about/press-rss.rdf", "IPA プレス発表"),
        fetchFeedItems("https://www.jaxa.jp/rss/press_j.rdf", "JAXA"),
        fetchFeedItems("https://www.gov-online.go.jp/rss/index.rdf", "政府広報"),
        fetchFeedItems("https://www.digital.go.jp/rss/news.xml", "デジタル庁"),
        fetchFeedItems("https://www.npa.go.jp/newlyarrived/rss20.xml", "警察庁"),
        fetchFeedItems("https://www.mhlw.go.jp/stf/news.rdf", "厚生労働省"),
        fetchFeedItems("https://public-comment.e-gov.go.jp/rss/pcm_list.xml", "e-Gov パブコメ募集"),
        fetchFeedItems("https://public-comment.e-gov.go.jp/rss/pcm_result.xml", "e-Gov パブコメ結果"),
        fetchFeedItems("https://www.caa.go.jp/news.rss", "消費者庁")
      ]);

      const allSlices = [
        prItems.slice(0, 8),
        spItems.slice(0, 6),
        jaxaItems.slice(0, 6),
        govItems.slice(0, 6),
        digitalItems.slice(0, 6),
        mhlwItems.slice(0, 6),
        caaItems.slice(0, 6),
        ipaPressItems.slice(0, 5),
        ipaAlertItems.slice(0, 5),
        ipaNewsItems.slice(0, 5),
        egovListItems.slice(0, 5),
        egovResultItems.slice(0, 5),
        npaItems.slice(0, 5)
      ];

      const seenLinks = new Set();
      const seenTitles = new Set();
      const maxLen = Math.max(...allSlices.map(s => s.length));

      for (let i = 0; i < maxLen; i++) {
        for (const slice of allSlices) {
          if (i < slice.length) {
            const item = slice[i];
            if (item && !seenLinks.has(item.link) && !seenTitles.has(item.title)) {
              seenLinks.add(item.link);
              seenTitles.add(item.title);
              items.push(item);
            }
          }
        }
      }
    }

    // 次の128分更新タイミングまでのキャッシュ秒数を算出（配信元への負荷を最小限に抑制）
    const ttlSeconds = getSecondsUntilNext128MinUpdate();
    const updatedAt = getLast128MinUpdate();

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
          // 128分周期でエッジキャッシュ（配信元へのアクセスは128分に1回のみ）
          "Cache-Control": `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        source: isEn ? "Newswire / NASA" : "PR TIMES / サイエンスポータル",
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

// 配信元フィードをキャッシュバイパスでフェッチしてパース
async function fetchFeedItems(feedUrl, defaultSource) {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PRQuizBot/1.0; +https://prquiz.com)",
        "Accept": "application/rss+xml, application/rdf+xml, application/xml, text/xml, */*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      },
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      }
    });

    if (!response.ok) {
      return [];
    }

    const xmlText = await response.text();
    const allItems = parseRssItems(xmlText, defaultSource);

    // 配信日時がある場合は最新順（降順）にソート
    allItems.sort((a, b) => {
      if (a.date && b.date) {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
          return timeB - timeA;
        }
      }
      return 0;
    });

    return allItems;
  } catch (err) {
    return [];
  }
}

// RSS / RDF の XML から <item> を抽出し、タイトル・リンク・配信日時を取り出すパーサー
function parseRssItems(xml, defaultSource = "") {
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
      items.push({ title, link, date, source: defaultSource });
    }
  }

  return items;
}

// HTML特殊文字（実体参照・数値文字参照）の完全デコードとトリム
function cleanText(text) {
  if (!text) return "";
  let result = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");

  // 二重エンコード対策を含めて最大2回デコード
  for (let i = 0; i < 2; i++) {
    if (!result.includes("&")) break;
    result = result
      // 名前付き実体参照
      .replace(/&lsquo;/gi, "‘")
      .replace(/&rsquo;/gi, "’")
      .replace(/&ldquo;/gi, "“")
      .replace(/&rdquo;/gi, "”")
      .replace(/&ndash;/gi, "–")
      .replace(/&mdash;/gi, "—")
      .replace(/&hellip;/gi, "…")
      .replace(/&bull;/gi, "•")
      .replace(/&trade;/gi, "™")
      .replace(/&reg;/gi, "®")
      .replace(/&copy;/gi, "©")
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&nbsp;/gi, " ")
      // 16進数文字参照 &#xHHHH;
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        try {
          return String.fromCodePoint(parseInt(hex, 16));
        } catch (e) {
          return "";
        }
      })
      // 10進数文字参照 &#DDDD; (例: &#8217; -> ’, &#039; -> ', &#038; -> &)
      .replace(/&#([0-9]+);/g, (_, dec) => {
        try {
          return String.fromCodePoint(parseInt(dec, 10));
        } catch (e) {
          return "";
        }
      })
      // &amp; は他の参照を展開した後にデコード
      .replace(/&amp;/gi, "&");
  }

  // IPA・JAXA等の定型接頭辞を削除してクイズのタイトルを自然にする
  result = result
    .replace(/^プレス発表\s+/, "")
    .replace(/^\[プレスリリース(?:・[^\]]*)?\]\s*/, "");

  return result.replace(/\s+/g, " ").trim();
}

const INTERVAL_SECONDS = 128 * 60; // 128分周期（7,680秒）

// 次の128分更新タイミングまでの残り秒数を算出
function getSecondsUntilNext128MinUpdate() {
  const nowSec = Math.floor(Date.now() / 1000);
  const currentBatch = Math.floor(nowSec / INTERVAL_SECONDS);
  const nextBatchSec = (currentBatch + 1) * INTERVAL_SECONDS;
  const remaining = nextBatchSec - nowSec;
  return Math.max(60, remaining); // 最低60秒
}

// 直近の128分更新タイミングのISO日時文字列を取得
function getLast128MinUpdate() {
  const nowSec = Math.floor(Date.now() / 1000);
  const currentBatch = Math.floor(nowSec / INTERVAL_SECONDS);
  const lastBatchSec = currentBatch * INTERVAL_SECONDS;
  return new Date(lastBatchSec * 1000).toISOString();
}

