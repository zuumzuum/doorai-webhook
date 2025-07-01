#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 DoorAI + LINE Bot 環境変数を再設定中...');

// LINE Bot設定値
const LINE_CHANNEL_SECRET = '4620f318c0ffdaeb8622611bab4ca96b';
const LINE_CHANNEL_ACCESS_TOKEN = '68teBvOrFpvuXKGFTCXrBZONl3yNCQs1tuzyYV9F17CJGcEFpTTmNMYjqsbCN5Q7u2ryWn2SCX2w/D8c4A+CFd2Gnr32gm45n98Zb5izzyW0Yqdp4Jc1ZuTvSuGNfQuiTgucwWJ2nzoehr97dlO41wdB04t89/1O/w1cDnyilFU=';

// Supabase設定値
const SUPABASE_URL = 'https://yehltecyjtmnbwbfsbfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaGx0ZWN5anRtbmJ3YmZzYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDI4NjksImV4cCI6MjA2NjQxODg2OX0.td5yCYBx880_U5tkDw-TNyfxW2Lkv409f7nxkVWo1xc';

// .env.localファイルの内容
const envContent = `# DoorAI Supabase設定
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# 開発環境設定
NODE_ENV=development

# LINE Bot設定（本番用）
LINE_CHANNEL_SECRET=${LINE_CHANNEL_SECRET}
LINE_CHANNEL_ACCESS_TOKEN=${LINE_CHANNEL_ACCESS_TOKEN}

# OpenAI設定（後で追加）
OPENAI_API_KEY=your_openai_api_key_here

# Vercel環境変数用（重要）
VERCEL_ENV=production
`;

try {
  // .env.localファイルを作成
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local ファイルが作成されました');

  // 環境変数の確認
  console.log('\n📋 設定された環境変数:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
  console.log('- LINE_CHANNEL_SECRET:', LINE_CHANNEL_SECRET);
  console.log('- LINE_CHANNEL_ACCESS_TOKEN:', LINE_CHANNEL_ACCESS_TOKEN ? '設定済み' : '未設定');

  console.log('\n🚀 次の手順:');
  console.log('1. Vercelに環境変数を手動で設定');
  console.log('2. プロジェクトを再デプロイ');
  console.log('3. LINE Webhook を再テスト');

  // Vercel用の環境変数設定コマンドを表示
  console.log('\n📝 Vercel環境変数設定コマンド:');
  console.log(`vercel env add LINE_CHANNEL_SECRET`);
  console.log(`vercel env add LINE_CHANNEL_ACCESS_TOKEN`);
  console.log(`vercel env add NEXT_PUBLIC_SUPABASE_URL`);
  console.log(`vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY`);

} catch (error) {
  console.error('❌ 環境変数設定中にエラーが発生しました:', error);
  process.exit(1);
} 