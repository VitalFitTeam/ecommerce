"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Loader2,
  RefreshCcw,
  Banknote,
  Building2,
  CreditCard,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderSummary } from "@/components/layout/checkout/OrderSummary";
import { PackageOption } from "@/components/layout/checkout/PackageCarousel";
import { api } from "@/lib/sdk-config";

// IMPORTANTE: Definimos la interfaz localmente para asegurar que coincida
// con lo que tu SDK espera (AddPaymentToInvoicePayload).
// Nota: 'receipt_url' es string obligatorio, no opcional.
interface PaymentPayload {
  invoice_id: string;
  amount_paid: number;
  currency_paid: string;
  payment_method_id: string;
  receipt_url: string;
  transaction_id: string;
}

interface Props {
  invoiceId: string;
  membership: any;
  selectedPackage: PackageOption | null;
  branchId: string;
  methodId: string;
  branches: { branch_id: string; name: string }[];
  methods: { method_id: string; name: string }[];
  currency: string;
  onBack: () => void;
  onSuccess: () => void;
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
  onBack,
  onSuccess,
  token,
}: Props) => {
  // Cálculo de precios referenciales (Fase 2)
  const basePrice = membership.price + (selectedPackage?.price || 0);
  const refPrice = membership.ref_price
    ? membership.ref_price +
      (selectedPackage
        ? selectedPackage.price * (membership.ref_price / membership.price)
        : 0)
    : 0;
  const refCurrency = membership.ref_currency_code || "VES";

  const [currencyMode, setCurrencyMode] = useState<string>("USD");
  const [formData, setFormData] = useState({
    amount: basePrice,
    reference: "",
    fileUrl: "",
  });

  const [fetchingInvoice, setFetchingInvoice] = useState(true);
  const [status, setStatus] = useState({ loading: false, error: "" });

  const branchName =
    branches.find((b) => b.branch_id === branchId)?.name || branchId;
  const methodName =
    methods.find((m) => m.method_id === methodId)?.name || methodId;

  // =========================================================
  // 1. Sincronización con Backend (GET /billing/invoices/{id})
  // =========================================================
  useEffect(() => {
    let isMounted = true;

    const fetchInvoiceDetails = async () => {
      try {
        setFetchingInvoice(true);
        // 🚨 CORRECCIÓN CLAVE: Usamos 'getInvoiceByID' (con D mayúscula) según tu SDK
        const res = await api.billing.getInvoiceByID(invoiceId, token);

        if (isMounted && res.data) {
          // Aquí podrías actualizar el 'amount' si quisieras forzar el total del backend
          // Pero mantenemos la lógica de sugerencia por Tabs para la Fase 4
        }
      } catch (err) {
        console.error("Error fetching invoice details:", err);
      } finally {
        if (isMounted) {
          setFetchingInvoice(false);
        }
      }
    };

    if (invoiceId && token) {
      fetchInvoiceDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [invoiceId, token]);

  // Efecto para actualizar monto sugerido al cambiar tabs
  useEffect(() => {
    if (currencyMode === currency) {
      setFormData((prev) => ({ ...prev, amount: basePrice }));
    } else if (currencyMode === refCurrency && refPrice > 0) {
      setFormData((prev) => ({ ...prev, amount: Number(refPrice.toFixed(2)) }));
    } else {
      setFormData((prev) => ({ ...prev, amount: 0 }));
    }
  }, [currencyMode, basePrice, refPrice, currency, refCurrency]);

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      setStatus({ loading: false, error: "El monto debe ser mayor a 0." });
      return;
    }
    if (!formData.reference) {
      setStatus({ loading: false, error: "La referencia es obligatoria." });
      return;
    }

    setStatus({ loading: true, error: "" });

    try {
      // Construimos el Payload compatible con 'AddPaymentToInvoicePayload'
      const payload: PaymentPayload = {
        invoice_id: invoiceId,
        amount_paid: Number(formData.amount),
        currency_paid: currencyMode,
        payment_method_id: methodId,
        // 🚨 CORRECCIÓN TIPADO: Si está vacío, enviamos string vacío "", nunca undefined
        receipt_url: formData.fileUrl || "",
        transaction_id: formData.reference,
      };

      // 🚨 CORRECCIÓN NOMBRE: Usamos 'AddPaymentToInvoice' (Mayúscula) según tu SDK
      await api.billing.AddPaymentToInvoice(payload, token);

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setStatus({
        loading: false,
        error: err?.message || "Error al registrar el pago.",
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Confirmación Visual */}
      <Card className="border-green-200 bg-green-50/40 shadow-none">
        <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-green-900">¡Factura Creada!</h2>
          <p className="text-green-700/80 text-sm mt-1">
            Tu orden <strong>#{invoiceId.slice(-6)}</strong> está lista.
          </p>

          <div className="flex gap-2 text-xs font-medium text-green-800 bg-white/60 p-2 rounded-lg border border-green-100 mt-3">
            <span className="flex items-center gap-1">
              <Building2 size={12} /> {branchName}
            </span>
            <span className="text-green-300">|</span>
            <span className="flex items-center gap-1">
              <CreditCard size={12} /> {methodName}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Resumen */}
      <OrderSummary
        membership={membership}
        selectedPackage={selectedPackage}
        isStep1={false}
      />

      {/* 3. Formulario de Pago */}
      <Card className="border-blue-100 shadow-md">
        <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-4">
          <CardTitle className="text-base flex items-center justify-between text-blue-900">
            <span className="flex items-center gap-2">
              <Banknote className="text-blue-600" size={18} /> Reportar Pago
            </span>
            {fetchingInvoice && (
              <span className="text-xs font-normal flex items-center gap-1 text-blue-500">
                <Loader2 size={12} className="animate-spin" /> Sincronizando...
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {status.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              🚨 {status.error}
            </div>
          )}

          <div className="space-y-3">
            <Label>¿En qué moneda pagaste?</Label>
            <Tabs
              value={currencyMode}
              onValueChange={setCurrencyMode}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={currency}>🇺🇸 {currency}</TabsTrigger>
                <TabsTrigger value={refCurrency}>🇻🇪 {refCurrency}</TabsTrigger>
              </TabsList>
            </Tabs>

            {currencyMode === refCurrency && (
              <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 p-2 rounded">
                <RefreshCcw size={12} />
                Monto sugerido según tasa del día.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Monto Transferido <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-sm">
                  {currencyMode === "USD" ? "$" : "Bs"}
                </span>
                <Input
                  id="amount"
                  type="number"
                  disabled={status.loading}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="pl-8 font-mono font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref">
                Referencia / Recibo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ref"
                placeholder="Ej: 123456"
                disabled={status.loading}
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between">
              Link del Comprobante{" "}
              <span className="text-gray-400 font-normal text-xs">
                (Opcional)
              </span>
            </Label>
            <div className="relative">
              <UploadCloud className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="https://..."
                disabled={status.loading}
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={onBack} disabled={status.loading}>
              <ArrowLeft size={16} className="mr-2" /> Volver
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={status.loading}
              className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
            >
              {status.loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> Procesando
                </>
              ) : (
                "Confirmar Pago"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
