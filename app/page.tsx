import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ユーザーがログインしている場合はダッシュボードにリダイレクト
  if (user) {
    redirect('/dashboard');
  }

  // ユーザーがログインしていない場合はログインページにリダイレクト
  redirect('/login');
}