// PR Quiz - Main Quiz Application Logic

// ローカル検証やオフライン時用のフォールバックデータ（各記事への個別リンク）
const FALLBACK_RELEASES = {
  ja: [
    { title: "【新商品】老舗和菓子店が本気で作った極上生どら焼きが新登場！素材へのこだわりと職人技の結晶", link: "https://prtimes.jp/main/html/rd/p/000000018.000084512.html" },
    { title: "次世代AIプラットフォーム『SmartAssist』正式リリース、業務効率化を劇的に推進", link: "https://prtimes.jp/main/html/rd/p/000000045.000052319.html" },
    { title: "秋の味覚を満喫！旬の栗とシャインマスカットを贅沢に使った限定アフタヌーンティーを開催", link: "https://prtimes.jp/main/html/rd/p/000000112.000031890.html" },
    { title: "環境負荷を最大70%削減する新型エコパッケージを開発、全国の主要コンビニで順次導入開始", link: "https://prtimes.jp/main/html/rd/p/000000029.000076123.html" },
    { title: "国内最大規模のスタートアップカンファレンスが東京で開催決定！注目の登壇者50名を先行発表", link: "https://prtimes.jp/main/html/rd/p/000000088.000063450.html" },
    { title: "創業100周年記念！幻の復刻ブレンドコーヒーが数量限定で全国の直営店舗にて販売開始", link: "https://prtimes.jp/main/html/rd/p/000000007.000091204.html" },
    { title: "睡眠の質を可視化するスマート快眠デバイス『SleepFit』の先行予約販売を開始", link: "https://prtimes.jp/main/html/rd/p/000000034.000048911.html" },
    { title: "日本の伝統工芸と現代デザインが融合した新しい陶器ブランド『美織』が誕生", link: "https://prtimes.jp/main/html/rd/p/000000015.000082341.html" },
    { title: "大人気アニメとの特別コラボカフェが期間限定オープン！限定描き下ろしグッズも多数登場", link: "https://prtimes.jp/main/html/rd/p/000000056.000037192.html" },
    { title: "全自動で窓掃除をこなす最新スマート家電ロボットが登場、クラウドファンディングで目標達成", link: "https://prtimes.jp/main/html/rd/p/000000023.000069418.html" },
    { title: "全国10都市を巡る大型アートフェスティバルが開幕！光と音が織りなす没入型体験を提供", link: "https://prtimes.jp/main/html/rd/p/000000041.000055102.html" },
    { title: "糖質80%オフでも本格派！罪悪感ゼロのクラフトチョコレートが新発売", link: "https://prtimes.jp/main/html/rd/p/000000019.000073820.html" },
    { title: "クラウド型勤怠管理システムの新機能としてAIシフト自動作成ツールを提供開始", link: "https://prtimes.jp/main/html/rd/p/000000062.000044917.html" },
    { title: "北海道産厳選ミルクを使用した濃厚プレミアムソフトクリーム専門店が原宿にオープン", link: "https://prtimes.jp/main/html/rd/p/000000008.000093651.html" },
    { title: "企業の温室効果ガス排出量をリアルタイムで算定・可視化する新サービスを発表", link: "https://prtimes.jp/main/html/rd/p/000000037.000061280.html" },
    { title: "自宅で本格的なピラティスを体験できるオンライン受講プログラムが今冬スタート", link: "https://prtimes.jp/main/html/rd/p/000000025.000088419.html" },
    { title: "プロ仕様の音質を手のひらサイズで実現したワイヤレスイヤホン『SoundAir Pro』発売", link: "https://prtimes.jp/main/html/rd/p/000000073.000032904.html" },
    { title: "地方創生プロジェクト！古民家を再生した一日一組限定のプライベートヴィラが開業", link: "https://prtimes.jp/main/html/rd/p/000000014.000077815.html" },
    { title: "子どもの論理的思考力を楽しく育む知育プログラミングトイ『ロボキッズ』を新発売", link: "https://prtimes.jp/main/html/rd/p/000000031.000059124.html" },
    { title: "日本全国の隠れた名酒を毎月お届けする日本酒サブスクリプションサービスが会員1万人突破", link: "https://prtimes.jp/main/html/rd/p/000000048.000066230.html" }
  ],
  en: [
    { title: "Global Tech Innovator Announces Revolutionary Clean Energy Storage Solution for Commercial Use", link: "https://www.newswire.com/news/global-tech-innovator-announces-clean-energy-storage-solution-2189401" },
    { title: "Leading Healthcare Startup Secures Series B Funding to Expand AI-Powered Diagnostic Platform", link: "https://www.newswire.com/news/leading-healthcare-startup-secures-series-b-funding-2189402" },
    { title: "Annual Cybersecurity Report Reveals 40% Increase in Enterprise Cloud Vulnerabilities", link: "https://www.newswire.com/news/annual-cybersecurity-report-enterprise-cloud-vulnerabilities-2189403" },
    { title: "Pioneering Sustainable Fashion Brand Expands Global Retail Presence with New Flagship Stores", link: "https://www.newswire.com/news/pioneering-sustainable-fashion-brand-flagship-stores-2189404" },
    { title: "Breakthrough Quantum Computing Architecture Demonstrates 50x Processing Speed Enhancement", link: "https://www.newswire.com/news/quantum-computing-architecture-speed-enhancement-2189405" },
    { title: "Premier EV Manufacturer Unveils Long-Range Electric SUV Designed for Extreme Weather Conditions", link: "https://www.newswire.com/news/premier-ev-manufacturer-unveils-electric-suv-2189406" },
    { title: "Global Coffee Roaster Launches Fully Biodegradable Plant-Based Capsules Nationwide", link: "https://www.newswire.com/news/global-coffee-roaster-biodegradable-capsules-2189407" },
    { title: "New Remote Collaboration Platform Integrates Immersive 3D Spatial Audio and Virtual Whiteboards", link: "https://www.newswire.com/news/remote-collaboration-platform-spatial-audio-2189408" },
    { title: "Biotech Firm Receives FDA Approval for Rapid Non-Invasive Diagnostic Blood Test", link: "https://www.newswire.com/news/biotech-firm-fda-approval-diagnostic-test-2189409" },
    { title: "International Aerospace Company Successfully Completes First Autonomous Cargo Drone Flight", link: "https://www.newswire.com/news/autonomous-cargo-drone-flight-success-2189410" },
    { title: "Urban Mobility Startup Launches Solar-Powered Micro-Fleet Across Five Major Metropolitan Cities", link: "https://www.newswire.com/news/urban-mobility-solar-powered-fleet-2189411" },
    { title: "Comprehensive Global Travel Survey Highlights Surge in Eco-Friendly Adventure Tourism", link: "https://www.newswire.com/news/global-travel-survey-eco-friendly-tourism-2189412" },
    { title: "Cutting-Edge Smart Home Hub Automates Residential Energy Management to Cut Utility Costs", link: "https://www.newswire.com/news/smart-home-hub-automates-energy-management-2189413" },
    { title: "Leading Fintech Enterprise Introduces Instant Cross-Border Payment System with Zero Fees", link: "https://www.newswire.com/news/fintech-instant-cross-border-payment-zero-fees-2189414" },
    { title: "Marine Conservation Organization Launches Global Initiative to Restore Degraded Coral Reefs", link: "https://www.newswire.com/news/marine-conservation-restore-coral-reefs-2189415" },
    { title: "Advanced Robotics Developer Introduces Next-Gen Warehouse Automation Fleet", link: "https://www.newswire.com/news/robotics-next-gen-warehouse-automation-2189416" },
    { title: "Premier Audio Brand Unveils Studio-Grade Wireless Headphones with Spatial ANC Technology", link: "https://www.newswire.com/news/premier-audio-studio-headphones-spatial-anc-2189417" },
    { title: "Digital Health Pioneer Launches Personalized Nutrition Platform Powered by Biomarker Tracking", link: "https://www.newswire.com/news/digital-health-personalized-nutrition-platform-2189418" },
    { title: "Educational Technology Provider Expands Free Coding Curriculum to Over One Million Students", link: "https://www.newswire.com/news/edtech-free-coding-curriculum-million-students-2189419" },
    { title: "Cloud Infrastructure Leader Announces Carbon-Negative Data Centers by End of Decade", link: "https://www.newswire.com/news/cloud-leader-carbon-negative-data-centers-2189420" }
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
          this.score = 0;
          this.totalAnswered = 0;
          this.updateScoreUI();
          await this.loadFeed(this.currentLang);
        }
      });
    });

    // ヒントトグル
    this.hintToggleBtn.addEventListener("click", () => {
      this.hintBox.classList.toggle("active");
    });

    // 次の問題へボタン
    this.nextBtn.addEventListener("click", () => {
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
    this.hintToggleBtn.innerHTML = isEn ? "💡 Show Hint" : "💡 ヒントを見る";
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
    this.renderUpdateTime();
  }

  renderUpdateTime() {
    if (!this.updateTimeTextEl) return;
    const isEn = this.currentLang === "en";

    // JSTの日時（西暦含む）をフォーマット
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

  async loadFeed(lang) {
    this.questionTextEl.innerHTML = `<div class="loading-indicator"><div class="spinner"></div><p>${lang === 'en' ? 'Fetching latest press releases...' : '最新のプレスリリースを取得中...'}</p></div>`;
    this.choicesContainer.innerHTML = "";
    this.resultBox.classList.remove("active");
    this.hintBox.classList.remove("active");
    this.nextBtn.disabled = true;

    try {
      const res = await fetch(`/api/releases?lang=${lang}`);
      if (!res.ok) throw new Error("API response not ok");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        // 1フィードにつき10問（10件）
        this.releases = this.shuffleArray(data.items).slice(0, 10);
        this.lastUpdatedAt = data.updatedAt || new Date().toISOString();
      } else {
        throw new Error("No items in feed");
      }
    } catch (err) {
      console.warn("Using fallback releases due to API fetch failure:", err);
      this.releases = this.shuffleArray(FALLBACK_RELEASES[lang] || FALLBACK_RELEASES.ja).slice(0, 10);
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
      link: item.link
    };

    this.hasAnswered = false;

    // ソース元バッジ更新
    if (this.sourceBadgeEl) {
      const sourceName = this.currentLang === "en" ? "Newswire" : "PR TIMES";
      this.sourceBadgeEl.innerHTML = `📰 ${sourceName} (${this.currentIndex + 1}/${this.releases.length})`;
    }

    // 問題文（🍎伏字）表示
    this.questionTextEl.innerHTML = this.currentQuestion.maskedHtml;

    // ヒントリンク設定
    this.hintLinkEl.href = item.link;
    this.hintLinkEl.innerHTML = `${item.link.substring(0, 50)}... ↗`;
    this.hintBox.classList.remove("active");

    // 結果ボックス初期化
    this.resultBox.className = "result-box";
    this.resultBox.style.display = "none";

    // 選択肢（3択）生成
    this.renderChoices(this.currentQuestion.choices);

    // 次へボタン無効化（回答するまで進めない）
    this.nextBtn.disabled = true;
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
    this.totalAnswered++;

    const isCorrect = selectedChoice === this.currentQuestion.correctChar;
    if (isCorrect) this.score++;

    this.updateScoreUI();

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

    // 次へボタンを活性化
    this.nextBtn.disabled = false;
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
      ? "Read full press release on source site ↗"
      : "プレスリリースの全文を元サイトで読む ↗";
  }

  nextQuestion() {
    this.currentIndex = (this.currentIndex + 1) % this.releases.length;
    this.showQuestion();
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

