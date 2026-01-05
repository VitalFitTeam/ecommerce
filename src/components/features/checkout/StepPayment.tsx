"use client";

import { useEffect, useMemo } from "react";
import {
  Store,
  UploadCloud,
  Loader2,
  AlertCircle,
  X,
  FileText,
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

  const activeBranchMethod = useMemo(
    () =>
      methods?.find((m) => String(m.method_id) === String(selectedMethod)) ||
      null,
    [selectedMethod, methods],
  );

  useEffect(() => {
    if (totalPrices.displayTotal >= 0) {
      setFormData((prev: any) => ({
        ...prev,
        amount: totalPrices.displayTotal,
      }));
    }
  }, [totalPrices.displayTotal, setFormData]);

  const handleCurrencyChange = (val: string) => {
    setCurrencyMode(val);
    if (onSelectCurrency) {
      onSelectCurrency(val);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="py-6 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-white">
              <Store size={20} />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white italic">
              {t("cardTitle")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
              {t("stepMethod")}
            </Label>
            <Select value={selectedMethod} onValueChange={onSelectMethod}>
              <SelectTrigger className="h-14 border-slate-100 rounded-2xl bg-slate-50/50 font-bold text-slate-700">
                <SelectValue placeholder={t("methodPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                {methods.map((m) => (
                  <SelectItem
                    key={m.method_id}
                    value={String(m.method_id)}
                    className="font-bold"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
              {t("stepAmount")}
            </Label>
            <div className="flex items-center gap-4 p-6  border border-slate-100 bg-slate-50/30 transition-all">
              <Select value={currencyMode} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-[110px] h-12 border-slate-200 bg-white font-black text-slate-900 shadow-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-black">
                  {mainCurrencies.map((c) => (
                    <SelectItem
                      key={c.code}
                      value={c.code}
                      className="text-xs font-black"
                    >
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 text-right">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">
                  {t("calculatedTotal")}
                </p>
                <div className="text-4xl font-black tracking-tighter text-orange-500 tabular-nums leading-none">
                  <span className="text-sm font-bold text-slate-400 mr-1.5 align-top">
                    {totalPrices.displaySymbol}
                  </span>
                  {totalPrices.displayTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>

          {activeBranchMethod && (
            <div className="p-1 rounded-2xl border border-dashed border-slate-200 bg-white animate-in zoom-in-95">
              <PaymentMethodDetails methodId={selectedMethod} token={token} />
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("referenceLabel")}
            </Label>
            <Input
              placeholder={t("referencePlaceholder")}
              className="h-14 border-slate-100 rounded-2xl bg-slate-50/50 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300 placeholder:font-bold"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("receiptLabel")}
            </Label>
            {!formData.filePath ? (
              <div className="relative h-40 border-2 border-dashed border-slate-200  bg-slate-50/30 hover:bg-slate-50 hover:border-orange-200 flex flex-col items-center justify-center transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={uploadingFile}
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0])
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  {uploadingFile ? (
                    <Loader2 className="animate-spin text-orange-500" />
                  ) : (
                    <UploadCloud className="text-orange-500 w-8 h-8" />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {uploadingFile ? t("uploading") : t("attachReceipt")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-5 bg-orange-50 border border-orange-100 rounded-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-orange-500 rounded-lg text-white">
                    <FileText size={20} />
                  </div>
                  <p className="text-sm font-black text-orange-900 truncate max-w-[200px]">
                    {formData.filePath.split("/").pop()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-orange-200 text-orange-600"
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
              "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 border-none",
              !formData.reference ||
                !formData.filePath ||
                status.loading ||
                uploadingFile
                ? "bg-slate-200 text-slate-400"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20",
            )}
            disabled={
              !formData.reference ||
              !formData.filePath ||
              status.loading ||
              uploadingFile
            }
            onClick={submitPayment}
          >
            {status.loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">{t("submitBtn")}</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
