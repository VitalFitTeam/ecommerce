"use client";

import { useEffect, useMemo } from "react";
import {
  Store,
  UploadCloud,
  Loader2,
  X,
  FileText,
  Info,
  ArrowRightLeft,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  mainCurrencies,
  InvoiceDetail,
  BranchPaymentMethodInfo,
} from "@vitalfit/sdk";
import { useInvoiceConfirmation } from "@/hooks/useInvoiceConfirmation";
import { PaymentMethodDetails } from "./PaymentMethodDetails";
import { useTranslations } from "next-intl";

interface Props {
  selectedMethod: string;
  onSelectMethod: (value: string) => void;
  onSelectCurrency: (value: string) => void;
  methods: BranchPaymentMethodInfo[];
  invoiceData: InvoiceDetail | null;
  token: string;
  onSuccess: () => void;
  branchId: string;
  totalPrices: {
    subtotalBase: number;
    taxAmountBase: number;
    baseTotal: number;
    displayTotal: number;
    taxPercentage: number;
    displaySymbol: string;
  };
}

export const StepPayment = ({
  invoiceData,
  selectedMethod,
  onSelectMethod,
  onSelectCurrency,
  methods,
  token,
  onSuccess,
  totalPrices,
}: Props) => {
  const t = useTranslations("Checkout.StepPayment");

  const {
    currencyMode,
    setCurrencyMode,
    formData,
    setFormData,
    status,
    uploadingFile,
    handleFileUpload,
    submitPayment,
  } = useInvoiceConfirmation({
    invoiceId: invoiceData?.invoice_id || "",
    methodId: selectedMethod,
    token,
    onSuccess,
  });

  useEffect(() => {
    if (totalPrices.displayTotal >= 0) {
      setFormData((prev: any) => ({
        ...prev,
        amount: Number(totalPrices.displayTotal.toFixed(2)),
      }));
    }
  }, [totalPrices.displayTotal, setFormData]);

  const activeBranchMethod = useMemo(
    () =>
      methods?.find((m) => String(m.method_id) === String(selectedMethod)) ||
      null,
    [selectedMethod, methods],
  );

  const handleCurrencyChange = (val: string) => {
    setCurrencyMode(val);
    if (onSelectCurrency) {
      onSelectCurrency(val);
    }
  };

  const formatAmount = (amount: number) =>
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isSubmitDisabled =
    !formData.reference || status.loading || uploadingFile;

  const invoiceItems = (invoiceData as any)?.items || [];

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="py-6 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-2xl text-white">
              <Store size={20} />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white italic">
              {t("cardTitle")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {invoiceItems.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
                Items en Factura
              </Label>
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 space-y-3">
                {invoiceItems.map((item: any, idx: number) => {
                  const isFree = Number(item.price) === 0;
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center animate-in fade-in fill-mode-both"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-xl",
                            isFree
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600",
                          )}
                        >
                          {isFree ? (
                            <Tag size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {item.name || item.item_name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-black tabular-nums",
                          isFree ? "text-green-600" : "text-slate-900",
                        )}
                      >
                        {isFree
                          ? "GRATIS"
                          : `$ ${formatAmount(Number(item.price))}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
              {t("stepMethod")}
            </Label>
            <Select value={selectedMethod} onValueChange={onSelectMethod}>
              <SelectTrigger className="h-14 border-slate-100 rounded-3xl bg-slate-50/50 font-bold text-slate-700">
                <SelectValue placeholder={t("methodPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border-slate-100 font-bold">
                {methods.map((m) => (
                  <SelectItem key={m.method_id} value={String(m.method_id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
              {t("stepAmount")}
            </Label>

            <div className="p-6 border border-slate-100 bg-slate-50/30 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Moneda de Pago
                  </p>
                  <Select
                    value={currencyMode}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger className="w-[120px] h-12 border-slate-200 bg-white font-black text-slate-900 shadow-sm rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl font-black">
                      {mainCurrencies.map((c) => (
                        <SelectItem
                          key={c.code}
                          value={c.code}
                          className="text-xs"
                        >
                          {c.code} - {c.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                    Monto a Reportar
                  </p>
                  <div className="text-4xl font-black tracking-tighter text-orange-600 tabular-nums leading-none">
                    <span className="text-sm font-bold text-slate-400 mr-1.5 align-top">
                      {totalPrices.displaySymbol}
                    </span>
                    {formatAmount(totalPrices.displayTotal)}
                  </div>
                </div>
              </div>

              {currencyMode !== "USD" && (
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-3xl animate-in slide-in-from-top-1">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                    <ArrowRightLeft size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                      Equivalencia en Dólares
                    </p>
                    <p className="text-xs font-black text-slate-700">
                      $ {formatAmount(totalPrices.baseTotal)} USD
                    </p>
                  </div>
                  <Info size={14} className="text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {activeBranchMethod && (
            <div className="p-1 rounded-[2rem] border border-dashed border-slate-200 bg-white animate-in zoom-in-95">
              <PaymentMethodDetails methodId={selectedMethod} token={token} />
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("referenceLabel")} <span className="text-orange-500">*</span>
            </Label>
            <Input
              placeholder={t("referencePlaceholder")}
              className="h-14 border-slate-100 rounded-3xl bg-slate-50/50 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {t("receiptLabel")}
              </Label>
              <span className="text-[9px] font-bold text-slate-300 uppercase italic">
                Opcional
              </span>
            </div>

            {!formData.filePath ? (
              <div className="relative h-40 border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-orange-200 flex flex-col items-center justify-center transition-all cursor-pointer group rounded-[2rem]">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={uploadingFile}
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0])
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 bg-white rounded-3xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  {uploadingFile ? (
                    <Loader2 className="animate-spin text-orange-500" />
                  ) : (
                    <UploadCloud className="text-orange-500 w-8 h-8" />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center px-4">
                  {uploadingFile ? "Subiendo..." : t("attachReceipt")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-5 bg-orange-50 border border-orange-100 rounded-[2rem] animate-in zoom-in-95">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-orange-500 rounded-2xl text-white">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-orange-900 truncate max-w-[180px]">
                      {formData.filePath.split("/").pop()}
                    </p>
                    <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                      Comprobante Adjunto
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl hover:bg-orange-200 text-orange-600"
                  onClick={() => setFormData({ ...formData, filePath: "" })}
                >
                  <X size={20} strokeWidth={3} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100">
          <Button
            size="lg"
            className={cn(
              "w-full h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 border-none",
              isSubmitDisabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20",
            )}
            disabled={isSubmitDisabled}
            onClick={submitPayment}
          >
            {status.loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              t("submitBtn")
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
