'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from 'lucide-react';
import { login, signup, signInWithGoogle } from '@/actions/auth-actions';
import Link from 'next/link';

export function LoginClient() {
  const { theme, setTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {/* Theme Toggle - クライアントサイドでのみ必要 */}
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

      <div className="relative my-4">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground">または</span>
        </div>
      </div>

      {/* Google Sign In */}
      <form action={signInWithGoogle} className="w-full">
        <Button
          type="submit"
          variant="outline"
          className="w-full h-11 font-medium transition-all duration-200 hover:bg-accent border-border/50"
        >
          {/* Googleアイコン */}
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Googleで{isSignUp ? '登録' : 'ログイン'}
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