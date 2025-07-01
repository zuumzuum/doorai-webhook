# 🏠 DoorAI - 不動産営業自動化SaaS

DoorAIは不動産業界向けのLINE Bot自動化プラットフォームです。顧客からの問い合わせに自動で応答し、物件情報の提供や営業プロセスを効率化します。

## ✨ 主な機能

### 🤖 LINE Bot自動応答
- **挨拶対応**: 「こんにちは」「hello」などの挨拶メッセージに自動返信
- **物件相談**: 「物件」「賃貸」などのキーワードで物件提案を自動送信
- **感謝応答**: 「ありがとう」メッセージに適切な返信
- **汎用対応**: その他の質問に受信確認と相談案内を自動送信

### 🏢 マルチテナント対応
- **独立運用**: 各不動産会社が独自のLINE Botを運用可能
- **動的設定**: テナント毎にChannel Secret、Access Tokenを個別設定
- **スケーラブル**: 新規テナント追加時のデプロイ不要

### 📊 顧客管理
- **会話履歴**: LINEでの全てのやり取りをデータベースに保存
- **ユーザー管理**: LINEユーザー情報の自動収集・管理
- **分析機能**: 顧客との対話データの分析・可視化

### 🔐 セキュリティ
- **署名検証**: LINE Webhookの署名を必ず検証
- **RLS対応**: Supabaseでのテナント間データ分離
- **環境変数**: 機密情報の安全な管理

## 🛠 技術スタック

### フロントエンド
- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: スタイリング
- **Radix UI**: UIコンポーネント

### バックエンド
- **Next.js API Routes**: サーバーサイドAPI
- **LINE Bot SDK 10.0.0**: LINE Messaging API
- **Supabase**: データベース・認証

### インフラ
- **Vercel**: ホスティング・デプロイ
- **Supabase**: PostgreSQL データベース
- **GitHub**: バージョン管理

## 🚀 セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/zuumzuum/doorai-webhook.git
cd doorai-webhook
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
# .env.localファイルを作成
cp .env.example .env.local
```

以下の環境変数を設定：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# その他
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 📋 LINE Bot設定

### 1. LINE Developersコンソール
1. [LINE Developers](https://developers.line.biz/)にログイン
2. 新しいProviderとMessaging API Channelを作成
3. Channel SecretとChannel Access Tokenを取得

### 2. Webhook URL設定
DoorAIでは以下の形式でWebhook URLを設定：
```
https://your-domain.vercel.app/api/webhooks/line?tenantId={YOUR_TENANT_ID}
```

### 3. 応答設定
LINE公式アカウントの管理画面で：
- あいさつメッセージ: **オフ**
- 応答時間: **オフ** 
- 応答状況表示: **表示しない**

## 🗂 プロジェクト構造

```
doorai-webhook/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── webhooks/        # LINE Webhook handlers
│   │   ├── settings/        # 設定管理API
│   │   └── tenant/          # テナント管理API
│   ├── dashboard/           # ダッシュボードページ
│   ├── login/               # ログイン・認証
│   └── layout.tsx           # レイアウト
├── components/              # Reactコンポーネント
│   ├── ui/                  # UI基底コンポーネント
│   ├── dashboard.tsx        # ダッシュボード
│   ├── settings.tsx         # 設定画面
│   └── customer-management.tsx
├── lib/                     # ユーティリティ・設定
│   ├── supabase/           # Supabase設定
│   ├── line/               # LINE Bot関連
│   ├── db/                 # データベース操作
│   └── auth/               # 認証関連
├── actions/                 # Server Actions
├── hooks/                   # カスタムフック
└── middleware.ts            # Next.js Middleware
```

## 📊 データベース設計

### 主要テーブル
- **tenants**: テナント（不動産会社）情報
- **tenant_users**: テナント・ユーザー関係
- **line_users**: LINEユーザー情報
- **conversations**: 会話履歴
- **customers**: 顧客情報
- **properties**: 物件情報

## 🔧 API エンドポイント

### LINE Webhook
- `POST /api/webhooks/line?tenantId={id}` - LINE Webhook受信

### 設定管理
- `GET /api/settings/line?tenantId={id}` - LINE設定取得
- `POST /api/settings/line` - LINE設定更新

### テナント管理
- `GET /api/tenant/current` - 現在のテナント情報取得

## 🧪 テスト・デバッグ

### デバッグエンドポイント
- `GET /api/debug/line` - LINE設定診断
- `GET /api/test/line-debug` - LINE Bot動作テスト

### ログ確認
```bash
# Vercelでのログ確認
vercel logs
```

## 🚀 デプロイ

### Vercelへのデプロイ
1. Vercelアカウントでリポジトリを接続
2. 環境変数を設定
3. 自動デプロイが実行される

### 環境変数（本番）
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で配布されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🆘 サポート

問題が発生した場合：
1. [Issues](https://github.com/zuumzuum/doorai-webhook/issues)で既存の問題を確認
2. 新しいIssueを作成して詳細を記載
3. [Discussions](https://github.com/zuumzuum/doorai-webhook/discussions)で質問・議論

## 📞 お問い合わせ

- 開発者: [@zuumzuum](https://github.com/zuumzuum)
- プロジェクトリンク: [https://github.com/zuumzuum/doorai-webhook](https://github.com/zuumzuum/doorai-webhook)

---

⭐ このプロジェクトが役に立ったら、ぜひスターを付けてください！
