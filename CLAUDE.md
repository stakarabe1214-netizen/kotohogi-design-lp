# ことほぎデザイン LP プロジェクト ガイド

このドキュメントは、LPページ制作からデプロイまでの作業手順をまとめたものです。
次回以降のLP制作で同じ品質・手順を再現するための参照ガイドとして使用してください。

---

## プロジェクト概要

- **プロジェクト名**: ことほぎデザイン AI×デザイン制作会社 LP
- **本番URL**: https://lp-project-flame.vercel.app
- **GitHubリポジトリ**: https://github.com/stakarabe1214-netizen/kotohogi-design-lp

---

## LPページの構成

```
lp-project/
├── index.html              # 本番用エントリーポイント（Vercel向け）
├── AI×デザイン制作会社 LP.html  # メインLPファイル（編集はこちら）
├── tsumugu-lp.html         # 旧バージョン（参考用）
├── api/
│   └── contact.js          # お問い合わせフォームAPIエンドポイント
├── lib/
│   ├── db.js               # MongoDB接続・スキーマ定義
│   ├── email.js            # Gmail SMTPメール送信
│   └── validation.js       # フォームバリデーション
├── public/
│   ├── images/
│   │   ├── case01.png〜case06.png  # 制作実績画像
│   │   ├── about-couple.png        # 私たちについてセクションの写真
│   │   ├── slide-01.jpg            # ヒーロースライド：チラシ制作
│   │   ├── slide-02.jpg            # ヒーロースライド：SNS素材
│   │   ├── slide-03.jpg            # ヒーロースライド：撮影
│   │   └── slide-04.jpg            # ヒーロースライド：LP制作
│   └── js/
│       └── contact-form.js # フロントエンドのフォーム処理
├── vercel.json             # Vercel設定
├── package.json            # Node.js依存関係
├── .env.local              # ローカル環境変数（Git管理外）
└── .gitignore
```

> **注意**: LPを編集する際は `AI×デザイン制作会社 LP.html` を編集し、
> 編集後に `index.html` に同じ内容をコピーすること。
> （`index.html` がVercelのエントリーポイントとなるため）

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | HTML / CSS / JavaScript（シングルファイル） |
| フォントライブラリ | Google Fonts（Zen Kaku Gothic New, Noto Sans JP, Shippori Mincho, Yomogi, Klee One, Caveat, DM Mono） |
| バックエンド | Node.js + Vercel Serverless Functions |
| データベース | MongoDB Atlas（Mongoose） |
| メール送信 | Gmail SMTP（nodemailer） |
| ホスティング | Vercel |
| バージョン管理 | GitHub |
| 主要依存パッケージ | express, mongoose, nodemailer, dotenv, cors |

---

## 環境変数

`.env.local`（ローカル開発用）および Vercel 環境変数に以下を設定する。

| 変数名 | 説明 |
|--------|------|
| `GMAIL_USER` | 送信元GmailアドレスおよびSMTP認証用ユーザー名 |
| `GMAIL_PASSWORD` | Gmailアプリパスワード（16文字、スペースなし） |
| `ADMIN_EMAIL` | お問い合わせ通知の受信先メールアドレス |
| `MONGODB_URI` | MongoDB Atlas接続文字列 |

---

## 各種設定手順

### 1. Gmail アプリパスワードの取得

通常のGmailパスワードはSMTP認証に使用できないため、アプリパスワードが必要。

1. [myaccount.google.com](https://myaccount.google.com) → **セキュリティ**
2. **2段階認証プロセス** を有効化
3. 検索欄で「アプリパスワード」と検索
4. アプリ名を入力して **作成**
5. 表示された16文字のパスワードをコピー（スペースを除いて使用）

### 2. MongoDB Atlas の設定

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) でアカウント作成
2. **クラスター作成** → M0 Free Tier を選択（東京リージョン推奨: `ap-northeast-1`）
3. **Database Access** → ユーザーとパスワードを作成
4. **Network Access** → **Allow Access from Anywhere**（`0.0.0.0/0`）を追加
   - VercelはリクエストごとにサーバーのIPが変わるため、全IP許可が必要
5. **Connect** → **Connect your application** → 接続文字列をコピー

接続文字列の形式:
```
mongodb+srv://<ユーザー名>:<パスワード>@<クラスター>.mongodb.net/?appName=Cluster0
```

### 3. GitHub リポジトリの作成とプッシュ

前提: GitHub CLI（`gh`）がインストール済みであること。

```powershell
# GitHub CLI インストール（未インストールの場合）
winget install --id GitHub.cli -e

# GitHubにログイン（ブラウザ認証）
gh auth login

# リポジトリ作成 & プッシュ（プロジェクトディレクトリ内で実行）
gh repo create <リポジトリ名> --public --description "<説明>" --source=. --remote=origin --push
```

> **セキュリティ注意**: プッシュ前に `.gitignore` に以下が含まれているか確認すること。
> - `.env.local`（認証情報）
> - `docs/`（セットアップ手順など機密情報を含む可能性があるドキュメント）
> - `node_modules/`

### 4. Vercel へのデプロイ

#### 初回セットアップ

```powershell
# Vercel CLI インストール
npm install -g vercel

# Vercelにログイン（ブラウザ認証）
vercel login

# 環境変数を登録（各変数ごとに実行）
"値" | vercel env add 変数名 production
"値" | vercel env add 変数名 development

# 本番デプロイ
vercel --prod --yes
```

#### 2回目以降のデプロイ

```powershell
vercel --prod --yes
```

#### vercel.json の必須設定

