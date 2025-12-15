"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublicMembershipResponse } from "@vitalfit/sdk";
import type { PackageOption } from "./PackageCarousel";
import { mainCurrencies } from "@vitalfit/sdk";
import { WalletCards, ReceiptText } from "lucide-react";

interface OrderSummaryProps {
  membership: PublicMembershipResponse;
  selectedPackage?: PackageOption | null;
  onCheckout?: () => void;
  isProcessing?: boolean;
  onBack?: () => void;
  isStep1?: boolean;
  currency?: string;
  setCurrency?: (currency: string) => void;
  conversionRate: number;
}

export const OrderSummary = ({
  membership,
  selectedPackage,
  onCheckout,
  onBack,
  isStep1,
  isProcessing,
  currency,
  setCurrency,
  conversionRate,
}: OrderSummaryProps) => {
  const totalUSD =
    Number(membership.price || 0) +
    (selectedPackage ? Number(selectedPackage.price || 0) : 0);

  const totalConverted = totalUSD * conversionRate;
  const selectedCurrency = mainCurrencies.find((c) => c.code === currency);
  const symbol = selectedCurrency?.symbol || "$";

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
      <div className="bg-orange-400 px-6 py-4 flex justify-between items-center rounded-t-2xl text-white">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5" />
          <h3 className="text-lg font-bold tracking-tight">
            Resumen de tu pedido
          </h3>
        </div>

        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-white text-gray-900 rounded-lg border border-gray-200">
            <SelectValue placeholder="Moneda" />
          </SelectTrigger>
          <SelectContent>
            {mainCurrencies.map((c) => (
              <SelectItem key={c.code} value={c.code} className="text-sm">
                {c.code} ({c.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {membership.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">Membresía principal</p>
          </div>
          <span className="font-bold text-gray-900 text-sm tabular-nums">
            ${formatPrice(Number(membership.price))}
          </span>
        </div>
        {selectedPackage && (
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {selectedPackage.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">Paquete adicional</p>
            </div>
            <span className="font-bold text-gray-900 text-sm tabular-nums">
              ${formatPrice(Number(selectedPackage.price))}
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <span className="text-gray-500 text-sm font-medium">
              Total estimado
            </span>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-gray-900 tabular-nums">
                {currency === "USD" ? "$" : symbol}
                {formatPrice(currency === "USD" ? totalUSD : totalConverted)}
              </div>
              {currency !== "USD" && (
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  Ref: ${formatPrice(totalUSD)} USD
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={onCheckout}
            disabled={isProcessing}
            className="w-full h-12 text-base font-semibold"
          >
            {isProcessing
              ? "Procesando..."
              : isStep1
                ? "Continuar al pago"
                : "Confirmar y Pagar"}
            {!isProcessing && (
              <WalletCards className="w-4 h-4 ml-2 inline-block" />
            )}
          </Button>

          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-10 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Volver
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
