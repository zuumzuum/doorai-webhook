# DoorAI Supabase環境変数自動設定スクリプト
Write-Host "🚀 DoorAI Supabase環境変数を設定中..." -ForegroundColor Green

# Supabase設定値
$SUPABASE_URL = "https://yehltecyjtmnbwbfsbfw.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaGx0ZWN5anRtbmJ3YmZzYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDI4NjksImV4cCI6MjA2NjQxODg2OX0.td5yCYBx880_U5tkDw-TNyfxW2Lkv409f7nxkVWo1xc"

# .env.localファイルの内容
$envContent = @"
# DoorAI Supabase設定
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# 開発環境設定
NODE_ENV=development
"@

# .env.localファイルを作成
try {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ .env.localファイルが正常に作成されました！" -ForegroundColor Green
    Write-Host "📍 場所: $(Get-Location)\.env.local" -ForegroundColor Yellow
    
    # ファイルの内容を確認
    Write-Host "`n📄 作成された内容:" -ForegroundColor Cyan
    Get-Content ".env.local" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    
    Write-Host "`n🎉 環境変数の設定が完了しました！" -ForegroundColor Green
    Write-Host "💡 開発サーバーを再起動してください: npm run dev" -ForegroundColor Yellow
}
catch {
    Write-Host "❌ エラーが発生しました: $($_.Exception.Message)" -ForegroundColor Red
} 