// PR Quiz - Sources List Page Logic

// ローカル検証やオフライン時用のフォールバックデータ（各記事への個別リンクと配信日時）
const FALLBACK_RELEASES = {
  ja: [
    { title: "【新商品】老舗和菓子店が本気で作った極上生どら焼きが新登場！素材へのこだわりと職人技の結晶", link: "https://prtimes.jp/main/html/rd/p/000000018.000084512.html", date: "2026-11-01T19:08:00+09:00" },
    { title: "次世代AIプラットフォーム『SmartAssist』正式リリース、業務効率化を劇的に推進", link: "https://prtimes.jp/main/html/rd/p/000000045.000052319.html", date: "2026-11-01T18:55:00+09:00" },
    { title: "秋の味覚を満喫！旬の栗とシャインマスカットを贅沢に使った限定アフタヌーンティーを開催", link: "https://prtimes.jp/main/html/rd/p/000000112.000031890.html", date: "2026-11-01T18:42:00+09:00" },
    { title: "環境負荷を最大70%削減する新型エコパッケージを開発、全国の主要コンビニで順次導入開始", link: "https://prtimes.jp/main/html/rd/p/000000029.000076123.html", date: "2026-11-01T18:30:00+09:00" },
    { title: "国内最大規模のスタートアップカンファレンスが東京で開催決定！注目の登壇者50名を先行発表", link: "https://prtimes.jp/main/html/rd/p/000000088.000063450.html", date: "2026-11-01T18:15:00+09:00" },
    { title: "創業100周年記念！幻の復刻ブレンドコーヒーが数量限定で全国の直営店舗にて販売開始", link: "https://prtimes.jp/main/html/rd/p/000000007.000091204.html", date: "2026-11-01T17:58:00+09:00" },
    { title: "睡眠の質を可視化するスマート快眠デバイス『SleepFit』の先行予約販売を開始", link: "https://prtimes.jp/main/html/rd/p/000000034.000048911.html", date: "2026-11-01T17:40:00+09:00" },
    { title: "日本の伝統工芸と現代デザインが融合した新しい陶器ブランド『美織』が誕生", link: "https://prtimes.jp/main/html/rd/p/000000015.000082341.html", date: "2026-11-01T17:22:00+09:00" },
    { title: "大人気アニメとの特別コラボカフェが期間限定オープン！限定描き下ろしグッズも多数登場", link: "https://prtimes.jp/main/html/rd/p/000000056.000037192.html", date: "2026-11-01T17:05:00+09:00" },
    { title: "全自動で窓掃除をこなす最新スマート家電ロボットが登場、クラウドファンディングで目標達成", link: "https://prtimes.jp/main/html/rd/p/000000023.000069418.html", date: "2026-11-01T16:50:00+09:00" },
    { title: "全国10都市を巡る大型アートフェスティバルが開幕！光と音が織りなす没入型体験を提供", link: "https://prtimes.jp/main/html/rd/p/000000041.000055102.html", date: "2026-11-01T16:35:00+09:00" },
    { title: "糖質80%オフでも本格派！罪悪感ゼロのクラフトチョコレートが新発売", link: "https://prtimes.jp/main/html/rd/p/000000019.000073820.html", date: "2026-11-01T16:15:00+09:00" },
    { title: "クラウド型勤怠管理システムの新機能としてAIシフト自動作成ツールを提供開始", link: "https://prtimes.jp/main/html/rd/p/000000062.000044917.html", date: "2026-11-01T15:58:00+09:00" },
    { title: "北海道産厳選ミルクを使用した濃厚プレミアムソフトクリーム専門店が原宿にオープン", link: "https://prtimes.jp/main/html/rd/p/000000008.000093651.html", date: "2026-11-01T15:40:00+09:00" },
    { title: "企業の温室効果ガス排出量をリアルタイムで算定・可視化する新サービスを発表", link: "https://prtimes.jp/main/html/rd/p/000000037.000061280.html", date: "2026-11-01T15:20:00+09:00" },
    { title: "自宅で本格的なピラティスを体験できるオンライン受講プログラムが今冬スタート", link: "https://prtimes.jp/main/html/rd/p/000000025.000088419.html", date: "2026-11-01T15:00:00+09:00" },
    { title: "プロ仕様の音質を手のひらサイズで実現したワイヤレスイヤホン『SoundAir Pro』発売", link: "https://prtimes.jp/main/html/rd/p/000000073.000032904.html", date: "2026-11-01T14:45:00+09:00" },
    { title: "地方創生プロジェクト！古民家を再生した一日一組限定のプライベートヴィラが開業", link: "https://prtimes.jp/main/html/rd/p/000000014.000077815.html", date: "2026-11-01T14:30:00+09:00" },
    { title: "子どもの論理的思考力を楽しく育む知育プログラミングトイ『ロボキッズ』を新発売", link: "https://prtimes.jp/main/html/rd/p/000000031.000059124.html", date: "2026-11-01T14:10:00+09:00" },
    { title: "日本全国の隠れた名酒を毎月お届けする日本酒サブスクリプションサービスが会員1万人突破", link: "https://prtimes.jp/main/html/rd/p/000000048.000066230.html", date: "2026-11-01T13:50:00+09:00" }
  ],
  en: [
    { title: "Global Tech Innovator Announces Revolutionary Clean Energy Storage Solution for Commercial Use", link: "https://www.newswire.com/news/global-tech-innovator-announces-clean-energy-storage-solution-2189401", date: "2026-11-01T19:00:00+09:00" },
    { title: "Leading Healthcare Startup Secures Series B Funding to Expand AI-Powered Diagnostic Platform", link: "https://www.newswire.com/news/leading-healthcare-startup-secures-series-b-funding-2189402", date: "2026-11-01T18:45:00+09:00" },
    { title: "Annual Cybersecurity Report Reveals 40% Increase in Enterprise Cloud Vulnerabilities", link: "https://www.newswire.com/news/annual-cybersecurity-report-enterprise-cloud-vulnerabilities-2189403", date: "2026-11-01T18:30:00+09:00" },
    { title: "Pioneering Sustainable Fashion Brand Expands Global Retail Presence with New Flagship Stores", link: "https://www.newswire.com/news/pioneering-sustainable-fashion-brand-flagship-stores-2189404", date: "2026-11-01T18:10:00+09:00" },
    { title: "Breakthrough Quantum Computing Architecture Demonstrates 50x Processing Speed Enhancement", link: "https://www.newswire.com/news/quantum-computing-architecture-speed-enhancement-2189405", date: "2026-11-01T17:50:00+09:00" },
    { title: "Premier EV Manufacturer Unveils Long-Range Electric SUV Designed for Extreme Weather Conditions", link: "https://www.newswire.com/news/premier-ev-manufacturer-unveils-electric-suv-2189406", date: "2026-11-01T17:30:00+09:00" },
    { title: "Global Coffee Roaster Launches Fully Biodegradable Plant-Based Capsules Nationwide", link: "https://www.newswire.com/news/global-coffee-roaster-biodegradable-capsules-2189407", date: "2026-11-01T17:15:00+09:00" },
    { title: "New Remote Collaboration Platform Integrates Immersive 3D Spatial Audio and Virtual Whiteboards", link: "https://www.newswire.com/news/remote-collaboration-platform-spatial-audio-2189408", date: "2026-11-01T16:55:00+09:00" },
    { title: "Biotech Firm Receives FDA Approval for Rapid Non-Invasive Diagnostic Blood Test", link: "https://www.newswire.com/news/biotech-firm-fda-approval-diagnostic-test-2189409", date: "2026-11-01T16:35:00+09:00" },
    { title: "International Aerospace Company Successfully Completes First Autonomous Cargo Drone Flight", link: "https://www.newswire.com/news/autonomous-cargo-drone-flight-success-2189410", date: "2026-11-01T16:15:00+09:00" },
    { title: "Urban Mobility Startup Launches Solar-Powered Micro-Fleet Across Five Major Metropolitan Cities", link: "https://www.newswire.com/news/urban-mobility-solar-powered-fleet-2189411", date: "2026-11-01T15:50:00+09:00" },
    { title: "Comprehensive Global Travel Survey Highlights Surge in Eco-Friendly Adventure Tourism", link: "https://www.newswire.com/news/global-travel-survey-eco-friendly-tourism-2189412", date: "2026-11-01T15:30:00+09:00" },
    { title: "Cutting-Edge Smart Home Hub Automates Residential Energy Management to Cut Utility Costs", link: "https://www.newswire.com/news/smart-home-hub-automates-energy-management-2189413", date: "2026-11-01T15:10:00+09:00" },
    { title: "Leading Fintech Enterprise Introduces Instant Cross-Border Payment System with Zero Fees", link: "https://www.newswire.com/news/fintech-instant-cross-border-payment-zero-fees-2189414", date: "2026-11-01T14:50:00+09:00" },
    { title: "Marine Conservation Organization Launches Global Initiative to Restore Degraded Coral Reefs", link: "https://www.newswire.com/news/marine-conservation-restore-coral-reefs-2189415", date: "2026-11-01T14:30:00+09:00" },
    { title: "Advanced Robotics Developer Introduces Next-Gen Warehouse Automation Fleet", link: "https://www.newswire.com/news/robotics-next-gen-warehouse-automation-2189416", date: "2026-11-01T14:10:00+09:00" },
    { title: "Premier Audio Brand Unveils Studio-Grade Wireless Headphones with Spatial ANC Technology", link: "https://www.newswire.com/news/premier-audio-studio-headphones-spatial-anc-2189417", date: "2026-11-01T13:45:00+09:00" },
    { title: "Digital Health Pioneer Launches Personalized Nutrition Platform Powered by Biomarker Tracking", link: "https://www.newswire.com/news/digital-health-personalized-nutrition-platform-2189418", date: "2026-11-01T13:20:00+09:00" },
    { title: "Educational Technology Provider Expands Free Coding Curriculum to Over One Million Students", link: "https://www.newswire.com/news/edtech-free-coding-curriculum-million-students-2189419", date: "2026-11-01T13:00:00+09:00" },
    { title: "Cloud Infrastructure Leader Announces Carbon-Negative Data Centers by End of Decade", link: "https://www.newswire.com/news/cloud-leader-carbon-negative-data-centers-2189420", date: "2026-11-01T12:30:00+09:00" }
  ]
};

