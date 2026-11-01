# 🍎 PR Quiz (prquiz.com)

プレスリリースのタイトルから1文字を **🍎（りんごの絵文字）** に伏字化し、その1文字を当てる3択クイズサイトです。

- **日本語版**: [PR TIMES](https://prtimes.jp/) のRSSフィードから最新のプレスリリースを取得
- **英語版**: [Newswire](https://www.newswire.com/newsroom/all) のRSSフィードから最新のプレスリリースを取得
- **構成**:
  - `index.html`: クイズ出題・ヒント・回答判定（シングルページ）
  - `sources.html`: クイズに使用されたプレスリリースの一覧（元記事への送客リンク集）
  - `functions/api/releases.js`: Cloudflare Pages Functions によるサーバーサイドRSSプロキシ（CORS問題を解消し、5分間キャッシュ）

---

## 📁 ディレクトリ構成

```text
prquiz/
├── functions/
│   └── api/
│       └── releases.js       # Cloudflare Pages Functions (RSS取得＆パースAPI)
├── index.html                # クイズ画面 (3択・ヒント・正誤判定)
├── sources.html              # ソース元一覧画面
├── style.css                 # 共通スタイルシート
├── app.js                    # クイズ画面ロジック (🍎伏字化, 3択生成, 判定)
├── sources.js                # ソース元一覧ロジック
└── README.md
```

---

## 🚀 ローカルでの動作確認

Macのターミナルで本ディレクトリ（`prquiz`）に移動し、Pythonの簡易Webサーバーを起動します。

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。
※ ローカル環境では Functions の代わりに内蔵フォールバックデータが自動で読み込まれるため、即座にクイズのUI・動作をテストできます。

---

## 🌐 GitHub & Cloudflare Pages へのデプロイ手順

### 1. GitHub リポジトリを作成してプッシュ

```bash
git init
git add .
git commit -m "Initial commit for PR Quiz"
git branch -M main
# GitHubで作成したリポジトリURLを紐付け
git remote add origin https://github.com/<あなたのユーザー名>/prquiz.git
git push -u origin main
```

### 2. Cloudflare Pages と連携

1. **Cloudflare ダッシュボード** にログイン。
2. 左メニューの **「Workers & Pages」** > **「Create application」** > **「Pages」** > **「Connect to Git」** を選択。
3. 作成した `prquiz` リポジトリを選択。
4. 設定項目：
   - **Project name**: `prquiz`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: （空欄のままでOK）
   - **Build output directory**: `/` （空欄またはルート）
5. **「Save and Deploy」** をクリック。
   - `functions/` ディレクトリ内のコードは Cloudflare Pages によって自動認識され、`/api/releases` エンドポイントとしてデプロイされます！

### 3. 独自ドメイン `prquiz.com` の設定

1. Cloudflare Pages のプロジェクトダッシュボードで **「Custom domains」** タブを開く。
2. **「Set up a custom domain」** をクリックし、`prquiz.com`（または `www.prquiz.com`）を入力。
3. ドメインが同じ Cloudflare アカウントで契約されているため、DNSレコードの追加が自動的に行われ、数分で SSL証明書付きでアクセス可能になります。

