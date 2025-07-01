'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Bot, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import { login, signup, signInWithGoogle } from '@/actions/auth-actions';
import Link from 'next/link';

interface LoginFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

function LoginForm({ isSignUp, setIsSignUp }: LoginFormProps) {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  
  const error = searchParams.get('error') ? decodeURIComponent(searchParams.get('error')!) : null;
  const message = searchParams.get('message') ? decodeURIComponent(searchParams.get('message')!) : null;

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {/* Error/Success Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Auth Form */}
      <form action={isSignUp ? signup : login} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            メールアドレス
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@company.com"
              className="pl-10 h-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            パスワード
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="パスワードを入力"
              className="pl-10 pr-10 h-11"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isSignUp && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              パスワードを忘れた方
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isSignUp ? 'アカウントを作成' : 'ログイン'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">または</span>
        </div>
      </div>

      {/* Google Sign In */}
      <form action={signInWithGoogle}>
        <Button
          type="submit"
          variant="outline"
          className="w-full h-11 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Googleでログイン
        </Button>
      </form>

      <Separator className="my-4" />

      {/* Toggle between login/signup */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isSignUp ? '既にアカウントをお持ちですか？' : 'アカウントをお持ちでない方は'}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </p>
      </div>
    </>
  );
    }

export default function LoginPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ハイドレーション完了後にマウント状態を更新
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント前は何も表示しない（ハイドレーションエラーを回避）
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        {/* テーマボタンはマウント後に表示 */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 dark:bg-gray-800/80 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-lg opacity-0"
            disabled
          >
            <Sun className="w-4 h-4 text-yellow-500" />
          </Button>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DoorAI
              </h1>
              <p className="text-muted-foreground mt-2">
                読み込み中...
              </p>
            </div>
          </div>

          {/* Loading Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center">
                読み込み中...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 dark:bg-gray-800/80 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-lg"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DoorAI
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'アカウントを作成' : 'アカウントにログイン'}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">
              {isSignUp ? '新規登録' : 'ログイン'}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {isSignUp 
                ? 'DoorAIを始めるためにアカウントを作成してください' 
                : 'メールアドレスとパスワードを入力してください'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<div>読み込み中...</div>}>
              <LoginForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>© 2024 DoorAI</span>
          </div>
        </div>
      </div>
    </div>
  );
}