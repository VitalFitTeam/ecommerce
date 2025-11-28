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

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const membershipId = searchParams.get("membershipId");

  const { state, data, status, actions } = useCheckout(membershipId);

  if (status.loading)
    {return <div className="py-16 text-center">Cargando...</div>;}
  if (!data.membership)
    {return (
      <div className="py-16 text-center text-red-500">
        Membresía no encontrada.
      </div>
    );}

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <StepSelectPlan
            data={data.membership}
            updateData={actions.updateMembership} // ✅ ya acepta null
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
        return state.invoiceData ? (
          <StepInvoiceConfirmation
            invoiceId={state.invoiceData.invoice_number}
            membership={data.membership}
            selectedPackage={state.selectedPackage}
            branchId={state.branchId}
            methodId={state.methodId}
            branches={data.branches}
            methods={data.methods}
            currency={state.invoiceData.currency}
            onBack={() => actions.setStep(2)}
            onSuccess={() => actions.setStep(4)}
            token={token || ""}
          />
        ) : null;

      case 4:
        return state.invoiceData ? (
          <StepSuccess
            invoiceNumber={state.invoiceData.invoice_number}
            amountPaid={state.invoiceData.payments[0]?.amount_paid ?? 0}
            currency={state.invoiceData.currency}
            date={new Date().toLocaleDateString()}
            receiptUrl={state.invoiceData.payments[0]?.receipt_url}
          />
        ) : null;

      default:
        return null;
    }
  };

  const getSidebarAction = () => {
    if (state.step === 1) {return () => actions.setStep(2);}
    if (state.step === 2) {return actions.processCheckout;}
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold uppercase mb-8">Realizar compra</h1>

        <CheckoutStepper currentStep={state.step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">{renderStep()}</div>

          {state.step < 3 && (
            <div className="h-fit">
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
              />
              {status.error && (
                <p className="text-red-500 mt-2">{status.error}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
