"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

type Plan = {
  name: string
  price: string
  tagline?: string
  popular?: boolean
  features: string[]
  cta: string
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "¥29,800 / 月",
    features: [
      "LINE / Web チャット即応",
      "AI紹介文生成 100件 / 月",
      "KPI ダッシュボード",
      "14日間トライアル"
    ],
    cta: "今すぐ始める"
  },
  {
    name: "Pro",
    price: "¥49,800 / 月",
    tagline: "人気",
    popular: true,
    features: [
      "Starter の全機能",
      "Instagram DM 対応",
      "紹介文生成 無制限",
      "多店舗 3 まで"
    ],
    cta: "今すぐ始める"
  },
  {
    name: "Enterprise",
    price: "お見積り",
    features: [
      "Pro の全機能",
      "店舗数無制限 / API連携",
      "専属 CS & 導入研修",
      "SLA & データ移行支援"
    ],
    cta: "営業に相談"
  }
]

export default function PricingPage() {
  return (
    <section className="container mx-auto py-12">
      <h1 className="text-4xl font-semibold text-center mb-10 text-primary">
        AIエージェントで業務効率化
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-2xl shadow-md flex flex-col ${
              plan.popular ? "border-2 border-primary" : ""
            }`}
          >
            <CardHeader className="text-center space-y-2">
              {plan.tagline && (
                <Badge className="bg-primary/10 text-primary w-fit mx-auto">
                  {plan.tagline}
                </Badge>
              )}
              <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
              <p className="text-3xl font-semibold text-primary">
                {plan.price}
              </p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}