"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/Card";

interface Plan {
  name: string;
  price: number;
  description: string;
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PlanCard({
  plan,
  isSelected,
  onSelect,
}: PlanCardProps) {
  const t = useTranslations("PlanCard");

  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition-all ${isSelected ? "border-orange-500 bg-orange-50" : "border-border"}`}
    >
      <CardContent className="pt-6">
        <h3 className="font-semibold text-foreground">{plan.name}</h3>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {t("price", { price: plan.price })}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </CardContent>
    </Card>
  );
}
