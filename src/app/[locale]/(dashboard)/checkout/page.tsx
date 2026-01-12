"use client";

import { Loader2 } from "lucide-react";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import { cn } from "@/lib/utils";
import { CheckoutStepper } from "@/components/features/checkout/CheckoutStepper";
import { StepSelectPlan } from "@/components/features/checkout/StepSelectPlan";
import { StepPayment } from "@/components/features/checkout/StepPayment";
import { StepSuccess } from "@/components/features/checkout/StepSuccess";
import { OrderSummary } from "@/components/features/checkout/OrderSummary";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("Checkout.Page");
  const {
    selection,
    actions,
    token,
    branches,
    normalizedPackages,
    currentMembership,
    prices,
    loading,
    handlers,
    isCreatingInvoice,
  } = useCheckoutLogic();

  if (loading.isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("initialLoading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-10 font-sans antialiased text-slate-900">
      <main
        className={cn(
          "mx-auto px-4 transition-all duration-500 ease-out",
          selection.step >= 2 ? "max-w-4xl" : "max-w-7xl",
        )}
      >
        {selection.step < 3 && (
          <div className="mb-14 text-center animate-in fade-in slide-in-from-top-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("title")}
            </h1>

            <div className="mt-10 max-w-2xl mx-auto">
              <CheckoutStepper currentStep={selection.step} />
            </div>
          </div>
        )}

        <div
          className={cn(
            "grid gap-12",
            selection.step === 1
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1",
          )}
        >
          <div
            className={cn(selection.step === 1 ? "lg:col-span-8" : "w-full")}
          >
            {selection.step === 1 && (
              <StepSelectPlan
                data={currentMembership}
                packages={normalizedPackages}
                selectedPackages={selection.packages}
                togglePackage={actions.togglePackage}
                onRemoveMembership={() => handlers.router.back()}
                branches={branches}
                selectedBranch={selection.branchId}
                onSelectBranch={actions.setBranch}
                invoiceData={selection.invoice}
              />
            )}

            {selection.step === 2 && (
              <StepPayment
                invoiceData={selection.invoice}
                selectedMethod={selection.methodId}
                onSelectMethod={actions.setMethod}
                onSelectCurrency={actions.setCurrency}
                methods={selection.methods}
                token={token || ""}
                totalPrices={prices}
                onSuccess={actions.next}
                branchId={selection.branchId}
              />
            )}

            {selection.step === 3 && (
              <StepSuccess invoiceId={selection.invoice?.invoice_id || ""} />
            )}
          </div>

          {selection.step === 1 && currentMembership && (
            <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <OrderSummary
                membership={currentMembership}
                selectedPackages={selection.packages}
                prices={prices}
                step={selection.step}
                currency={selection.currency}
                setCurrency={actions.setCurrency}
                onNext={actions.next}
                onProcess={handlers.handleProcessCheckout}
                isProcessing={
                  loading.loadingM ||
                  loading.loadingP ||
                  loading.loadingB ||
                  isCreatingInvoice
                }
                hasInvoice={!!selection.invoice}
                validation={{
                  hasBranch: !!selection.branchId,
                  missingBranch: !selection.branchId && selection.step === 1,
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
