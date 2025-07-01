'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
    const errorMessage = encodeURIComponent('ログインに失敗しました')
    redirect(`/login?error=${errorMessage}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Attempting signup for:', data.email);

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error)
    const errorMessage = encodeURIComponent(`サインアップに失敗しました: ${error.message}`)
    redirect(`/login?error=${errorMessage}`)
  }

  console.log('Signup successful, user created:', authData.user?.id);

  // ユーザーが正常に作成された場合、テナントも作成する
  if (authData.user) {
    try {
      // デフォルトテナント名（会社名）を作成
      const companyName = data.email.split('@')[1].split('.')[0] + '不動産';
      
      // テナントを作成
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: companyName,
          domain: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.doorai.com`,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
      } else if (tenantData) {
        // ユーザーをテナントに関連付け（オーナーとして）
        const { error: userTenantError } = await supabase
          .from('tenant_users')
          .insert({
            tenant_id: tenantData.id,
            user_id: authData.user.id,
            role: 'owner',
          });

        if (userTenantError) {
          console.error('User-tenant relation error:', userTenantError);
        }

        // ユーザーのメタデータにテナントIDを設定（Service Roleが必要）
        try {
          const { createClient } = await import('@/lib/supabase/server');
          const adminSupabase = await createClient();
          
          const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
            authData.user.id,
            {
              app_metadata: { tenant_id: tenantData.id }
            }
          );

          if (updateError) {
            console.error('User metadata update error:', updateError);
          }
        } catch (metadataError) {
          console.error('Metadata update failed:', metadataError);
        }
      }
    } catch (tenantCreationError) {
      console.error('Error creating tenant for new user:', tenantCreationError);
    }
  }

  revalidatePath('/', 'layout')
  const successMessage = encodeURIComponent('確認メールを送信しました')
  redirect(`/login?message=${successMessage}`)
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    const errorMessage = encodeURIComponent('ログアウトに失敗しました')
    redirect(`/login?error=${errorMessage}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
  }

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    const errorMessage = encodeURIComponent('パスワードリセットメールの送信に失敗しました')
    redirect(`/forgot-password?error=${errorMessage}`)
  }

  const successMessage = encodeURIComponent('パスワードリセットメールを送信しました')
  redirect(`/forgot-password?message=${successMessage}`)
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google sign in error:', error)
    const errorMessage = encodeURIComponent('Googleでのログインに失敗しました')
    redirect(`/login?error=${errorMessage}`)
  }

  if (data.url) {
    redirect(data.url)
  }
} 