class PRSourcesApp {
  constructor() {
    this.currentLang = localStorage.getItem("prquiz_lang") || "ja";
    this.langBtns = document.querySelectorAll(".lang-btn");
    this.sourcesListEl = document.getElementById("sources-list");
    this.pageTitleEl = document.getElementById("page-title");
    this.pageDescEl = document.getElementById("page-desc");
    this.footerScoreEl = document.getElementById("footer-score");
    this.footerSourcesLink = document.getElementById("footer-sources-link");
    this.updateTimeTextEl = document.getElementById("update-time-text");
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
        if (lang !== this.currentLang) {
          this.currentLang = lang;
          localStorage.setItem("prquiz_lang", this.currentLang);
          this.updateLanguageUI();
          this.loadSources(this.currentLang);
        }
      });
    });
  }

  updateLanguageUI() {
    // ページ全体の言語属性を現在選択されている言語に同期
    document.documentElement.lang = this.currentLang;

    this.langBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });

    const isEn = this.currentLang === "en";
    this.pageTitleEl.textContent = isEn
      ? "📰 Press Release Sources"
      : "📰 プレスリリース ソース元一覧";
    this.pageDescEl.textContent = isEn
      ? "Here is the list of recent press releases used in PR Quiz. Click any article to read the full story on Newswire."
      : "PR Quizで出題されている最新のプレスリリース一覧です。気になるタイトルの記事は、元サイト（PR TIMES）で全文をお読みいただけます。";
    if (this.footerSourcesLink) {
      this.footerSourcesLink.textContent = isEn ? "Press Release Sources List" : "プレスリリースのソース元サイト一覧";
    }
    this.updateFooterScore();
    this.renderUpdateTime();
  }

  renderUpdateTime() {
    if (!this.updateTimeTextEl) return;
    const isEn = this.currentLang === "en";

    const now = new Date();
    let year, month, day, hours;

    if (this.lastUpdatedAt && this.lastUpdatedAt.includes("+09:00")) {
      const parts = this.lastUpdatedAt.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (parts) {
        year = parts[1];
        month = parseInt(parts[2], 10);
        day = parseInt(parts[3], 10);
        hours = parts[4];
      }
    }

    if (!year) {
      const jstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      let min = jstNow.getUTCMinutes();
      let h = jstNow.getUTCHours();
      year = jstNow.getUTCFullYear();
      month = jstNow.getUTCMonth() + 1;
      day = jstNow.getUTCDate();
      if (min < 11) {
        const prev = new Date(now.getTime() + (9 * 60 * 60 * 1000) - (60 * 60 * 1000));
        year = prev.getUTCFullYear();
        month = prev.getUTCMonth() + 1;
        day = prev.getUTCDate();
        h = prev.getUTCHours();
      }
      hours = String(h).padStart(2, "0");
    }

    if (isEn) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      this.updateTimeTextEl.textContent = `Updated: ${months[month - 1]} ${day}, ${year} ${hours}:11 JST`;
    } else {
      this.updateTimeTextEl.textContent = `問題更新日時: ${year}年${month}月${day}日 ${hours}:11`;
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
    let sourceName = lang === "en" ? "Newswire" : "PR TIMES";

    try {
      const res = await fetch(`/api/releases?lang=${lang}`);
      if (!res.ok) throw new Error("API response not ok");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        // 1フィードにつき10件
        items = data.items.slice(0, 10);
        this.lastUpdatedAt = data.updatedAt || new Date().toISOString();
        if (data.source) sourceName = data.source;
      } else {
        throw new Error("No items");
      }
    } catch (err) {
      console.warn("Using fallback releases:", err);
      items = (FALLBACK_RELEASES[lang] || FALLBACK_RELEASES.ja).slice(0, 10);
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

    const isEn = this.currentLang === "en";
    const btnLabel = isEn ? "Read Article ↗" : "元記事を読む ↗";

    this.sourcesListEl.innerHTML = items.map((item, index) => {
      const titleEscaped = this.escapeHtml(item.title);
      const linkEscaped = this.escapeHtml(item.link);
      const dateFormatted = this.formatArticleDate(item.date, this.currentLang);
      const dateHtml = dateFormatted ? `<span>•</span><span>🕒 ${this.escapeHtml(dateFormatted)}</span>` : "";

      return `
        <article class="source-item-card">
          <div class="source-item-info">
            <a href="${linkEscaped}" target="_blank" rel="noopener noreferrer" class="source-item-title">
              ${titleEscaped}
            </a>
            <div class="source-item-meta">
              <span>📰 ${sourceName}</span>
              ${dateHtml}
              <span>•</span>
              <span>#${index + 1}</span>
            </div>
          </div>
          <a href="${linkEscaped}" target="_blank" rel="noopener noreferrer" class="source-open-btn">
            ${btnLabel}
          </a>
        </article>
      `;
    }).join("");
  }

  formatArticleDate(dateStr, lang) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
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

