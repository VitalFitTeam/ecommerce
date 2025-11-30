"use client";

import { useSearchParams } from "next/navigation";
import { CheckoutStepper } from "@/components/layout/checkout/CheckoutStepper";
import { OrderSummary } from "@/components/layout/checkout/OrderSummary";
import { StepPayment } from "@/components/layout/checkout/StepPayment";
import { StepSelectPlan } from "@/components/layout/checkout/StepSelectPlan";
import { StepInvoiceConfirmation } from "@/components/layout/checkout/StepInvoiceConfirmation";
import { StepSuccess } from "@/components/layout/checkout/StepSuccess";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const membershipId = searchParams.get("membershipId");
  const { state, data, status, actions } = useCheckout(membershipId);

  const conversionRate =
    state.currency === "USD"
      ? 1
      : data.prices
        ? data.prices.refTotal / data.prices.baseTotal
        : 1;

  const isCheckoutFlow = state.step < 3;
  const isFocusFlow = state.step >= 3;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <StepSelectPlan
            data={data.membership}
            updateData={actions.updateMembership}
            selectedPackage={state.selectedPackage}
            setSelectedPackage={actions.setPackage}
            packages={data.packages}
          />
        );
      case 2:
        return (
          <StepPayment
            selectedBranch={state.branchId}
            setSelectedBranch={actions.setBranch}
            selectedMethod={state.methodId}
            setSelectedMethod={actions.setMethod}
            branches={data.branches}
            methods={data.methods}
          />
        );
      case 3:
        if (!state.invoiceData) {
          return null;
        }
        return (
          <StepInvoiceConfirmation
            invoiceId={state.invoiceData.invoice_number}
            membership={data.membership}
            selectedPackage={state.selectedPackage}
            branchId={state.branchId}
            methodId={state.methodId}
            branches={data.branches}
            methods={data.methods}
            currency={state.currency}
            conversionRate={conversionRate}
            onBack={() => actions.setStep(2)}
            onSuccess={(amountPaid, receiptUrl) => {
              actions.setInvoiceData({
                ...state.invoiceData!,
                payments: [
                  {
                    amount_paid: amountPaid,
                    receipt_url: receiptUrl,
                    status: "paid",
                    date_paid: new Date().toISOString(),
                  },
                ],
              });
              actions.setStep(4);
            }}
            token={token || ""}
          />
        );
      case 4:
        if (!state.invoiceData) {
          return null;
        }
        const payment = state.invoiceData.payments?.[0] || {
          amount_paid: 0,
          receipt_url: "",
          status: "pending",
          date_paid: new Date().toISOString(),
        };
        return (
          <StepSuccess
            invoiceNumber={state.invoiceData.invoice_number}
            amountPaid={Number(payment.amount_paid)}
            currency={state.invoiceData.currency ?? state.currency}
            date={new Date(payment.date_paid).toLocaleDateString()}
            receiptUrl={payment.receipt_url}
            isPending={true}
          />
        );
      default:
        return null;
    }
  };

  const getSidebarAction = () => {
    if (state.step === 1) {
      return () => actions.setStep(2);
    }
    if (state.step === 2) {
      return actions.processCheckout;
    }
    return undefined;
  };

  if (status.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Preparando tu compra...
        </p>
      </div>
    );
  }

  if (!data.membership) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Membresía no encontrada
          </h3>
          <p className="text-gray-500">
            No hemos podido cargar los datos de la membresía. Por favor intenta
            nuevamente o contacta a soporte.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <main
        className={`mx-auto px-4 md:px-6 transition-all duration-500 ease-in-out ${isFocusFlow ? "max-w-4xl" : "max-w-7xl"}`}
      >
        <div
          className={`mb-10 text-center transition-all duration-500 ${isFocusFlow ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"}`}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Finalizar Compra
          </h1>
          <p className="mt-2 text-gray-500">
            Completa los pasos para activar tu plan
          </p>
        </div>

        {state.step < 4 && (
          <div className="mb-12 max-w-3xl mx-auto">
            <CheckoutStepper currentStep={state.step} />
          </div>
        )}

        <div
          className={`
            grid gap-8 transition-all duration-500
            ${isCheckoutFlow ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}
          `}
        >
          <div
            className={`
            ${isCheckoutFlow ? "lg:col-span-8 xl:col-span-8" : "w-full max-w-2xl mx-auto"}
          `}
          >
            {renderStep()}
          </div>

          {isCheckoutFlow && (
            <div className="lg:col-span-4 xl:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="sticky top-8">
                <OrderSummary
                  membership={data.membership}
                  selectedPackage={state.selectedPackage}
                  onCheckout={getSidebarAction()}
                  onBack={
                    state.step > 1
                      ? () => actions.setStep(state.step - 1)
                      : undefined
                  }
                  isStep1={state.step === 1}
                  isProcessing={status.processing}
                  currency={state.currency}
                  setCurrency={actions.setCurrency}
                  conversionRate={conversionRate}
                />

                {status.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start animate-in shake">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">
                      {status.error}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    🔒 Pagos 100% Seguros
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
