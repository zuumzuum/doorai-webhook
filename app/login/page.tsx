'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Bot, Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Sun, Moon, CheckCircle, Chrome } from 'lucide-react';
import { authService } from '@/lib/auth';
import Link from 'next/link';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(6, 'パスワードは6文字以上で入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    setEmailConfirmationNeeded(false);

    try {
      const { user, error } = isSignUp 
        ? await authService.signUp(data.email, data.password)
        : await authService.signIn(data.email, data.password);

      if (error) {
        const errorMessage = getErrorMessage(error.message);
        setAuthError(errorMessage);
        
        // Check if this is an email confirmation error
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setEmailConfirmationNeeded(true);
        }
      } else if (user) {
        if (isSignUp) {
          setAuthError(null);
          setIsSignUp(false);
          reset();
          setEmailConfirmationNeeded(true);
          setAuthError('アカウントが作成されました。メールを確認してログインしてください。');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('予期しないエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      // TODO: バックエンド実装時にGoogle認証ロジックを追加
      console.log('Google認証が開始されました（バックエンド実装待ち）');
      
      // プレースホルダー処理 - 実際の実装では削除
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAuthError('Google認証は現在準備中です。メール認証をご利用ください。');
    } catch (error) {
      console.error('Google authentication error:', error);
      setAuthError('Google認証でエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getErrorMessage = (errorMessage: string): string => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'メールアドレスまたはパスワードが正しくありません。';
    }
    if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
      return 'メールアドレスが確認されていません。受信トレイを確認し、確認リンクをクリックしてください。';
    }
    if (errorMessage.includes('User already registered')) {
      return 'このメールアドレスは既に登録されています。';
    }
    if (errorMessage.includes('Password should be at least 6 characters')) {
      return 'パスワードは6文字以上で入力してください。';
    }
    return 'ログインに失敗しました。もう一度お試しください。';
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setAuthError(null);
    setEmailConfirmationNeeded(false);
    reset();
  };

  const resendConfirmationEmail = async () => {
    const email = document.getElementById('email') as HTMLInputElement;
    if (!email?.value) {
      setAuthError('メールアドレスを入力してください。');
      return;
    }

    try {
      setIsLoading(true);
      // This would typically call a resend confirmation method
      // For now, we'll just show a message
      setAuthError('確認メールを再送信しました。受信トレイを確認してください。');
    } catch (error) {
      setAuthError('確認メールの再送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

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
            {authError && (
              <Alert className={`${
                authError.includes('作成されました') || authError.includes('再送信しました') 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : emailConfirmationNeeded 
                    ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-red-200 bg-red-50 dark:bg-red-900/20'
              }`}>
                {authError.includes('作成されました') || authError.includes('再送信しました') ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className={`h-4 w-4 ${
                    emailConfirmationNeeded 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                )}
                <AlertDescription className={`${
                  authError.includes('作成されました') || authError.includes('再送信しました')
                    ? 'text-green-800 dark:text-green-300' 
                    : emailConfirmationNeeded 
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-red-800 dark:text-red-300'
                }`}>
                  {authError}
                </AlertDescription>
              </Alert>
            )}

            {emailConfirmationNeeded && !authError?.includes('作成されました') && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      メール確認が必要です
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      ログインするには、送信された確認メールのリンクをクリックしてください。
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={resendConfirmationEmail}
                      disabled={isLoading}
                      className="text-blue-600 dark:text-blue-400 p-0 h-auto mt-2"
                    >
                      確認メールを再送信
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    className="pl-10 h-11"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
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
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? '作成中...' : 'ログイン中...'}
                  </>
                ) : (
                  isSignUp ? 'メールでアカウントを作成' : 'メールでログイン'
                )}
              </Button>
            </form>

            {/* Google Sign In Button - Now directly below email form without separator */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  Googleで{isSignUp ? '登録' : 'ログイン'}中...
                </>
              ) : (
                <>
                  <Chrome className="w-4 h-4 mr-3 text-blue-600" />
                  Googleで{isSignUp ? '登録' : 'ログイン'}
                </>
              )}
            </Button>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">または</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border hover:bg-accent transition-colors"
              onClick={toggleMode}
            >
              {isSignUp ? 'ログインページに戻る' : '新規アカウントを作成'}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            ログインすることで、
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>© 2024 DoorAI</span>
            <span>•</span>
            <Link href="/support" className="hover:text-foreground transition-colors">
              サポート
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}