// PR Quiz - Sources List Page Logic

const FALLBACK_RELEASES = {
  ja: [
    {
      title: "【新商品】老舗和菓子店が本気で作った極上生どら焼きが新登場！素材へのこだわりと職人技の結晶",
      link: "https://prtimes.jp/"
    },
    {
      title: "次世代AIプラットフォーム『SmartAssist』正式リリース、業務効率化を劇的に推進",
      link: "https://prtimes.jp/"
    },
    {
      title: "秋の味覚を満喫！旬の栗とシャインマスカットを贅沢に使った限定アフタヌーンティーを開催",
      link: "https://prtimes.jp/"
    },
    {
      title: "環境負荷を最大70%削減する新型エコパッケージを開発、全国の主要コンビニで順次導入開始",
      link: "https://prtimes.jp/"
    },
    {
      title: "国内最大規模のスタートアップカンファレンスが東京で開催決定！注目の登壇者50名を先行発表",
      link: "https://prtimes.jp/"
    }
  ],
  en: [
    {
      title: "Global Tech Innovator Announces Revolutionary Clean Energy Storage Solution for Commercial Use",
      link: "https://www.newswire.com/newsroom/all"
    },
    {
      title: "Leading Healthcare Startup Secures Series B Funding to Expand AI-Powered Diagnostic Platform",
      link: "https://www.newswire.com/newsroom/all"
    },
    {
      title: "Annual Cybersecurity Report Reveals 40% Increase in Enterprise Cloud Vulnerabilities",
      link: "https://www.newswire.com/newsroom/all"
    },
    {
      title: "Pioneering Sustainable Fashion Brand Expands Global Retail Presence with New Flagship Stores",
      link: "https://www.newswire.com/newsroom/all"
    }
  ]
};

class PRSourcesApp {
  constructor() {
    this.currentLang = localStorage.getItem("prquiz_lang") || "ja";
    this.langBtns = document.querySelectorAll(".lang-btn");
    this.sourcesListEl = document.getElementById("sources-list");
    this.pageTitleEl = document.getElementById("page-title");
    this.pageDescEl = document.getElementById("page-desc");

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateLanguageUI();
    this.loadSources(this.currentLang);
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
        items = data.items;
        if (data.source) sourceName = data.source;
      } else {
        throw new Error("No items");
      }
    } catch (err) {
      console.warn("Using fallback releases:", err);
      items = FALLBACK_RELEASES[lang] || FALLBACK_RELEASES.ja;
    }

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

      return `
        <article class="source-item-card">
          <div class="source-item-info">
            <a href="${linkEscaped}" target="_blank" rel="noopener noreferrer" class="source-item-title">
              ${titleEscaped}
            </a>
            <div class="source-item-meta">
              <span>📰 ${sourceName}</span>
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

