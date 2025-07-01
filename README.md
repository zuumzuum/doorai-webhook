# DoorAI - 不動産仲介業向けSaaS

## 概要

DoorAIは不動産仲介業向けのAI営業自動化SaaSです。LINEとWebチャットでの24時間自動応答、物件管理、顧客管理、KPIダッシュボードを提供します。

## 主な機能

- 🤖 **LINE自動応答**: GPT-4o搭載のAI営業担当者
- 💬 **Webチャット**: ウェブサイト埋め込み型チャットウィジェット
- 🏠 **物件管理**: 物件登録・編集・AI紹介文生成
- 👥 **顧客管理**: 顧客データ・HotScore自動計算
- 📊 **KPIダッシュボード**: リアルタイム分析・レポート機能
- 📅 **内見予約**: Google Calendar連携

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Chat**: LINE Messaging API
- **認証**: Supabase Auth
- **決済**: Stripe (予定)

## 環境設定

### 1. 必要な環境変数

`.env.local`ファイルを作成し、以下の値を設定してください：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# LINE Bot (重要: LINE自動応答機能用)
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret

# OpenAI (重要: AI自動応答機能用)
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. LINE Developers設定

#### 2.1 LINEアカウント作成・チャンネル作成

1. [LINE Developers](https://developers.line.biz/)にアクセス
2. LINEアカウントでログイン
3. 新しいプロバイダーを作成（会社名など）
4. **Messaging API**チャンネルを作成

#### 2.2 チャンネル設定

1. **チャンネル基本設定**タブ：
   - チャンネルID、チャンネルシークレットをコピー
   - `LINE_CHANNEL_SECRET`に設定

2. **Messaging API設定**タブ：
   - チャンネルアクセストークン（長期）を発行
   - `LINE_CHANNEL_ACCESS_TOKEN`に設定
   - **Webhook URLを設定**（重要）:
     ```
     https://yourdomain.com/api/webhooks/line
     ```
   - Webhook送信を「利用する」に設定
   - 応答メッセージを「利用しない」に設定（AIで自動応答するため）
   - あいさつメッセージを「利用しない」に設定

#### 2.3 必要なイベント設定

以下のイベントが自動的に処理されます：
- **メッセージイベント**: テキストメッセージの自動応答
- **ポストバックイベント**: ボタンアクション
- **フォローイベント**: 友だち追加時の顧客登録
- **アンフォローイベント**: ブロック検知

### 3. OpenAI設定

1. [OpenAI Platform](https://platform.openai.com/)でアカウント作成
2. API キーを生成
3. `OPENAI_API_KEY`に設定
4. GPT-4o（またはGPT-4）のAPIアクセス権限を確認

### 4. Webhook URL

デプロイ後、以下のWebhook URLをLINE Developersに設定：

```
https://yourdomain.com/api/webhooks/line
```

**ローカル開発時**は、ngrokなどのトンネリングツールを使用：

```bash
# ngrokのインストール（初回のみ）
npm install -g ngrok

# ローカルサーバーを起動
npm run dev

# 別ターミナルでngrokを起動
ngrok http 3000

# ngrokのHTTPS URLをLINE Webhookに設定
# 例: https://abc123.ngrok.io/api/webhooks/line
```

## Google OAuth設定

### 1. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成または選択
3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
4. Application type: Web application
5. Authorized redirect URIs:
   ```
   https://yehltecyjtmnbwbfsbfw.supabase.co/auth/v1/callback
   ```
6. Client IDとClient Secretをコピー

### 2. Supabase設定

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクト → Authentication → Providers → Google
3. Enable Google provider を ON
4. Google Cloud ConsoleからコピーしたClient IDとClient Secretを入力
5. 保存

### 3. リダイレクトURL設定確認

**開発環境**:
- Authorized redirect URIs: `https://yehltecyjtmnbwbfsbfw.supabase.co/auth/v1/callback`
- Site URL: `http://localhost:3000`

**本番環境**:
- Authorized redirect URIs: `https://yehltecyjtmnbwbfsbfw.supabase.co/auth/v1/callback`
- Site URL: `https://doorai-h63zhawem-zuums-projects.vercel.app`

## LINE API設定

## 開発手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseマイグレーション実行

```bash
# Supabaseプロジェクトのリンク
npx supabase link --project-ref your-project-ref

# マイグレーション実行
npx supabase db push
```

### 3. 開発サーバー起動

```bash
npm run dev
```

### 4. LINE Bot テスト

1. LINE Developersでテストチャンネルを作成
2. QRコードで友だち追加
3. メッセージを送信してAI応答をテスト

## API エンドポイント

### LINE Webhook

- **URL**: `/api/webhooks/line`
- **Method**: POST
- **用途**: LINEからのメッセージ・イベント受信

### 主要機能

#### 1. AI自動応答システム

- **GPT-4o**による不動産専門の営業AI
- 顧客の過去の履歴を考慮した回答
- 物件検索・内見予約・資料請求の自動誘導
- 24時間365日対応

#### 2. 顧客自動管理

- LINE友だち追加時の自動顧客登録
- メッセージ履歴の自動保存
- HotScore（興味度）の自動計算
- 顧客情報の自動抽出（予算・希望エリア等）

#### 3. 物件検索・提案

- 顧客の条件に合った物件の自動検索
- LINEカルーセル形式での物件紹介
- 内見予約ボタンによる即座の予約受付

## エラー対応

### よくある問題

1. **LINE Webhookエラー**:
   - Webhook URLが正しく設定されているか確認
   - HTTPS必須（ローカル開発時はngrok使用）
   - チャンネルシークレットが正しく設定されているか確認

2. **AI応答しない**:
   - OpenAI API キーが正しく設定されているか確認
   - OpenAI APIの利用制限・残高を確認
   - Supabaseデータベース接続を確認

3. **顧客データが保存されない**:
   - Supabase接続設定を確認
   - RLS（Row Level Security）ポリシーを確認
   - データベースマイグレーションが完了しているか確認

## ライセンス

MIT License
