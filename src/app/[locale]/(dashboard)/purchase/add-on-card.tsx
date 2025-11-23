"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";

interface AddOn {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
}

interface AddOnCardProps {
  addon: AddOn;
  isSelected: boolean;
  onToggle: () => void;
}

export default function AddOnCard({
  addon,
  isSelected,
  onToggle,
}: AddOnCardProps) {
  const t = useTranslations("AddOnCard");

  return (
    <Card className="min-w-xs flex-shrink-0 transition-all">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-orange-500">
              {addon.title}
            </p>
            <p className="text-xs text-muted-foreground">{addon.subtitle}</p>
          </div>

          <p className="text-xs text-muted-foreground">{addon.description}</p>

          <div className="pt-2">
            <p className="text-lg font-bold text-foreground">
              ${addon.price.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={onToggle}
            variant={isSelected ? "default" : "outline"}
            className={`w-full ${
              isSelected
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-orange-500 text-orange-500 hover:bg-orange-50"
            }`}
          >
            {isSelected ? t("added") : t("add")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
