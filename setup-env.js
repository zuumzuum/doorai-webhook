#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 DoorAI Supabase環境変数を設定中...');

// Supabase設定値
const SUPABASE_URL = 'https://yehltecyjtmnbwbfsbfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaGx0ZWN5anRtbmJ3YmZzYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDI4NjksImV4cCI6MjA2NjQxODg2OX0.td5yCYBx880_U5tkDw-TNyfxW2Lkv409f7nxkVWo1xc';

// .env.localファイルの内容
const envContent = `# DoorAI Supabase設定
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# 開発環境設定
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

// .env.localファイルを作成
try {
    const envPath = path.join(__dirname, '.env.local');
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log('✅ .env.localファイルが正常に作成されました！');
    console.log(`📍 場所: ${envPath}`);
    
    // ファイルの内容を確認
    console.log('\n📄 作成された内容:');
    console.log(envContent);
    
    console.log('🎉 環境変数の設定が完了しました！');
    console.log('');
    console.log('📋 次の手順:');
    console.log('1. 開発サーバーを再起動: npm run dev');
    console.log('2. 新規ユーザー登録でテナント自動作成を確認');
    console.log('3. LINE API設定は各テナントの設定画面で実施');
} catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
} 