# Tsumugu - AI × Design Studio

高品質なデザイン制作を、AIの速さで実現。神戸市北区の夫婦チーム。

## 🚀 プロジェクト構成

### Phase 1 ✅ 完成
- フロントエンド改善（タイポグラフィー、ボタンエフェクト）
- 写真統合（アニメキャラクター画像のAboutセクション組み込み）
- SEO 対策（OG タグ、Twitter Card、JSON-LD 構造化データ）
- モバイルレスポンシブ対応
- ドキュメント整備（DESIGN.md, SEO.md, IMAGE-OPTIMIZATION.md）

### Phase 2 🎉 実装完了
- バックエンド API（Node.js + Express）
- 問い合わせフォーム機能（HTML + JavaScript）
- Gmail SMTP メール送信（nodemailer）
- MongoDB データベース（無料 Atlas）
- Vercel サーバーレスデプロイ
- 包括的なドキュメント

## 📁 ディレクトリ構成

```
lp-project/
├── AI×デザイン制作会社 LP.html      (メインランディングページ)
├── public/
│   └── js/
│       └── contact-form.js           (フロントエンド フォーム機能)
├── api/
│   └── contact.js                    (Vercel Serverless API エンドポイント)
├── lib/
│   ├── db.js                         (MongoDB 接続と Contact スキーマ)
│   ├── email.js                      (nodemailer Gmail SMTP 設定)
│   └── validation.js                 (フォーム検証ユーティリティ)
├── docs/
│   ├── DESIGN.md                     (デザイン決定事項)
│   ├── SEO.md                        (SEO 対策チェックリスト)
│   ├── IMAGE-OPTIMIZATION.md         (画像最適化ガイド)
│   ├── BACKEND_SETUP.md              (バックエンドセットアップガイド)
│   ├── API.md                        (API ドキュメント)
│   ├── VERCEL-DEPLOYMENT.md          (Vercel デプロイガイド)
│   └── superpowers/plans/            (実装計画)
├── package.json                      (Node.js 依存関係)
├── vercel.json                       (Vercel 設定)
├── .env.example                      (環境変数テンプレート)
├── .env.local                        (ローカル環境変数 - git 除外)
├── .gitignore                        (Git 除外リスト)
├── .vercelignore                     (Vercel デプロイ除外)
├── README.md                         (このファイル)
└── .git                              (Git リポジトリ)
```

## 🛠️ 必要なもの

### 開発環境
- Node.js v16.x 以上
- npm v7.x 以上
- Git

### 本番環境
- MongoDB Atlas アカウント（無料クラスタ）
- Gmail アカウント（App Password 設定）
- Vercel アカウント（無料プランで十分）

## 🚀 クイックスタート

### 1. リポジトリをクローン

```bash
cd C:\Users\po-st\Desktop\lp-project
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

```bash
# .env.local ファイルを作成
cp .env.example .env.local
```

.env.local を編集して以下を入力:
- MONGODB_URI: MongoDB Atlas 接続文字列
- GMAIL_USER: Gmail メールアドレス
- GMAIL_PASSWORD: Gmail App Password (16文字)
- ADMIN_EMAIL: 管理者メールアドレス

### 4. ローカル開発サーバーを起動（オプション）

```bash
vercel dev
```

http://localhost:3000 でアクセス可能

## 📚 ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| **DESIGN.md** | カラースキーム、フォント、レスポンシブブレークポイント |
| **SEO.md** | 実装済みのメタタグと構造化データ |
| **IMAGE-OPTIMIZATION.md** | 画像形式と圧縮推奨事項 |
| **API.md** | /api/contact エンドポイント仕様 |
| **BACKEND_SETUP.md** | MongoDB と Gmail のセットアップ |
| **VERCEL-DEPLOYMENT.md** | Vercel へのデプロイ手順 |

## 🚀 デプロイ

### ローカルでテスト

1. .env.local で実際の認証情報を設定
2. `vercel dev` でローカルサーバー起動
3. Contact フォームをテスト
4. MongoDB に データが保存されることを確認
5. メール受信を確認

### Vercel へデプロイ

```bash
# Vercel CLI をインストール
npm install -g vercel

# Vercel に ログイン
vercel login

