"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutStepper } from "@/components/layout/checkout/CheckoutStepper";
import { OrderSummary } from "@/components/layout/checkout/OrderSummary";
import { StepPayment } from "@/components/layout/checkout/StepPayment";
import { StepSelectPlan } from "@/components/layout/checkout/StepSelectPlan";
import { StepSuccess } from "@/components/layout/checkout/StepSuccess";
import { api } from "@/lib/sdk-config";
import {
  AddPaymentToInvoiceResponse,
  PublicMembershipResponse,
} from "@vitalfit/sdk";
import { useAuth } from "@/context/AuthContext";

// Tipos internos
interface InvoicePayment {
  amount_paid: number;
  receipt_url?: string;
}

interface InvoiceData {
  invoice_number: string;
  payments: InvoicePayment[];
  currency: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const membershipId = searchParams.get("membershipId");
  const { token, user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [bookingData, setBookingData] =
    useState<PublicMembershipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  // Cargar membresía seleccionada
  useEffect(() => {
    const loadMembership = async () => {
      if (!membershipId) {
        return setIsLoading(false);
      }

      try {
        const response = await api.membership.publicGetMemberships(
          "",
          { page: 1, limit: 50 },
          "USD",
        );
        const selected = response.data.find(
          (m: PublicMembershipResponse) =>
            m.membership_type_id === membershipId,
        );
        if (selected) {
          setBookingData(selected);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la membresía.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMembership();
  }, [membershipId]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleCheckout = async () => {
    if (!bookingData || !token) {
      return;
    }
    if (!selectedBranch || !selectedMethod) {
      setError("Debes seleccionar sucursal y método de pago.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const invoicePayload = {
        branch_id: selectedBranch,
        user_id: user?.role === "client" ? null : (user?.user_id ?? null),
        items: [
          {
            item_id: bookingData.membership_type_id,
            item_type: "membership",
            quantity: 1,
          },
        ],
      };

      // Crear factura
      const invoiceRes = await api.billing.createInvoice(invoicePayload, token);
      const invoiceId = invoiceRes.invoice_id;

      const paymentRes: AddPaymentToInvoiceResponse =
        await api.billing.AddPaymentToInvoice(
          {
            invoice_id: invoiceId,
            payment_method_id: selectedMethod,
            amount_paid: bookingData.price,
            currency_paid: bookingData.base_currency,
            receipt_url: "",
            transaction_id: "",
          },
          token,
        );

      // Guardar datos para StepSuccess
      setInvoiceData({
        invoice_number: invoiceRes.invoice_id,
        payments: [{ amount_paid: bookingData.price, receipt_url: "" }],
        currency: bookingData.base_currency,
      });

      handleNext();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocurrió un error procesando el pago.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-lg font-semibold">
        Cargando membresía...
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center py-16 text-lg font-semibold text-red-500">
        No se encontró la membresía seleccionada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold uppercase mb-8">Realizar compra</h1>

        <CheckoutStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <StepSelectPlan data={bookingData} updateData={setBookingData} />
            )}

            {currentStep === 2 && (
              <StepPayment
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
              />
            )}

            {currentStep === 3 && invoiceData && (
              <StepSuccess
                invoiceNumber={invoiceData.invoice_number}
                amountPaid={invoiceData.payments[0]?.amount_paid ?? 0}
                currency={invoiceData.currency}
                date={new Date().toLocaleDateString()}
                receiptUrl={invoiceData.payments[0]?.receipt_url}
              />
            )}
          </div>

          {currentStep < 3 && bookingData && (
            <div className="h-fit">
              <OrderSummary
                membership={bookingData}
                onCheckout={currentStep === 1 ? handleNext : handleCheckout}
                onBack={currentStep > 1 ? handleBack : undefined}
                isStep1={currentStep === 1}
                isProcessing={isProcessing}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
