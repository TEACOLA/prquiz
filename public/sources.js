// PR Quiz - Sources List Page Logic

// ローカル検証やオフライン時用のフォールバックデータ（各記事への個別リンクと配信日時）
const FALLBACK_RELEASES = {
  ja: [
    { title: "【2026年11月号】モデルとして活躍する鈴木ゆうかさんが『PLACOLE＆DRESSY』のカバーモデルとして登場！", link: "https://prtimes.jp/main/html/rd/p/000001178.000021126.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "「地上の太陽」目指し、ITER炉心の主要部品そろう 建設の節目", link: "https://scienceportal.jst.go.jp/newsflash/20261030_n01/", date: "2026-10-30T14:55:22+09:00", source: "サイエンスポータル" },
    { title: "【新店舗】いーふらん、福岡県直方市に「高価買取おたからや 直方本店」を出店！｜2026年11月2日（月）オープン！｜金・腕時計・ブランドバッグなどの査定・買取は「高価買取おたからや」にお任せください！", link: "https://prtimes.jp/main/html/rd/p/000000472.000080252.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "千葉豪雨など今夏3件の大雨は温暖化が発生リスク高める WACが分析", link: "https://scienceportal.jst.go.jp/newsflash/20261029_n01/", date: "2026-10-29T15:07:46+09:00", source: "サイエンスポータル" },
    { title: "買取専科 11月に全国4エリアに新店舗を順次オープン決定！(東京都・埼玉県・京都府・大阪府）", link: "https://prtimes.jp/main/html/rd/p/000000102.000143963.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "各種モビリティと人の「混在交通」 現在と未来を考える日米合同シンポ", link: "https://scienceportal.jst.go.jp/stories/20261028_s01/", date: "2026-10-28T15:01:15+09:00", source: "サイエンスポータル" },
    { title: "群馬・みなかみの新拠点「BUB RESORT Minakami」、11月1日（日）より予約受付を開始。12月24日（木）プレオープン", link: "https://prtimes.jp/main/html/rd/p/000000191.000043533.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "「59分60秒、やめます」うるう秒廃止を決議 国際度量衡総会", link: "https://scienceportal.jst.go.jp/newsflash/20261027_n01/", date: "2026-10-27T16:37:42+09:00", source: "サイエンスポータル" },
    { title: "祝！塩田武士『存在のすべてを』が『読者が選ぶ文庫本「本の日」大賞』大賞受賞！", link: "https://prtimes.jp/main/html/rd/p/000002478.000004702.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "プログラミング言語「PHP」に重大欠陥 ネット社会のもろさ浮き彫り", link: "https://scienceportal.jst.go.jp/stories/20261026_s01/", date: "2026-10-26T16:02:07+09:00", source: "サイエンスポータル" },
    { title: "ショート映画配信サービス「SAMANSA」月額利用料金改定のお知らせ", link: "https://prtimes.jp/main/html/rd/p/000000194.000082116.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "「多文化共生」のため、科学技術どう活用？ サイエンスアゴラin前橋", link: "https://scienceportal.jst.go.jp/stories/20261023_s01/", date: "2026-10-23T14:20:54+09:00", source: "サイエンスポータル" },
    { title: "「FiT24 春日井店」が11月1日（日）オープン！ワンフロアに充実のマシンと大型駐車場を完備～オープン記念キャンペーン開催！月会費が最大3ヶ月0円～", link: "https://prtimes.jp/main/html/rd/p/000000166.000075275.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "火星衛星フォボスの試料回収へ旅立ち MMX打ち上げ成功 種子島", link: "https://scienceportal.jst.go.jp/newsflash/20261021_n01/", date: "2026-10-21T15:35:05+09:00", source: "サイエンスポータル" },
    { title: "三ツ境駅前スマイル歯科 院長・樋田秀一が「歯周病菌リアルタイムPCR検査導入セミナー」に講師として登壇", link: "https://prtimes.jp/main/html/rd/p/000000053.000136443.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "日本の伝統工芸と現代デザインが融合した新しい陶器ブランド『美織』が誕生", link: "https://prtimes.jp/main/html/rd/p/000000015.000082341.html", date: "2026-11-01T17:22:00+09:00", source: "PR TIMES" },
    { title: "アミューズメント施設の届業務をもっと手軽に！「レイ変更け作成くん β」の提供を開始いたしました。", link: "https://prtimes.jp/main/html/rd/p/000000040.000015943.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "この卵はプリンに？茶碗蒸しに？ 鶏の飼い方で味が変わる 農工大など", link: "https://scienceportal.jst.go.jp/stories/20261020_s01/", date: "2026-10-20T15:50:04+09:00", source: "サイエンスポータル" },
    { title: "VML & Ogilvy Japan、マーケティング効果を評価するアワード「APAC Effie Awards」にてブロンズを受賞", link: "https://prtimes.jp/main/html/rd/p/000000031.000107739.html", date: "2026-11-01T22:10:02+09:00", source: "PR TIMES" },
    { title: "打ち上げ迫る「MMX」 火星衛星フォボスから、どんなお土産を？", link: "https://scienceportal.jst.go.jp/stories/20261019_s01/", date: "2026-10-19T14:50:09+09:00", source: "サイエンスポータル" },
    { title: "不正アクセスによる個人情報漏えい等の被害にあわれた方の相談受付強化について", link: "https://www.ipa.go.jp/pressrelease/2026/press20261102.html", date: "2026-11-02T00:00:00+09:00", source: "IPA プレス発表" },
    { title: "更新：PHPの脆弱性対策について(CVE-2026-109618、CVE-2026-109619：PHP2shell)", link: "https://www.ipa.go.jp/security/security-alert/2026/alert20261022.html", date: "2026-11-02T00:00:00+09:00", source: "IPA セキュリティ" },
    { title: "DX認定制度 認定事業者の公表（2026年11月1日認定適用）", link: "https://disclosure.dx-portal.ipa.go.jp/", date: "2026-11-02T00:00:00+09:00", source: "IPA お知らせ" }
  ],
  en: [
    { title: "A New Chapter in America's Lithium Story: Elektros (OTC:ELEK) Advances Its Review of a Northern New York Opportunity", link: "https://www.newswire.com/news/see-2277941", date: "Sun, 01 Nov 2026 00:12:00 +0000", source: "Newswire" },
    { title: "APOD: 2026 November 1 – Colors of the Moon", link: "https://science.nasa.gov/image-article/apod-2026-november-1-colors-of-the-moon/", date: "Sun, 01 Nov 2026 04:05:00 +0000", source: "NASA" },
    { title: "Positioning for America's Next Lithium Opportunity: Elektros (OTC:ELEK) Evaluates Northern New York Potential", link: "https://www.newswire.com/news/see-1194908", date: "Sun, 01 Nov 2026 00:00:00 +0000", source: "Newswire" },
    { title: "APOD: 2026 October 31 – Night on a Spooky Planet", link: "https://science.nasa.gov/image-article/apod-2026-october-31-night-on-a-spooky-planet/", date: "Sat, 31 Oct 2026 04:05:00 +0000", source: "NASA" },
    { title: "The Domestic Lithium Landscape Is Evolving: Elektros (OTC:ELEK) Studies a Northern New York Possibility", link: "https://www.newswire.com/news/see-3262995", date: "Sat, 31 Oct 2026 23:47:00 +0000", source: "Newswire" },
    { title: "NASA Releases MAX POWER Key Events for Media, Participants", link: "https://www.nasa.gov/news-release/nasa-releases-max-power-key-events-for-media-participants/", date: "Fri, 30 Oct 2026 19:31:02 +0000", source: "NASA" },
    { title: "Glioblastoma Foundation's Genomic Testing & Research Laboratory Now Accepting Patient Samples for Genomic Testing", link: "https://www.newswire.com/news/glioblastoma-foundation-s-genomic-testing-research-laboratory-now-22880316", date: "Sat, 31 Oct 2026 15:55:00 +0000", source: "Newswire" },
    { title: "NASA’s James Webb Space Telescope Captures Eerie Cat’s Head", link: "https://www.nasa.gov/image-article/nasas-james-webb-space-telescope-captures-eerie-cats-head/", date: "Fri, 30 Oct 2026 15:56:26 +0000", source: "NASA" },
    { title: "From Global Private Credit to Programmable Securities: New to The Street Show #778 Premieres Tonight on Bloomberg Television", link: "https://www.newswire.com/news/from-global-private-credit-to-programmable-securities-new-to-the-street-show", date: "Sat, 31 Oct 2026 15:00:00 +0000", source: "Newswire" },
    { title: "NASA Explores Potential Commercial Servicing for Hubble Telescope", link: "https://science.nasa.gov/missions/hubble/nasa-explores-potential-commercial-servicing-for-hubble-telescope/", date: "Fri, 30 Oct 2026 14:51:21 +0000", source: "NASA" },
    { title: "Commercial Cleaning Business Funding: How Established Cleaning Companies Can Take On Bigger Contracts Before the First Invoice Pays", link: "https://www.newswire.com/news/commercial-cleaning-business-funding-how-established-cleaning-22878435", date: "Sat, 31 Oct 2026 13:00:00 +0000", source: "Newswire" },
    { title: "November’s Night Sky Notes: Light-Day Away", link: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/novembers-night-sky-notes-light-day-away/", date: "Fri, 30 Oct 2026 10:00:00 +0000", source: "NASA" },
    { title: "How to Repurpose Old Furniture into New Treasures", link: "https://www.newswire.com/news/how-to-repurpose-old-furniture-into-new-treasures", date: "Sat, 31 Oct 2026 04:00:00 +0000", source: "Newswire" },
    { title: "APOD: 2026 October 30 – Haunting the Cepheus Flare", link: "https://science.nasa.gov/image-article/apod-2026-october-30-haunting-the-cepheus-flare/", date: "Fri, 30 Oct 2026 04:05:00 +0000", source: "NASA" },
    { title: "Villora Reviews and Complaints 2026: No Scoops, No Mixing-Is This Your Next Daily Gut Routine?", link: "https://www.newswire.com/news/villora-reviews-and-complaints-2026-no-scoops-no-mixing-is-this-your-next-daily", date: "Sat, 31 Oct 2026 01:05:00 +0000", source: "Newswire" },
    { title: "Vega Island Frozen in Fright", link: "https://science.nasa.gov/earth/earth-observatory/vega-island-frozen-in-fright/", date: "Fri, 30 Oct 2026 04:01:00 +0000", source: "NASA" },
    { title: "Oilume Customer Reviews and Complaints 2026: The 80% Hair-Removal Oil Pitch-What to Know Before Ordering", link: "https://www.newswire.com/news/oilume-customer-reviews-and-complaints-2026-the-80-hair-removal-oil-pitch-what", date: "Sat, 31 Oct 2026 00:30:00 +0000", source: "Newswire" },
    { title: "Map Showing Potential Origins of Martian Meteorite Teghaza 001", link: "https://science.nasa.gov/photojournal/map-showing-potential-origins-of-martian-meteorite-teghaza-001/", date: "Fri, 30 Oct 2026 00:07:39 +0000", source: "NASA" },
    { title: "KensaiChef Titanium Cutting Board Reviews & Complaints 2026: Two Prep Surfaces, Built-In Tools-Your Next Kitchen Upgrade?", link: "https://www.newswire.com/news/kensaichef-titanium-cutting-board-reviews-complaints-2026-two-prep-surfaces", date: "Sat, 31 Oct 2026 00:30:00 +0000", source: "Newswire" },
    { title: "Slice of Martian Meteorite Teghaza 001", link: "https://science.nasa.gov/photojournal/slice-of-martian-meteorite-teghaza-001/", date: "Thu, 29 Oct 2026 23:32:35 +0000", source: "NASA" }
  ]
};

// クイズ問題の生成に利用している公式RSS/RDFフィード一覧
const OFFICIAL_FEEDS = {
  ja: [
    {
      name: "JAXA 宇宙航空研究開発機構",
      category: "プレスリリース",
      icon: "🚀",
      feedUrl: "https://www.jaxa.jp/rss/press_j.rdf",
      siteUrl: "https://www.jaxa.jp/"
    },
    {
      name: "内閣府 政府広報オンライン",
      category: "新着記事",
      icon: "🏛️",
      feedUrl: "https://www.gov-online.go.jp/rss/index.rdf",
      siteUrl: "https://www.gov-online.go.jp/"
    },
    {
      name: "デジタル庁",
      category: "ニュース・更新情報",
      icon: "💻",
      feedUrl: "https://www.digital.go.jp/rss/news.xml",
      siteUrl: "https://www.digital.go.jp/"
    },
    {
      name: "警察庁",
      category: "新着情報",
      icon: "🚔",
      feedUrl: "https://www.npa.go.jp/newlyarrived/rss20.xml",
      siteUrl: "https://www.npa.go.jp/"
    },
    {
      name: "厚生労働省",
      category: "報道発表・新着情報",
      icon: "🏥",
      feedUrl: "https://www.mhlw.go.jp/stf/news.rdf",
      siteUrl: "https://www.mhlw.go.jp/"
    },
    {
      name: "e-Gov パブリック・コメント",
      category: "意見募集中案件",
      icon: "📜",
      feedUrl: "https://public-comment.e-gov.go.jp/rss/pcm_list.xml",
      siteUrl: "https://public-comment.e-gov.go.jp/"
    },
    {
      name: "e-Gov パブリック・コメント",
      category: "結果公示案件",
      icon: "📜",
      feedUrl: "https://public-comment.e-gov.go.jp/rss/pcm_result.xml",
      siteUrl: "https://public-comment.e-gov.go.jp/"
    },
    {
      name: "IPA 独立行政法人 情報処理推進機構",
      category: "セキュリティ注意喚起",
      icon: "🛡️",
      feedUrl: "https://www.ipa.go.jp/security/alert-rss.rdf",
      siteUrl: "https://www.ipa.go.jp/"
    },
    {
      name: "IPA 独立行政法人 情報処理推進機構",
      category: "新着情報",
      icon: "🛡️",
      feedUrl: "https://www.ipa.go.jp/about/newsonly-rss.rdf",
      siteUrl: "https://www.ipa.go.jp/"
    },
    {
      name: "IPA 独立行政法人 情報処理推進機構",
      category: "プレス発表",
      icon: "🛡️",
      feedUrl: "https://www.ipa.go.jp/about/press-rss.rdf",
      siteUrl: "https://www.ipa.go.jp/"
    },
    {
      name: "科学技術振興機構 (JST)",
      category: "サイエンスポータル ニュース",
      icon: "🔬",
      feedUrl: "https://scienceportal.jst.go.jp/feed/rss.xml",
      siteUrl: "https://scienceportal.jst.go.jp/"
    },
    {
      name: "消費者庁",
      category: "新着情報",
      icon: "📢",
      feedUrl: "https://www.caa.go.jp/news.rss",
      siteUrl: "https://www.caa.go.jp/"
    },
    {
      name: "ジェトロ (JETRO)",
      category: "ビジネス短信（世界ニュース）",
      icon: "💼",
      feedUrl: "https://www.jetro.go.jp/rss2/biznews.xml",
      siteUrl: "https://www.jetro.go.jp/biznews/"
    },
    {
      name: "ジェトロ (JETRO)",
      category: "イベント最新情報",
      icon: "💼",
      feedUrl: "https://www.jetro.go.jp/rss/event.xml",
      siteUrl: "https://www.jetro.go.jp/events.html"
    },
    {
      name: "経済産業省",
      category: "ニュースリリース・新着情報",
      icon: "🏭",
      feedUrl: "https://www.meti.go.jp/ml_index_release_atom.xml",
      siteUrl: "https://www.meti.go.jp/"
    },
    {
      name: "経済産業省 METI Journal",
      category: "政策特集・オンラインマガジン",
      icon: "🏭",
      feedUrl: "https://journal.meti.go.jp/feed/",
      siteUrl: "https://journal.meti.go.jp/"
    },
    {
      name: "任天堂",
      category: "ホームページ更新情報",
      icon: "🎮",
      feedUrl: "https://www.nintendo.co.jp/news/whatsnew.xml",
      siteUrl: "https://www.nintendo.com/jp/"
    },
    {
      name: "いらすとや",
      category: "イラスト最新情報",
      icon: "🎨",
      feedUrl: "https://www.irasutoya.com/feeds/posts/default?alt=rss",
      siteUrl: "https://www.irasutoya.com/"
    },
    {
      name: "総務省",
      category: "報道資料・新着情報",
      icon: "📮",
      feedUrl: "https://www.soumu.go.jp/news.rdf",
      siteUrl: "https://www.soumu.go.jp/"
    },
    {
      name: "内閣府 経済社会総合研究所 (ESRI)",
      category: "経済統計・研究成果",
      icon: "📊",
      feedUrl: "https://www.esri.cao.go.jp/rss-jp.xml",
      siteUrl: "https://www.esri.cao.go.jp/"
    },
    {
      name: "産業技術総合研究所 (産総研)",
      category: "研究成果・新着情報",
      icon: "🧪",
      feedUrl: "https://www.aist.go.jp/ctl/module/mid/27/tid/75/rss.php",
      siteUrl: "https://www.aist.go.jp/"
    },
    {
      name: "物質・材料研究機構 (NIMS)",
      category: "研究成果・お知らせ",
      icon: "💎",
      feedUrl: "https://www.nims.go.jp/news/newsall.xml",
      siteUrl: "https://www.nims.go.jp/"
    },
    {
      name: "理化学研究所 (理研)",
      category: "プレスリリース・研究成果",
      icon: "🧬",
      feedUrl: "https://www.riken.jp/feed/press_feed/",
      siteUrl: "https://www.riken.jp/"
    },
    {
      name: "PR TIMES",
      category: "プレスリリース総合",
      icon: "📰",
      feedUrl: "https://prtimes.jp/index.rdf",
      siteUrl: "https://prtimes.jp/"
    }
  ],
  en: [
    {
      name: "Newswire",
      category: "Press Releases (All)",
      icon: "🌐",
      feedUrl: "https://www.newswire.com/newsroom/rss/all",
      siteUrl: "https://www.newswire.com/"
    },
    {
      name: "NASA",
      category: "News Releases",
      icon: "🚀",
      feedUrl: "https://www.nasa.gov/news-release/feed/",
      siteUrl: "https://www.nasa.gov/"
    }
  ]
};

// ブラウザの言語環境から初期表示言語を判定（日本語環境なら ja、それ以外なら en）
function detectInitialLanguage() {
  // 1. URLパラメータ (?lang=ja または ?lang=en) が指定されていれば最優先
  const params = new URLSearchParams(window.location.search);
  const langParam = (params.get("lang") || "").toLowerCase();
  if (langParam === "ja" || langParam === "en") {
    return langParam;
  }

  // 2. 過去にユーザーが言語ボタンを手動で切り替えた保存値があれば優先
  const saved = localStorage.getItem("prquiz_lang");
  if (saved === "ja" || saved === "en") {
    return saved;
  }

  // 3. ブラウザの言語設定を確認 (日本語環境なら ja、日本語以外なら en)
  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  return browserLang.toLowerCase().startsWith("ja") ? "ja" : "en";
}

class PRSourcesApp {
  constructor() {
    this.currentLang = detectInitialLanguage();
    this.langBtns = document.querySelectorAll(".lang-btn");
    this.sourcesListEl = document.getElementById("sources-list");
    this.pageTitleEl = document.getElementById("page-title");
    this.pageDescEl = document.getElementById("page-desc");
    this.footerScoreEl = document.getElementById("footer-score");
    this.headerAccuracyEl = document.getElementById("header-accuracy");
    this.footerSourcesLink = document.getElementById("footer-sources-link");
    this.updateTimeTextEl = document.getElementById("update-time-text");
    this.feedsGridEl = document.getElementById("feeds-grid");
    this.feedsTitleEl = document.getElementById("feeds-title");
    this.feedsDescEl = document.getElementById("feeds-desc");
    this.lastUpdatedAt = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateLanguageUI();
    this.updateFooterScore();
    this.loadSources(this.currentLang);
  }

  updateFooterScore() {
    const score = parseInt(localStorage.getItem("prquiz_score") || "0", 10);
    const total = parseInt(localStorage.getItem("prquiz_total") || "0", 10);
    const rate = total > 0 ? Math.round((score / total) * 100) : 0;
    const isEn = this.currentLang === "en";

    if (this.headerAccuracyEl) {
      this.headerAccuracyEl.textContent = isEn
        ? `Accuracy: ${rate}%`
        : `正解率: ${rate}%`;
    }

    if (this.footerScoreEl) {
      this.footerScoreEl.textContent = isEn
        ? `Score: ${score} / Answers: ${total} (Accuracy: ${rate}%)`
        : `正解数: ${score} / 回答数: ${total}（正解率: ${rate}%）`;
    }
  }

  bindEvents() {
    this.langBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.dataset.lang;
        this.scrollToTop();
        if (lang !== this.currentLang) {
          this.currentLang = lang;
          localStorage.setItem("prquiz_lang", this.currentLang);
          this.updateLanguageUI();
          this.loadSources(this.currentLang);
        }
      });
    });
  }

  scrollToTop() {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }

    const header = document.querySelector(".site-header");
    if (header && typeof header.scrollIntoView === "function") {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (window.scrollY > 10) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 150);
    });
  }

  updateLanguageUI() {
    // ページ全体の言語属性を現在選択されている言語に同期
    document.documentElement.lang = this.currentLang;
    const isEn = this.currentLang === "en";

    document.title = isEn
      ? "Press Release Sources | PR Quiz"
      : "プレスリリース ソース元一覧 | PR Quiz";

    this.langBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });

    this.pageTitleEl.textContent = isEn
      ? "📰 Press Release Sources"
      : "📰 プレスリリース ソース元一覧";
    this.pageDescEl.textContent = isEn
      ? "Here is the list of recent press releases and articles featured in PR Quiz. Click any article to read the full story on the original site."
      : "PR Quizで出題されている最新のプレスリリース一覧です。気になるタイトルの記事は、元サイトで全文をお読みいただけます。";
    if (this.footerSourcesLink) {
      this.footerSourcesLink.textContent = isEn ? "Press Release Sources List" : "プレスリリースのソース元サイト一覧";
    }
    this.updateFooterScore();
    this.renderUpdateTime();
    this.renderFeeds();
  }

  renderFeeds() {
    if (!this.feedsGridEl) return;
    const isEn = this.currentLang === "en";
    const feeds = OFFICIAL_FEEDS[this.currentLang] || OFFICIAL_FEEDS.ja;

    if (this.feedsTitleEl) {
      this.feedsTitleEl.textContent = isEn
        ? "📡 Official RSS / RDF Feeds"
        : "📡 利用している公式RSS/RDFフィード一覧";
    }

    if (this.feedsDescEl) {
      this.feedsDescEl.textContent = isEn
        ? "PR Quiz fetches publicly available feeds from these official institutions and media sources to generate quiz questions."
        : "PR Quiz では、各機関・メディアが一般公開している公式フィードを取得し、クイズの問題として活用させていただいています。";
    }

    this.feedsGridEl.innerHTML = feeds.map(feed => {
      const nameEscaped = this.escapeHtml(feed.name);
      const catEscaped = this.escapeHtml(feed.category);
      const feedUrlEscaped = this.escapeHtml(feed.feedUrl);
      const siteUrlEscaped = this.escapeHtml(feed.siteUrl);
      let feedType = "RSS";
      if (feed.feedUrl.endsWith(".rdf")) feedType = "RDF";
      else if (feed.feedUrl.includes("atom")) feedType = "Atom";

      return `
        <div class="feed-item-card">
          <div class="feed-item-header">
            <span class="feed-item-icon" aria-hidden="true">${feed.icon}</span>
            <div class="feed-item-titles">
              <a href="${siteUrlEscaped}" target="_blank" rel="noopener noreferrer" class="feed-item-name">
                ${nameEscaped}
              </a>
              <span class="feed-item-cat">${catEscaped}</span>
            </div>
          </div>
          <div class="feed-item-body">
            <span class="feed-type-badge">${feedType}</span>
            <a href="${feedUrlEscaped}" target="_blank" rel="noopener noreferrer" class="feed-item-url" title="${feedUrlEscaped}">
              ${feedUrlEscaped}
            </a>
          </div>
        </div>
      `;
    }).join("");
  }

  renderUpdateTime() {
    if (!this.updateTimeTextEl) return;
    const isEn = this.currentLang === "en";

    let d;
    if (this.lastUpdatedAt) {
      d = new Date(this.lastUpdatedAt);
    } else {
      const nowSec = Math.floor(Date.now() / 1000);
      const batchSec = Math.floor(nowSec / (128 * 60)) * (128 * 60);
      d = new Date(batchSec * 1000);
    }

    // JST (+9時間)
    const jstTime = new Date(d.getTime() + (9 * 60 * 60 * 1000));
    const year = jstTime.getUTCFullYear();
    const month = jstTime.getUTCMonth() + 1;
    const day = jstTime.getUTCDate();
    const hours = String(jstTime.getUTCHours()).padStart(2, "0");
    const minutes = String(jstTime.getUTCMinutes()).padStart(2, "0");

    if (isEn) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      this.updateTimeTextEl.textContent = `Updated: ${months[month - 1]} ${day}, ${year} ${hours}:${minutes} JST`;
    } else {
      this.updateTimeTextEl.textContent = `問題更新日時: ${year}年${month}月${day}日 ${hours}:${minutes}`;
    }
  }

  async loadSources(lang) {
    this.sourcesListEl.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>${lang === 'en' ? 'Fetching press release sources...' : 'プレスリリース一覧を取得中...'}</p>
      </div>
    `;

    let items = [];
    let sourceName = lang === "en" ? "Newswire / NASA" : "PR TIMES / サイエンスポータル";

    try {
      const res = await fetch(`/api/releases?lang=${lang}`);
      if (!res.ok) throw new Error("API response not ok");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        items = data.items.map(item => ({
          ...item,
          title: this.decodeHtml(item.title)
        }));
        this.lastUpdatedAt = data.updatedAt || new Date().toISOString();
        if (data.source) sourceName = data.source;
      } else {
        throw new Error("No items");
      }
    } catch (err) {
      console.warn("Using fallback releases:", err);
      items = (FALLBACK_RELEASES[lang] || FALLBACK_RELEASES.ja).map(item => ({
        ...item,
        title: this.decodeHtml(item.title)
      }));
      this.lastUpdatedAt = this.lastUpdatedAt || new Date().toISOString();
    }

    this.renderUpdateTime();
    this.renderList(items, sourceName);
  }

  renderList(items, sourceName) {
    if (!items || items.length === 0) {
      this.sourcesListEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px;">${this.currentLang === 'en' ? 'No releases found.' : 'プレスリリースが見つかりませんでした。'}</p>`;
      return;
    }

    // 下に行くほど古い記事になるように、配信日時の新しい順（降順）で並び替え
    const sortedItems = [...items].sort((a, b) => {
      const timeA = this.getTimestamp(a.date);
      const timeB = this.getTimestamp(b.date);
      return timeB - timeA;
    });

    const isEn = this.currentLang === "en";
    const btnLabel = isEn ? "Read Article ↗" : "元記事を読む ↗";

    this.sourcesListEl.innerHTML = sortedItems.map((item, index) => {
      const titleEscaped = this.escapeHtml(item.title);
      const linkEscaped = this.escapeHtml(item.link);
      const itemSource = item.source || sourceName;
      let sourceIcon = "📰";
      if (itemSource.includes("サイエンス")) sourceIcon = "🔬";
      else if (itemSource.includes("NASA") || itemSource.includes("JAXA")) sourceIcon = "🚀";
      else if (itemSource.includes("デジタル")) sourceIcon = "💻";
      else if (itemSource.includes("警察")) sourceIcon = "🚔";
      else if (itemSource.includes("厚生労働")) sourceIcon = "🏥";
      else if (itemSource.includes("政府広報")) sourceIcon = "🏛️";
      else if (itemSource.includes("e-Gov")) sourceIcon = "📜";
      else if (itemSource.includes("IPA")) sourceIcon = "🛡️";
      else if (itemSource.includes("消費者")) sourceIcon = "📢";
      else if (itemSource.includes("ジェトロ") || itemSource.includes("JETRO")) sourceIcon = "💼";
      else if (itemSource.includes("経済産業") || itemSource.includes("METI")) sourceIcon = "🏭";
      else if (itemSource.includes("任天堂")) sourceIcon = "🎮";
      else if (itemSource.includes("いらすとや")) sourceIcon = "🎨";
      else if (itemSource.includes("総務")) sourceIcon = "📮";
      else if (itemSource.includes("ESRI")) sourceIcon = "📊";
      else if (itemSource.includes("産総研") || itemSource.includes("AIST")) sourceIcon = "🧪";
      else if (itemSource.includes("NIMS") || itemSource.includes("物質")) sourceIcon = "💎";
      else if (itemSource.includes("理研") || itemSource.includes("理化学") || itemSource.includes("RIKEN")) sourceIcon = "🧬";
      else if (itemSource === "Newswire") sourceIcon = "🌐";
      const dateFormatted = this.formatArticleDate(item.date, this.currentLang);
      const dateHtml = dateFormatted ? `<span>•</span><span>🕒 ${this.escapeHtml(dateFormatted)}</span>` : "";

      return `
        <article class="source-item-card">
          <div class="source-item-info">
            <a href="${linkEscaped}" target="_blank" rel="noopener noreferrer" class="source-item-title">
              ${titleEscaped}
            </a>
            <div class="source-item-meta">
              <span>${sourceIcon} ${this.escapeHtml(itemSource)}</span>
              ${dateHtml}
            </div>
          </div>
          <a href="${linkEscaped}" target="_blank" rel="noopener noreferrer" class="source-open-btn">
            ${btnLabel}
          </a>
        </article>
      `;
    }).join("");
  }

  getTimestamp(dateStr) {
    if (!dateStr) return 0;
    try {
      const normalizedDate = typeof dateStr === "string" ? dateStr.replace(/\bJST\b/g, "+09:00") : dateStr;
      const t = new Date(normalizedDate).getTime();
      return isNaN(t) ? 0 : t;
    } catch (e) {
      return 0;
    }
  }

  formatArticleDate(dateStr, lang) {
    if (!dateStr) return "";
    try {
      const normalizedDate = typeof dateStr === "string" ? dateStr.replace(/\bJST\b/g, "+09:00") : dateStr;
      const d = new Date(normalizedDate);
      if (isNaN(d.getTime())) return dateStr;

      // JST (+9時間)
      const jstTime = new Date(d.getTime() + (9 * 60 * 60 * 1000));
      const year = jstTime.getUTCFullYear();
      const month = jstTime.getUTCMonth() + 1;
      const day = jstTime.getUTCDate();
      const hours = String(jstTime.getUTCHours()).padStart(2, "0");
      const minutes = String(jstTime.getUTCMinutes()).padStart(2, "0");

      if (lang === "en") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[month - 1]} ${day}, ${year} ${hours}:${minutes} JST`;
      } else {
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
      }
    } catch (e) {
      return dateStr;
    }
  }

  decodeHtml(str) {
    if (!str) return "";
    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      return txt.value;
    } catch (e) {
      return str;
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PRSourcesApp();
});

