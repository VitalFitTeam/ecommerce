"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Banknote,
  Building2,
  CreditCard,
  RefreshCcw,
  X,
  FileText,
  UploadCloud,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { mainCurrencies, PublicMembershipResponse } from "@vitalfit/sdk";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/sdk-config";
import { cn } from "@/lib/utils";
import { PackageOption } from "./PackageCarousel";

interface Branch {
  branch_id: string;
  name: string;
}

interface Method {
  method_id: string;
  name: string;
}

interface Props {
  invoiceId: string;
  membership: PublicMembershipResponse | null;
  selectedPackage: PackageOption | null;
  branchId: string;
  methodId: string;
  branches: Branch[];
  methods: Method[];
  currency: string;
  conversionRate: number;
  onBack: () => void;
  onSuccess: (amountPaid: number, receiptUrl?: string) => void;

  token: string;
}

export const StepInvoiceConfirmation = ({
  invoiceId,
  membership,
  selectedPackage,
  branchId,
  methodId,
  branches,
  methods,
  currency = "USD",
  conversionRate = 1,
  onBack,
  onSuccess,
  token,
}: Props) => {
  const [currencyMode, setCurrencyMode] = useState<string>(currency);
  const [formData, setFormData] = useState({
    amount: 0,
    reference: "",
    filePath: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [uploadingFile, setUploadingFile] = useState(false);

  const branchName =
    branches.find((b) => b.branch_id === branchId)?.name ?? branchId;
  const methodName =
    methods.find((m) => m.method_id === methodId)?.name ?? methodId;

  const basePriceUSD =
    Number(membership?.price) + Number(selectedPackage?.price || 0);
  const convertedPrice = basePriceUSD * conversionRate;
  const refCurrency = membership?.ref_currency ?? "VES";
  const selectedCurrency =
    mainCurrencies.find((c) => c.code === currencyMode) || mainCurrencies[0];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: currencyMode === "USD" ? basePriceUSD : convertedPrice,
    }));
  }, [currencyMode, basePriceUSD, convertedPrice]);

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    setStatus((s) => ({ ...s, error: "" }));

    try {
      const safeFileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}_${file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "_")}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vitalfit_file")
        .upload(safeFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError || !uploadData) {
        throw uploadError || new Error("Error al subir archivo");
      }

      const { data: publicData } = supabase.storage
        .from("vitalfit_file")
        .getPublicUrl(safeFileName);

      if (!publicData?.publicUrl) {
        throw new Error("No se pudo generar URL pública");
      }

      console.log("URL público del archivo:", publicData.publicUrl);
      setFormData((prev) => ({ ...prev, filePath: publicData.publicUrl }));
    } catch (err: any) {
      console.error(err);
      setStatus((s) => ({
        ...s,
        error: "Error al subir comprobante. Intente de nuevo.",
      }));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      setStatus({ loading: false, error: "El monto debe ser mayor a 0." });
      return;
    }
    if (!formData.reference.trim()) {
      setStatus({ loading: false, error: "La referencia es obligatoria." });
      return;
    }

    setStatus({ loading: true, error: "" });

    try {
      const payload = {
        amount_paid: Number(formData.amount),
        currency_paid: currencyMode,
        invoice_id: invoiceId,
        payment_method_id: methodId,
        receipt_url: formData.filePath,
        transaction_id: formData.reference,
      };

      console.log("Submitting payment via SDK:", payload);

      const sdkResponse = await api.billing.AddPaymentToInvoice(
        payload,
        token || "",
      );

      if (!sdkResponse || (sdkResponse as any)?.error) {
        throw new Error(
          (sdkResponse as any)?.error || "Error al registrar el pago",
        );
      }

      onSuccess(Number(formData.amount), formData.filePath);
    } catch (err: any) {
      console.error(err);
      setStatus({
        loading: false,
        error: err.message || "Error al registrar el pago",
      });
    } finally {
      setStatus((p) => ({ ...p, loading: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start sm:items-center gap-4 shadow-sm">
        <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0 text-emerald-600">
          <CheckCircle2 size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-emerald-950">
            Orden #{invoiceId.slice(-6)} generada
          </h2>
          <p className="text-emerald-700/80 text-sm mt-1">
            Realiza el pago a la cuenta de <strong>{branchName}</strong> y
            adjunta el comprobante abajo.
          </p>
        </div>
      </div>

      <Card className="bg-white border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden rounded-2xl">
        <div className="bg-slate-50/80 border-b border-gray-100 p-6 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Concepto
            </span>
            <div className="font-medium text-gray-900 mt-1">
              {membership?.name}
            </div>
            {selectedPackage && (
              <div className="text-sm text-gray-500">
                + {selectedPackage.name}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total a Pagar
            </span>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {selectedCurrency.symbol} {formData.amount.toFixed(2)}
            </div>
            {currencyMode !== "USD" && (
              <div className="text-xs text-gray-400">
                Base: ${basePriceUSD.toFixed(2)} USD
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {status.error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {status.error}
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              ¿En qué moneda realizaste el pago?
            </Label>
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrencyMode("USD")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  currencyMode === "USD"
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                <DollarSign size={16} /> Dólares (USD)
              </button>
              <button
                onClick={() => setCurrencyMode(refCurrency)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  currencyMode === refCurrency
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {refCurrency}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700">
                Monto Transferido
              </Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg pointer-events-none">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  disabled={status.loading}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  className="pl-10 h-12 text-lg font-bold bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref" className="text-gray-700">
                Nro. de Referencia
              </Label>
              <Input
                id="ref"
                placeholder="Ej: 00123456"
                disabled={status.loading}
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                className="h-12 border-gray-200 font-mono text-gray-800 tracking-wide"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Comprobante de Pago</Label>

            {!formData.filePath ? (
              <div className="relative group">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={status.loading || uploadingFile}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 group-hover:bg-blue-50/50 group-hover:border-blue-300 transition-all duration-300">
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                      <p className="text-sm font-medium text-blue-600">
                        Subiendo archivo...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Haz clic para subir imagen o PDF
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Máximo 5MB</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate max-w-[200px]">
                      {formData.filePath.split("/").pop() || "comprobante_pago"}
                    </p>
                    <p className="text-xs text-blue-600">Listo para enviar</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => setFormData({ ...formData, filePath: "" })}
                >
                  <X size={18} />
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={status.loading}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft size={16} className="mr-2" /> Atrás
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={
                status.loading ||
                uploadingFile ||
                !formData.reference ||
                !formData.amount
              }
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 rounded-xl font-medium shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {status.loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> Procesando
                </>
              ) : (
                "Confirmar Pago"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
