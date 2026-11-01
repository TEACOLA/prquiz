// PR Quiz - Main Quiz Application Logic

// ローカル検証やオフライン時用のフォールバックデータ（各記事への個別リンク）
const FALLBACK_RELEASES = {
  ja: [
    { title: "【2026年11月号】モデルとして活躍する鈴木ゆうかさんが『PLACOLE＆DRESSY』のカバーモデルとして登場！", link: "https://prtimes.jp/main/html/rd/p/000001178.000021126.html", source: "PR TIMES" },
    { title: "「地上の太陽」目指し、ITER炉心の主要部品そろう 建設の節目", link: "https://scienceportal.jst.go.jp/newsflash/20261030_n01/", source: "サイエンスポータル" },
    { title: "【新店舗】いーふらん、福岡県直方市に「高価買取おたからや 直方本店」を出店！｜2026年11月2日（月）オープン！｜金・腕時計・ブランドバッグなどの査定・買取は「高価買取おたからや」にお任せください！", link: "https://prtimes.jp/main/html/rd/p/000000472.000080252.html", source: "PR TIMES" },
    { title: "千葉豪雨など今夏3件の大雨は温暖化が発生リスク高める WACが分析", link: "https://scienceportal.jst.go.jp/newsflash/20261029_n01/", source: "サイエンスポータル" },
    { title: "買取専科 11月に全国4エリアに新店舗を順次オープン決定！(東京都・埼玉県・京都府・大阪府）", link: "https://prtimes.jp/main/html/rd/p/000000102.000143963.html", source: "PR TIMES" },
    { title: "各種モビリティと人の「混在交通」 現在と未来を考える日米合同シンポ", link: "https://scienceportal.jst.go.jp/stories/20261028_s01/", source: "サイエンスポータル" },
    { title: "群馬・みなかみの新拠点「BUB RESORT Minakami」、11月1日（日）より予約受付を開始。12月24日（木）プレオープン", link: "https://prtimes.jp/main/html/rd/p/000000191.000043533.html", source: "PR TIMES" },
    { title: "「59分60秒、やめます」うるう秒廃止を決議 国際度量衡総会", link: "https://scienceportal.jst.go.jp/newsflash/20261027_n01/", source: "サイエンスポータル" },
    { title: "祝！塩田武士『存在のすべてを』が『読者が選ぶ文庫本「本の日」大賞』大賞受賞！", link: "https://prtimes.jp/main/html/rd/p/000002478.000004702.html", source: "PR TIMES" },
    { title: "プログラミング言語「PHP」に重大欠陥 ネット社会のもろさ浮き彫り", link: "https://scienceportal.jst.go.jp/stories/20261026_s01/", source: "サイエンスポータル" },
    { title: "ショート映画配信サービス「SAMANSA」月額利用料金改定のお知らせ", link: "https://prtimes.jp/main/html/rd/p/000000194.000082116.html", source: "PR TIMES" },
    { title: "「多文化共生」のため、科学技術どう活用？ サイエンスアゴラin前橋", link: "https://scienceportal.jst.go.jp/stories/20261023_s01/", source: "サイエンスポータル" },
    { title: "「FiT24 春日井店」が11月1日（日）オープン！ワンフロアに充実のマシンと大型駐車場を完備～オープン記念キャンペーン開催！月会費が最大3ヶ月0円～", link: "https://prtimes.jp/main/html/rd/p/000000166.000075275.html", source: "PR TIMES" },
    { title: "火星衛星フォボスの試料回収へ旅立ち MMX打ち上げ成功 種子島", link: "https://scienceportal.jst.go.jp/newsflash/20261021_n01/", source: "サイエンスポータル" },
    { title: "三ツ境駅前スマイル歯科 院長・樋田秀一が「歯周病菌リアルタイムPCR検査導入セミナー」に講師として登壇", link: "https://prtimes.jp/main/html/rd/p/000000053.000136443.html", source: "PR TIMES" },
    { title: "日本の伝統工芸と現代デザインが融合した新しい陶器ブランド『美織』が誕生", link: "https://prtimes.jp/main/html/rd/p/000000015.000082341.html", source: "PR TIMES" },
    { title: "アミューズメント施設の届業務をもっと手軽に！「レイ変更け作成くん β」の提供を開始いたしました。", link: "https://prtimes.jp/main/html/rd/p/000000040.000015943.html", source: "PR TIMES" },
    { title: "この卵はプリンに？茶碗蒸しに？ 鶏の飼い方で味が変わる 農工大など", link: "https://scienceportal.jst.go.jp/stories/20261020_s01/", source: "サイエンスポータル" },
    { title: "VML & Ogilvy Japan、マーケティング効果を評価するアワード「APAC Effie Awards」にてブロンズを受賞", link: "https://prtimes.jp/main/html/rd/p/000000031.000107739.html", source: "PR TIMES" },
    { title: "打ち上げ迫る「MMX」 火星衛星フォボスから、どんなお土産を？", link: "https://scienceportal.jst.go.jp/stories/20261019_s01/", source: "サイエンスポータル" }
  ],
  en: [
    { title: "A New Chapter in America's Lithium Story: Elektros (OTC:ELEK) Advances Its Review of a Northern New York Opportunity", link: "https://www.newswire.com/news/see-2277941", source: "Newswire" },
    { title: "APOD: 2026 November 1 – Colors of the Moon", link: "https://science.nasa.gov/image-article/apod-2026-november-1-colors-of-the-moon/", source: "NASA" },
    { title: "Positioning for America's Next Lithium Opportunity: Elektros (OTC:ELEK) Evaluates Northern New York Potential", link: "https://www.newswire.com/news/see-1194908", source: "Newswire" },
    { title: "APOD: 2026 October 31 – Night on a Spooky Planet", link: "https://science.nasa.gov/image-article/apod-2026-october-31-night-on-a-spooky-planet/", source: "NASA" },
    { title: "The Domestic Lithium Landscape Is Evolving: Elektros (OTC:ELEK) Studies a Northern New York Possibility", link: "https://www.newswire.com/news/see-3262995", source: "Newswire" },
    { title: "NASA Releases MAX POWER Key Events for Media, Participants", link: "https://www.nasa.gov/news-release/nasa-releases-max-power-key-events-for-media-participants/", source: "NASA" },
    { title: "Glioblastoma Foundation's Genomic Testing & Research Laboratory Now Accepting Patient Samples for Genomic Testing", link: "https://www.newswire.com/news/glioblastoma-foundation-s-genomic-testing-research-laboratory-now-22880316", source: "Newswire" },
    { title: "NASA’s James Webb Space Telescope Captures Eerie Cat’s Head", link: "https://www.nasa.gov/image-article/nasas-james-webb-space-telescope-captures-eerie-cats-head/", source: "NASA" },
    { title: "From Global Private Credit to Programmable Securities: New to The Street Show #778 Premieres Tonight on Bloomberg Television", link: "https://www.newswire.com/news/from-global-private-credit-to-programmable-securities-new-to-the-street-show", source: "Newswire" },
    { title: "NASA Explores Potential Commercial Servicing for Hubble Telescope", link: "https://science.nasa.gov/missions/hubble/nasa-explores-potential-commercial-servicing-for-hubble-telescope/", source: "NASA" },
    { title: "Commercial Cleaning Business Funding: How Established Cleaning Companies Can Take On Bigger Contracts Before the First Invoice Pays", link: "https://www.newswire.com/news/commercial-cleaning-business-funding-how-established-cleaning-22878435", source: "Newswire" },
    { title: "November’s Night Sky Notes: Light-Day Away", link: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/novembers-night-sky-notes-light-day-away/", source: "NASA" },
    { title: "How to Repurpose Old Furniture into New Treasures", link: "https://www.newswire.com/news/how-to-repurpose-old-furniture-into-new-treasures", source: "Newswire" },
    { title: "APOD: 2026 October 30 – Haunting the Cepheus Flare", link: "https://science.nasa.gov/image-article/apod-2026-october-30-haunting-the-cepheus-flare/", source: "NASA" },
    { title: "Villora Reviews and Complaints 2026: No Scoops, No Mixing-Is This Your Next Daily Gut Routine?", link: "https://www.newswire.com/news/villora-reviews-and-complaints-2026-no-scoops-no-mixing-is-this-your-next-daily", source: "Newswire" },
    { title: "Vega Island Frozen in Fright", link: "https://science.nasa.gov/earth/earth-observatory/vega-island-frozen-in-fright/", source: "NASA" },
    { title: "Oilume Customer Reviews and Complaints 2026: The 80% Hair-Removal Oil Pitch-What to Know Before Ordering", link: "https://www.newswire.com/news/oilume-customer-reviews-and-complaints-2026-the-80-hair-removal-oil-pitch-what", source: "Newswire" },
    { title: "Map Showing Potential Origins of Martian Meteorite Teghaza 001", link: "https://science.nasa.gov/photojournal/map-showing-potential-origins-of-martian-meteorite-teghaza-001/", source: "NASA" },
    { title: "KensaiChef Titanium Cutting Board Reviews & Complaints 2026: Two Prep Surfaces, Built-In Tools-Your Next Kitchen Upgrade?", link: "https://www.newswire.com/news/kensaichef-titanium-cutting-board-reviews-complaints-2026-two-prep-surfaces", source: "Newswire" },
    { title: "Slice of Martian Meteorite Teghaza 001", link: "https://science.nasa.gov/photojournal/slice-of-martian-meteorite-teghaza-001/", source: "NASA" }
  ]
};

// ダミー選択肢生成用の共通プール
const DUMMY_KANJI = ["新", "大", "初", "発", "開", "生", "最", "美", "特", "高", "気", "神", "天", "創", "進", "愛", "光", "星", "風", "空", "海", "力", "道", "心", "夢"];
const DUMMY_KANA = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の"];
const DUMMY_KATAKANA = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ"];

class PRQuizApp {
  constructor() {
    this.currentLang = localStorage.getItem("prquiz_lang") || "ja";
    this.releases = [];
    this.currentIndex = 0;
    this.currentQuestion = null;
    this.hasAnswered = false;
    this.score = 0;
    this.totalAnswered = 0;

    // DOM要素の取得
    this.langBtns = document.querySelectorAll(".lang-btn");
    this.questionTextEl = document.getElementById("question-text");
    this.sourceBadgeEl = document.getElementById("source-badge");
    this.scoreBadgeEl = document.getElementById("score-badge");
    this.hintToggleBtn = document.getElementById("hint-toggle-btn");
    this.hintBox = document.getElementById("hint-box");
    this.hintLinkEl = document.getElementById("hint-link");
    this.choicesContainer = document.getElementById("choices-container");
    this.resultBox = document.getElementById("result-box");
    this.resultTitle = document.getElementById("result-title");
    this.resultDetail = document.getElementById("result-detail");
    this.resultOriginalTitle = document.getElementById("result-original-title");
    this.resultLink = document.getElementById("result-link");
    this.nextBtn = document.getElementById("next-btn");
    this.headerAccuracyEl = document.getElementById("header-accuracy");
    this.footerScoreEl = document.getElementById("footer-score");
    this.footerSourcesLink = document.getElementById("footer-sources-link");
    this.updateTimeTextEl = document.getElementById("update-time-text");
    this.lastUpdatedAt = null;

    // 保存されているスコアがあれば復元
    this.score = parseInt(localStorage.getItem("prquiz_score") || "0", 10);
    this.totalAnswered = parseInt(localStorage.getItem("prquiz_total") || "0", 10);

    this.init();
  }

  async init() {
    this.bindEvents();
    this.updateLanguageUI();
    this.updateScoreUI();
    await this.loadFeed(this.currentLang);
  }

  bindEvents() {
    // 言語切り替え
    this.langBtns.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const selectedLang = e.currentTarget.dataset.lang;
        if (selectedLang !== this.currentLang) {
          this.currentLang = selectedLang;
          localStorage.setItem("prquiz_lang", this.currentLang);
          this.updateLanguageUI();
          this.updateScoreUI();
          await this.loadFeed(this.currentLang);
        }
      });
    });

    // ヒントトグル
    this.hintToggleBtn.addEventListener("click", () => {
      this.hintBox.classList.toggle("active");
      this.updateHintButtonText();
    });

    // 次の問題へボタン
    this.nextBtn.addEventListener("click", (e) => {
      if (e) e.preventDefault();
      this.nextQuestion();
    });
  }

  updateLanguageUI() {
    // ページ全体の言語属性を現在選択されている言語に同期
    document.documentElement.lang = this.currentLang;

    this.langBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });

    const isEn = this.currentLang === "en";
    this.updateHintButtonText();
    document.getElementById("hint-notice").textContent = isEn
      ? "Hint (Original release URL):"
      : "ヒント（元記事はこちら）:";
    document.getElementById("hint-subtext").textContent = isEn
      ? "The answer is in this press release!"
      : "プレスリリースの元記事に答えが載っています！";
    this.nextBtn.innerHTML = isEn ? 'Next Question &rarr;' : '次の問題へ &rarr;';
    document.getElementById("question-label").textContent = isEn ? "QUESTION (Fill the 🍎)" : "問題（🍎に入る文字は？）";
    if (this.footerSourcesLink) {
      this.footerSourcesLink.textContent = isEn ? "Press Release Sources List" : "プレスリリースのソース元サイト一覧";
    }
    const originalLabel = document.getElementById("result-original-label");
    if (originalLabel) {
      originalLabel.textContent = isEn ? "▼ Original Title:" : "▼ 元のタイトル:";
    }
    this.updateScoreUI();
    this.renderUpdateTime();
  }

  updateHintButtonText() {
    if (!this.hintToggleBtn) return;
    const isEn = this.currentLang === "en";
    const isOpen = this.hintBox && this.hintBox.classList.contains("active");

    if (isOpen) {
      this.hintToggleBtn.innerHTML = isEn ? "✖ Hide Hint" : "✖ ヒントを閉じる";
    } else {
      this.hintToggleBtn.innerHTML = isEn ? "💡 Show Hint" : "💡 ヒントを見る";
    }
  }

  renderUpdateTime() {
    if (!this.updateTimeTextEl) return;
    const isEn = this.currentLang === "en";

    let d;
    if (this.lastUpdatedAt) {
      d = new Date(this.lastUpdatedAt);
    } else {
      const nowSec = Math.floor(Date.now() / 1000);
      const batchSec = Math.floor(nowSec / (64 * 60)) * (64 * 60);
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

  async loadFeed(lang) {
    this.questionTextEl.innerHTML = `<div class="loading-indicator"><div class="spinner"></div><p>${lang === 'en' ? 'Fetching latest press releases...' : '最新のプレスリリースを取得中...'}</p></div>`;
    this.choicesContainer.innerHTML = "";
    this.resultBox.classList.remove("active");
    this.hintBox.classList.remove("active");
    this.updateHintButtonText();

    try {
      const res = await fetch(`/api/releases?lang=${lang}`);
      if (!res.ok) throw new Error("API response not ok");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        this.releases = this.shuffleArray(data.items);
        this.lastUpdatedAt = data.updatedAt || new Date().toISOString();
      } else {
        throw new Error("No items in feed");
      }
    } catch (err) {
      console.warn("Using fallback releases due to API fetch failure:", err);
      this.releases = this.shuffleArray(FALLBACK_RELEASES[lang] || FALLBACK_RELEASES.ja);
      this.lastUpdatedAt = this.lastUpdatedAt || new Date().toISOString();
    }

    this.renderUpdateTime();
    this.currentIndex = 0;
    this.showQuestion();
  }

  showQuestion() {
    if (!this.releases || this.releases.length === 0) {
      this.questionTextEl.textContent = this.currentLang === "en" ? "No press releases available." : "プレスリリースを取得できませんでした。";
      return;
    }

    const item = this.releases[this.currentIndex];
    const quizData = this.createQuizFromTitle(item.title, this.currentLang);

    if (!quizData) {
      // 適切な伏字文字が見つからなかった場合は次を試す
      this.currentIndex = (this.currentIndex + 1) % this.releases.length;
      this.showQuestion();
      return;
    }

    this.currentQuestion = {
      ...quizData,
      link: item.link,
      source: item.source
    };

    this.hasAnswered = false;

    // ソース元バッジ更新
    if (this.sourceBadgeEl) {
      const itemSource = item.source || (this.currentLang === "en" ? "Newswire" : "PR TIMES");
      let icon = "📰";
      if (itemSource.includes("サイエンス")) icon = "🔬";
      else if (itemSource.includes("NASA")) icon = "🚀";
      else if (itemSource === "Newswire") icon = "🌐";
      this.sourceBadgeEl.innerHTML = `${icon} ${itemSource} (${this.currentIndex + 1}/${this.releases.length})`;
    }

    // 問題文（🍎伏字）表示
    this.questionTextEl.innerHTML = this.currentQuestion.maskedHtml;

    // ヒントリンク設定
    this.hintLinkEl.href = item.link;
    this.hintLinkEl.innerHTML = `${item.link.substring(0, 50)}... ↗`;
    this.hintBox.classList.remove("active");
    this.updateHintButtonText();

    // 結果ボックス初期化
    this.resultBox.className = "result-box";
    this.resultBox.style.display = "none";

    // 選択肢（3択）生成
    this.renderChoices(this.currentQuestion.choices);
  }

  createQuizFromTitle(title, lang) {
    // 記号や空白を除外した「クイズ対象にできる文字」のインデックスを抽出
    const candidates = [];

    for (let i = 0; i < title.length; i++) {
      const char = title[i];
      if (this.isValidChar(char, lang)) {
        candidates.push(i);
      }
    }

    if (candidates.length === 0) return null;

    // ランダムに1文字を正解として選択
    const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const correctChar = title[chosenIndex];

    // 伏字HTMLの作成（🍎で置き換え）
    const before = this.escapeHtml(title.slice(0, chosenIndex));
    const after = this.escapeHtml(title.slice(chosenIndex + 1));
    const maskedHtml = `${before}<span class="masked-char" aria-label="伏字">🍎</span>${after}`;

    // ダミー選択肢を2つ生成
    const dummyChoices = this.generateDummyChoices(correctChar, title, lang);

    // 3択選択肢をまとめてシャッフル
    const choices = this.shuffleArray([correctChar, ...dummyChoices]);

    return {
      originalTitle: title,
      maskedHtml,
      correctChar,
      choices
    };
  }

  // 伏字対象として適切な文字か判定（記号・句読点・空白は除外）
  isValidChar(char, lang) {
    if (/\s/.test(char)) return false;
    const ignoredSymbols = /[【】『』「」（）()［］\[\]・、。！？!?：:；;〜~／/\-_+=*&^%$#@!\\|`"'<>]/;
    if (ignoredSymbols.test(char)) return false;

    if (lang === "en") {
      // 英語の場合は英数字
      return /[a-zA-Z0-9]/.test(char);
    } else {
      // 日本語の場合は漢字、ひらがな、カタカナ、または英数字
      return /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z0-9]/.test(char);
    }
  }

  // 正解文字に合わせた、もっともらしいダミー文字を2つ生成
  generateDummyChoices(correctChar, fullTitle, lang) {
    const dummies = new Set();
    const isEn = lang === "en";

    // 1. まずタイトル内の他の文字からダミー候補を探す
    for (let i = 0; i < fullTitle.length; i++) {
      const c = fullTitle[i];
      if (c !== correctChar && this.isValidChar(c, lang) && this.getCharType(c) === this.getCharType(correctChar)) {
        dummies.add(c);
        if (dummies.size >= 2) break;
      }
    }

    // 2. 足りない場合は文字種別プールから補完
    const type = this.getCharType(correctChar);
    let pool = DUMMY_KANJI;
    if (type === "hiragana") pool = DUMMY_KANA;
    else if (type === "katakana") pool = DUMMY_KATAKANA;
    else if (type === "alpha_upper") pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    else if (type === "alpha_lower") pool = "abcdefghijklmnopqrstuvwxyz".split("");
    else if (type === "digit") pool = "0123456789".split("");

    const shuffledPool = this.shuffleArray([...pool]);
    for (const c of shuffledPool) {
      if (dummies.size >= 2) break;
      if (c !== correctChar) {
        dummies.add(c);
      }
    }

    return Array.from(dummies).slice(0, 2);
  }

  getCharType(c) {
    if (/[\u4E00-\u9FFF]/.test(c)) return "kanji";
    if (/[\u3040-\u309F]/.test(c)) return "hiragana";
    if (/[\u30A0-\u30FF]/.test(c)) return "katakana";
    if (/[A-Z]/.test(c)) return "alpha_upper";
    if (/[a-z]/.test(c)) return "alpha_lower";
    if (/[0-9]/.test(c)) return "digit";
    return "other";
  }

  renderChoices(choices) {
    this.choicesContainer.innerHTML = "";

    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.dataset.choice = choice;
      btn.innerHTML = `<span class="choice-value">${this.escapeHtml(choice)}</span>`;

      btn.addEventListener("click", () => this.handleAnswer(choice, btn));
      this.choicesContainer.appendChild(btn);
    });
  }

  handleAnswer(selectedChoice, clickedBtn) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;

    const prevRate = this.totalAnswered > 0 ? Math.round((this.score / this.totalAnswered) * 100) : 0;
    this.totalAnswered++;

    const isCorrect = selectedChoice === this.currentQuestion.correctChar;
    if (isCorrect) this.score++;

    const newRate = Math.round((this.score / this.totalAnswered) * 100);

    this.updateScoreUI();

    // 正解率が上昇した場合（初回正解の0%→100%含む）、ヘッダー正解率を2秒間輝かせる
    if (isCorrect && (newRate > prevRate || (prevRate === 100 && newRate === 100))) {
      this.triggerAccuracyGlow();
    }

    // 選択肢ボタンのスタイル更新
    const buttons = this.choicesContainer.querySelectorAll(".choice-btn");
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.choice === this.currentQuestion.correctChar) {
        btn.classList.add("correct");
      } else if (btn === clickedBtn) {
        btn.classList.add("incorrect");
      }
    });

    // 結果表示
    this.showResult(isCorrect);
  }

  showResult(isCorrect) {
    const isEn = this.currentLang === "en";
    this.resultBox.style.display = "block";
    this.resultBox.className = `result-box active ${isCorrect ? "correct" : "incorrect"}`;

    if (isCorrect) {
      this.resultTitle.className = "result-title correct";
      this.resultTitle.innerHTML = isEn ? "🎉 Correct!" : "🎉 正解！";
      this.resultDetail.innerHTML = isEn
        ? `The missing letter was <strong>"${this.escapeHtml(this.currentQuestion.correctChar)}"</strong>!`
        : `正解の文字は「<strong>${this.escapeHtml(this.currentQuestion.correctChar)}</strong>」でした！`;
    } else {
      this.resultTitle.className = "result-title incorrect";
      this.resultTitle.innerHTML = isEn ? "😢 Incorrect!" : "😢 不正解！";
      this.resultDetail.innerHTML = isEn
        ? `The correct letter was <strong>"${this.escapeHtml(this.currentQuestion.correctChar)}"</strong>.`
        : `惜しい！正解の文字は「<strong>${this.escapeHtml(this.currentQuestion.correctChar)}</strong>」でした。`;
    }

    this.resultOriginalTitle.textContent = this.currentQuestion.originalTitle;
    this.resultLink.href = this.currentQuestion.link;
    this.resultLink.innerHTML = isEn
      ? "Read full article on original site ↗"
      : "記事の全文を元サイトで読む ↗";
  }

  nextQuestion() {
    // ボタンのフォーカスを解除（ブラウザがボタン位置にスクロールを留めようとするのを防ぐ）
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }

    this.currentIndex = (this.currentIndex + 1) % this.releases.length;
    this.showQuestion();

    // ページ最上部（ヘッダー）へスクロール
    const header = document.querySelector(".site-header");
    if (header && typeof header.scrollIntoView === "function") {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    // レイアウト変更（結果表示エリアの非表示）直後にスクロールが中断された場合のフォールバック
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

  // 右上の正解率バッジを2秒間輝かせる演出
  triggerAccuracyGlow() {
    if (!this.headerAccuracyEl) return;
    this.headerAccuracyEl.classList.remove("shining");
    // リフローを発生させてアニメーションを確実に再始動
    void this.headerAccuracyEl.offsetWidth;
    this.headerAccuracyEl.classList.add("shining");

    if (this._glowTimer) clearTimeout(this._glowTimer);
    this._glowTimer = setTimeout(() => {
      if (this.headerAccuracyEl) {
        this.headerAccuracyEl.classList.remove("shining");
      }
    }, 2000);
  }

  updateScoreUI() {
    const isEn = this.currentLang === "en";
    if (this.scoreBadgeEl) {
      const label = isEn ? "Score" : "スコア";
      this.scoreBadgeEl.textContent = `${label}: ${this.score} / ${this.totalAnswered}`;
    }

    const rate = this.totalAnswered > 0 ? Math.round((this.score / this.totalAnswered) * 100) : 0;
    localStorage.setItem("prquiz_score", this.score);
    localStorage.setItem("prquiz_total", this.totalAnswered);

    if (this.headerAccuracyEl) {
      this.headerAccuracyEl.textContent = isEn
        ? `Accuracy: ${rate}%`
        : `正解率: ${rate}%`;
    }

    if (this.footerScoreEl) {
      this.footerScoreEl.textContent = isEn
        ? `Score: ${this.score} / Answers: ${this.totalAnswered} (Accuracy: ${rate}%)`
        : `正解数: ${this.score} / 回答数: ${this.totalAnswered}（正解率: ${rate}%）`;
    }
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

// ページ読み込み完了時に起動
document.addEventListener("DOMContentLoaded", () => {
  new PRQuizApp();
});

