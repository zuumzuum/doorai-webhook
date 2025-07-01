"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap, Clock, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "LINE・Webチャット即応",
    description: "お客様からの問い合わせに24時間AI が自動対応"
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "AI 紹介文生成",
    description: "物件の魅力を自動で分析し、売れる紹介文を生成"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "KPI ダッシュボード",
    description: "成約率・対応時間・顧客満足度をリアルタイム分析"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "14日間無料トライアル",
    description: "導入前にじっくり効果を確認いただけます"
  }
]

const includedFeatures = [
  "LINE・Webチャット自動対応",
  "AI物件紹介文生成（無制限）",
  "リアルタイム分析ダッシュボード",
  "顧客管理・追客機能",
  "成約率向上レポート",
  "24時間サポート対応",
  "セキュリティ保護・データバックアップ",
  "月次改善提案レポート"
]

export default function PricingPage() {
  return (
    <section className="container mx-auto py-16 px-4">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary px-4 py-2">
          月3万円で24h働くウルトラ営業マン
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          シンプルで透明な料金体系
      </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          複雑な料金プランはありません。すべての機能が含まれた単一プランで、すぐに始められます。
        </p>
      </div>

      {/* メインプライシングカード */}
      <div className="max-w-lg mx-auto mb-16">
        <Card className="relative overflow-hidden border-2 border-primary shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary/80"></div>
          
          <CardHeader className="text-center pt-8 pb-4">
            <Badge className="mb-4 bg-primary text-primary-foreground w-fit mx-auto px-3 py-1">
              おすすめ
                </Badge>
            <CardTitle className="text-3xl font-bold text-foreground">DoorAI Pro</CardTitle>
            <CardDescription className="text-base mt-2">
              不動産仲介業務を完全自動化
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-center justify-center">
                <span className="text-5xl font-bold text-primary">¥29,800</span>
                <span className="text-lg text-muted-foreground ml-2">/ 月</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">税込み・初期費用なし</p>
            </div>
            </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-foreground mb-3">含まれる機能：</h4>
              <div className="space-y-2">
                {includedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            </CardContent>

          <CardFooter className="px-6 pb-8">
            <div className="w-full space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold rounded-xl">
                14日間無料で試す
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                クレジットカード不要・いつでもキャンセル可能
              </p>
            </div>
            </CardFooter>
        </Card>
      </div>

      {/* 追加情報セクション */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">即日導入</h3>
          <p className="text-sm text-muted-foreground">
            複雑な設定は不要。お申し込み後すぐにご利用開始いただけます。
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">成約率UP</h3>
          <p className="text-sm text-muted-foreground">
            導入企業様平均で成約率30%向上を実現しています。
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">満足度98%</h3>
          <p className="text-sm text-muted-foreground">
            利用企業様から高い評価をいただいています。
          </p>
        </Card>
      </div>

      {/* FAQ セクション */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">よくあるご質問</h2>
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">導入にどのくらい時間がかかりますか？</h3>
            <p className="text-sm text-muted-foreground">
              お申し込み後、最短即日でご利用開始いただけます。LINEとの連携設定も弊社でサポートいたします。
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">トライアル期間中に解約した場合、料金はかかりますか？</h3>
            <p className="text-sm text-muted-foreground">
              14日間の無料トライアル期間中は一切料金はかかりません。期間内に解約いただければ費用は発生しません。
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">既存のシステムとの連携は可能ですか？</h3>
            <p className="text-sm text-muted-foreground">
              主要な不動産管理システムとのAPI連携に対応しています。詳細はお気軽にお問い合わせください。
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}