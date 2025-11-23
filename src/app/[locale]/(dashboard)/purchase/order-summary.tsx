import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface AddOn {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
}

interface OrderSummaryProps {
  selectedAddOns: AddOn[];
  subtotal: number;
}

export default function OrderSummary({
  selectedAddOns,
  subtotal,
}: OrderSummaryProps) {
  const t = useTranslations("OrderSummary");
  const discount = 0;
  const iva = 0;

  return (
    <Card className="sticky top-8 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add-ons */}
        {selectedAddOns.length > 0 && (
          <div className="space-y-2 border-b pb-4">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("addons")}
            </p>
            {selectedAddOns.map((addon) => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {addon.title} - {addon.subtitle}
                </span>
                <span className="font-semibold text-foreground">
                  ${addon.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t("subtotal")}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ${subtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {t("discounts")}
            </span>
            <span className="text-sm text-orange-500">-$0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{t("tax")}</span>
            <span className="text-sm text-foreground">$0</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">{t("total")}</span>
          <span className="text-2xl font-bold text-orange-500">
            ${subtotal}
          </span>
        </div>

        <Button className="w-full bg-orange-500 hover:bg-orange-600 py-4 text-base font-semibold">
          {t("makePayment")}
        </Button>

        <div className="mt-6 flex gap-3 items-center">
          <input
            type="text"
            placeholder={t("promoPlaceholder")}
            className="flex-grow rounded-md border border-input bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <Button className="w-28 bg-orange-500">{t("apply")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
