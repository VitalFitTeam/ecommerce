"use client";

import { useTranslations } from "next-intl";
import { ReceiptText, ChevronRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mainCurrencies, PublicMembershipResponse } from "@vitalfit/sdk";
import { cn } from "@/lib/utils";
import { PackageOption } from "./PackageCarousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface Props {
  membership?: PublicMembershipResponse;
  selectedPackages: PackageOption[];
  prices: {
    subtotalBase: number;
    taxAmountBase: number;
    taxPercentage: number;
    baseTotal: number;
    displayTotal: number;
    displaySymbol: string;
  };
  step: number;
  currency: string;
  setCurrency: (value: string) => void;
  onNext: () => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasInvoice: boolean;
  validation: {
    hasBranch: boolean;
    missingBranch: boolean;
  };
}

export const OrderSummary = ({
  membership,
  selectedPackages = [],
  prices,
  currency,
  setCurrency,
  onNext,
  onProcess,
  step,
  isProcessing,
  hasInvoice,
  validation,
}: Props) => {
  const t = useTranslations("Checkout.OrderSummary");

  if (!membership) {
    return null;
  }

  const formatPrice = (price: number = 0) =>
    price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isStepOne = step === 1;

  const handleMainAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isStepOne && !hasInvoice) {
      if (!validation.hasBranch) {
        return;
      }
      onProcess();
    } else {
      onNext();
    }
  };

  return (
    <Card className="sticky top-6 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
      <CardHeader className="py-6 px-8 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl text-white">
            <ReceiptText size={18} />
          </div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white italic">
            {t("title")}
          </CardTitle>
        </div>

        <Select
          value={currency}
          onValueChange={setCurrency}
          disabled={hasInvoice || isProcessing}
        >
          <SelectTrigger className="w-[90px] h-9 text-xs font-black bg-white/10 border-none text-white rounded-xl focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl font-bold">
            {mainCurrencies.map((c) => (
              <SelectItem key={c.code} value={c.code} className="text-xs">
                {c.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-base font-black text-slate-900 tracking-tight">
                {membership.name}
              </p>
              <p className="text-[10px] uppercase font-black tracking-widest text-orange-500">
                {t("baseMembership")}
              </p>
            </div>
            <span className="text-base font-black text-slate-900 tabular-nums tracking-tighter">
              ${formatPrice(Number(membership.price))}
            </span>
          </div>

          {selectedPackages.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {selectedPackages.map((pkg) => (
                <div
                  key={pkg.packageId}
                  className="flex justify-between items-center animate-in fade-in slide-in-from-right-2"
                >
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    {pkg.name}
                  </span>
                  <span className="text-sm font-black text-slate-900 tabular-nums">
                    ${formatPrice(Number(pkg.price))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter text-slate-400">
            <span>{t("subtotal")}</span>
            <span className="tabular-nums font-black text-slate-600">
              ${formatPrice(prices.subtotalBase)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter text-slate-400">
            <span>{t("taxLabel", { percent: prices.taxPercentage })}</span>
            <span className="tabular-nums font-black text-slate-600">
              ${formatPrice(prices.taxAmountBase)}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-slate-900/5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {t("totalLabel")}
            </span>
            <div className="text-right">
              <div className="text-4xl font-black text-orange-600 tracking-tighter tabular-nums leading-none">
                <span className="text-sm font-bold text-slate-400 mr-2 align-top">
                  {prices.displaySymbol}
                </span>
                {formatPrice(prices.displayTotal)}
              </div>
              {currency !== "USD" && (
                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-tight">
                  {t("equivalent")}{" "}
                  <span className="text-slate-900">
                    ${formatPrice(prices.baseTotal)} USD
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {validation.missingBranch && (
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 shadow-sm shadow-orange-200/50">
            <div className="bg-orange-500 rounded-full p-1 text-white mt-0.5">
              <Info size={14} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-orange-900 uppercase tracking-tight leading-none">
                {t("requiredBranchTitle")}
              </p>
              <p className="text-[11px] font-medium text-orange-800/70 leading-snug">
                {t("requiredBranchDesc")}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button
          size="lg"
          onClick={handleMainAction}
          disabled={
            isProcessing || (isStepOne && !validation.hasBranch && !hasInvoice)
          }
          className={cn(
            "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 border-none",
            !(isStepOne && !validation.hasBranch && !hasInvoice)
              ? "bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/20"
              : "bg-slate-100 text-slate-300",
          )}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              {!validation.hasBranch && isStepOne && !hasInvoice
                ? t("btnSelectBranch")
                : isStepOne && !hasInvoice
                  ? t("btnConfirmOrder")
                  : t("btnMakePayment")}
              <ChevronRight size={20} />
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