# プロジェクトをリンク
vercel link

# 環境変数を設定
vercel env add MONGODB_URI
vercel env add GMAIL_USER
vercel env add GMAIL_PASSWORD
vercel env add ADMIN_EMAIL

# 本番環境にデプロイ
vercel deploy --prod
```

詳細は [VERCEL-DEPLOYMENT.md](docs/VERCEL-DEPLOYMENT.md) を参照

## 📞 お問い合わせ フォーム API

### エンドポイント

**POST** `/api/contact`

### リクエスト例

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '山田 太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    message: 'お問い合わせ内容です'
  })
});

const result = await response.json();
```

### レスポンス

**成功 (200 OK):**
```json
{
  "success": true,
  "message": "お問い合わせを受け付けました。",
  "contactId": "507f1f77bcf86cd799439011"
}
```

**エラー (400):**
```json
{
  "success": false,
  "errors": {
    "name": "名前を入力してください",
    "email": "有効なメールアドレスを入力してください"
  }
}
```

詳細は [API.md](docs/API.md) を参照

## 🔒 セキュリティ

- **環境変数**: .env.local は .gitignore に含まれており、git にコミットされません
- **データベース**: MongoDB Atlas の IP Whitelist で保護
- **メール認証**: Gmail App Password（通常パスワードではない）
- **HTTPS**: Vercel で自動的に有効化
- **CORS**: フロントエンドオリジンで制限可能（本番環境で設定推奨）

## 📊 データベース

### Contact コレクション

```javascript
{
  _id: ObjectId,
  name: String,          // 必須、最大100文字
  email: String,         // 必須、メール形式
  phone: String,         // オプション、最大20文字
  message: String,       // 必須、最大5000文字
  status: String,        // 'new', 'read', 'replied'（初期値: 'new'）
  createdAt: Date        // タイムスタンプ
}
```

## 📧 メール

### ユーザー宛確認メール

- **件名**: ✓ お問い合わせを受け付けました｜Tsumugu
- **内容**: 送信内容の確認、ブランディング

### 管理者宛通知メール

- **件名**: [新規お問い合わせ] {名前} 様から
- **内容**: お問い合わせ全情報（名前、メール、電話、メッセージ、日時）

## 🔄 ワークフロー

1. ユーザーがフォームに入力
2. JavaScript で フォームデータを取得
3. /api/contact へ POST リクエスト
4. バックエンド：
   - フォーム検証（name, email, phone, message）
   - MongoDB へ データ保存
   - 非同期でメール送信（2件）
   - レスポンス返却
5. フロントエンド：
   - 成功メッセージ表示 / エラー表示
   - フォームリセット

## 🎯 次フェーズ（今後の拡張）

### Phase 3: Admin Dashboard
- [ ] お問い合わせ管理画面
- [ ] メッセージの読み取り・返信
- [ ] ステータス管理（new/read/replied）

### Phase 4: セキュリティ強化
- [ ] レート制限（防スパム）
- [ ] Google reCAPTCHA 導入
- [ ] CORS ドメイン制限
- [ ] API キー認証

### Phase 5: 分析・統合
- [ ] Google Analytics 統合
- [ ] Slack 通知
- [ ] メール配信自動化

## 📝 コントリビューション

新機能追加時:
1. 新しいブランチを作成: `git checkout -b feature/新機能`
2. コードを実装
3. テストを実行
4. PR を作成

## 📄 ライセンス

MIT License - 自由に使用、修正、配布できます

## 🔗 リンク

- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [nodemailer](https://nodemailer.com/)
- [Express.js](https://expressjs.com/)

## 📞 サポート

問題が発生した場合:
1. [API.md](docs/API.md) でエンドポイント情報を確認
2. [BACKEND_SETUP.md](docs/BACKEND_SETUP.md) でセットアップ確認
3. [VERCEL-DEPLOYMENT.md](docs/VERCEL-DEPLOYMENT.md) でデプロイ確認

---

**プロジェクト情報**
- 作成: 2026-04-29 (Phase 1)
- 更新: 2026-04-30 (Phase 2 完成)
- 開発者: Claude Code + Tsumugu Team

created with ❤️ using Claude Code
