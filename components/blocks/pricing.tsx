'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included?: boolean;
  value?: string;
}

interface Plan {
  name: string;
  price: string;
  yearlyPrice?: string;
  period: string;
  features: PlanFeature[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
}

interface PricingProps {
  plans: Plan[];
  title?: string;
  description?: string;
}

export function Pricing({ plans, title = "AIエージェントで業務効率化", description }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="w-full py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm font-medium", !isYearly ? "text-foreground" : "text-muted-foreground")}>
              月額
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isYearly ? "bg-primary" : "bg-secondary"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isYearly ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", isYearly ? "text-foreground" : "text-muted-foreground")}>
              年額
            </span>
            {plans.some(plan => plan.yearlyPrice) && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                2ヶ月分お得
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={cn(
                "relative rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl",
                plan.isPopular 
                  ? "border-2 border-primary scale-105 md:scale-110" 
                  : "border border-border hover:border-border"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                    最も人気
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ¥{isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                  {isYearly && plan.yearlyPrice && (
                    <p className="text-sm text-muted-foreground">
                      月額換算 ¥{Math.round(parseInt(plan.yearlyPrice.replace(/,/g, '')) / 12).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included !== false ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <span className={cn(
                          "text-sm",
                          feature.included !== false ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {feature.text}
                        </span>
                        {feature.value && (
                          <span className="ml-2 text-sm font-medium text-primary">
                            {feature.value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-6 pb-8">
                <Button
                  className={cn(
                    "w-full py-3 rounded-xl font-medium transition-all duration-200",
                    plan.isPopular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                  onClick={() => {
                    // Handle button click - navigate to href or trigger action
                    console.log(`Selected plan: ${plan.name}, href: ${plan.href}`);
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            すべてのプランに14日間の無料トライアルが含まれています
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ いつでもキャンセル可能</span>
            <span>✓ クレジットカード不要</span>
            <span>✓ 24時間サポート</span>
          </div>
        </div>
      </div>
    </section>
  );
}