```json
{
  "buildCommand": "npm install",
  "outputDirectory": ".",
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

- `outputDirectory: "."` を必ず設定すること。設定しないとルートの `index.html` が配信されず404になる。
- `memory` の設定は Vercel の Active CPU billing では無視されるため不要。

#### Vercel 環境変数の追加・更新

```powershell
# 既存の変数を削除して再登録
vercel env rm 変数名 production --yes
"新しい値" | vercel env add 変数名 production
```

---

## デプロイ後の更新手順

LPの内容を変更した場合:

```powershell
# 1. AI×デザイン制作会社 LP.html を編集
# 2. index.html に同じ内容をコピー
Copy-Item "AI×デザイン制作会社 LP.html" "index.html"

# 3. Gitにコミット & プッシュ
git add index.html "AI×デザイン制作会社 LP.html"
git commit -m "変更内容の説明"

# GitHubへのプッシュ（gh認証トークンを使用）
$token = gh auth token
git push "https://<GitHubユーザー名>:${token}@github.com/<GitHubユーザー名>/<リポジトリ名>.git" master

# 4. Vercelへデプロイ
vercel --prod --yes
```

---

## セキュリティ注意事項

### Git管理から除外するもの

| ファイル/フォルダ | 理由 |
|-----------------|------|
| `.env.local` | Gmail・MongoDB等の認証情報を含む |
| `docs/` | セットアップ例に認証情報のサンプルが含まれる場合がある |
| `node_modules/` | 容量が大きく不要 |

### git履歴に認証情報が混入した場合の対処

```powershell
# git-filter-repo をインストール
pip install git-filter-repo

# 対象フォルダを履歴から完全削除
git-filter-repo --path <フォルダ名>/ --invert-paths --force

# リモートを再設定してforce push
git remote add origin <リポジトリURL>
$token = gh auth token
git push "https://<ユーザー名>:${token}@github.com/<ユーザー名>/<リポジトリ名>.git" master --force
```

### APIセキュリティ

- お問い合わせAPIは `POST /api/contact` のみ受け付け
- フォームバリデーションはフロントエンド（`contact-form.js`）とバックエンド（`validation.js`）の両方で実施

---

## よくあるトラブルと対処法

| 症状 | 原因 | 対処 |
|------|------|------|
| Vercelアクセスで404 | `index.html` がない、または `outputDirectory` 未設定 | `vercel.json` に `"outputDirectory": "."` を追加し、ルートに `index.html` を配置 |
| フォーム送信でタイムアウト | MongoDB Atlas のIP許可設定漏れ | Network Access で `0.0.0.0/0` を追加 |
| フォーム成功表示でもメールが届かない | メール送信を `await` せずにレスポンスを返している | `api/contact.js` でメール送信に `await` を追加 |
| Vercelデプロイ時に環境変数エラー | `vercel.json` が `@secret名` 形式を参照している | `vercel.json` の `env` ブロックを削除し、`vercel env add` で直接登録 |
| GitHubへのpushが応答しない | Git認証が対話型を要求している | `gh auth token` で取得したトークンをURLに埋め込んでpush |
| PowerShellで `gh` が見つからない | `gh` がPATHに登録されていない | フルパス `& "C:\Program Files\GitHub CLI\gh.exe" auth token` を使う |
| スライドショーのタイミングがバラバラ | `ease-in-out` が全体に掛かり、負のdelayと干渉する | `animation` を `linear` にして各コマ内でのみ `animation-timing-function` を指定する |

---

## ヒーローセクション スライドショーの仕様

ページ最上部のヒーローセクション右側に、4枚の実績画像がゆっくり切り替わるスライドショーを実装。

### 画像ファイル
`public/images/slide-01.jpg` 〜 `slide-04.jpg`（推奨: 800px幅以上・200KB以下）

### CSS アニメーション仕様
- **JS不使用**・純CSS crossfade
- 表示時間: **5秒**、フェードアウト: **2秒**（ease-in）
- サイクル: **28秒**（7秒×4枚）
- 枠: `mask-image` の楕円グラデーションで周囲をぼかし背景に溶け込む

```css
@keyframes heroFade {
  0%    { opacity: 1 }
  18%   { opacity: 1; animation-timing-function: ease-in }  /* 5秒表示 */
  25%   { opacity: 0 }                                       /* 2秒でフェードアウト */
  100%  { opacity: 0 }
}
/* 各スライドに linear・28s を指定し、負のdelayで順番にずらす */
/* nth-child(1): 0s / (2): -21s / (3): -14s / (4): -7s      */
```

> **重要**: `ease-in-out` をアニメーション全体に使うと、負のdelayと干渉してスライドごとにタイミングがバラバラになる。必ず `linear` を使い、イージングはキーフレーム内の `animation-timing-function` で指定すること。

### 画像の差し替え方法
`public/images/` 内の `slide-01.jpg` 〜 `slide-04.jpg` を上書き保存するだけ。HTML・CSSの変更は不要。
差し替え後は通常のデプロイ手順（下記）を実行する。

---

## デザイン上の注意点

### Contactセクション 見出しの `<em>` 色
背景がテラコッタ→グリーンのグラデーション（暗色）のため、デフォルトの `var(--terra-deep)`（緑）では文字が背景に埋もれる。
`var(--gold)`（#F4E89B）を上書き指定すること。

```css
.contact-section .h-display em { color: var(--gold); }
```

---

## お問い合わせフォームの動作フロー

```
ユーザー入力
    ↓
contact-form.js（フロントバリデーション）
    ↓
POST /api/contact
    ↓
validation.js（バックエンドバリデーション）
    ↓
MongoDB Atlas に保存（lib/db.js）
    ↓ await（重要：レスポンス前に完了させること）
Gmail SMTPでメール送信（lib/email.js）
  ├─ お客様への受付確認メール
  └─ 管理者への通知メール
    ↓
フロントエンドに成功レスポンスを返す
```
