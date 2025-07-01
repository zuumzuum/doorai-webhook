import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // エラーパラメータもチェック
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorMessage = encodeURIComponent(`認証に失敗しました: ${errorDescription || error}`)
    return redirect(`${origin}/login?error=${errorMessage}`)
  }

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Code exchange error:', error)
      const errorMessage = encodeURIComponent('認証の処理中にエラーが発生しました')
      return redirect(`${origin}/login?error=${errorMessage}`)
    }
    
    // 認証成功時はダッシュボードにリダイレクト
    return redirect(`${origin}/dashboard`)
  }

  // codeパラメータがない場合
  const errorMessage = encodeURIComponent('認証パラメータが不正です')
  return redirect(`${origin}/login?error=${errorMessage}`)
} 