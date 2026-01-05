"use client";
import { useState, useCallback, useMemo } from "react";
import { BranchPaymentMethodInfo, InvoiceDetail } from "@vitalfit/sdk";
import { PackageOption } from "@/components/features/checkout/PackageCarousel";

interface CheckoutSelection {
  step: number;
  branchId: string;
  methodId: string;
  currency: string;
  packages: PackageOption[];
  methods: BranchPaymentMethodInfo[];
  invoice: InvoiceDetail | null;
}

export const useCheckout = () => {
  const [selection, setSelection] = useState<CheckoutSelection>({
    step: 1,
    branchId: "",
    methodId: "",
    currency: "USD",
    packages: [],
    methods: [],
    invoice: null,
  });

  const setStep = useCallback(
    (step: number) => setSelection((s) => ({ ...s, step })),
    [],
  );
  const next = useCallback(
    () => setSelection((s) => ({ ...s, step: s.step + 1 })),
    [],
  );
  const back = useCallback(
    () => setSelection((s) => ({ ...s, step: Math.max(1, s.step - 1) })),
    [],
  );
  const setCurrency = useCallback(
    (currency: string) => setSelection((s) => ({ ...s, currency })),
    [],
  );

  const setBranch = useCallback(
    (id: string) =>
      setSelection((s) => ({
        ...s,
        branchId: id,
        methodId: "",
        methods: [],
      })),
    [],
  );

  const setMethods = useCallback(
    (methods: BranchPaymentMethodInfo[]) =>
      setSelection((s) => ({ ...s, methods })),
    [],
  );

  const setMethod = useCallback(
    (id: string) => setSelection((s) => ({ ...s, methodId: id })),
    [],
  );

  const setInvoice = useCallback(
    (data: InvoiceDetail | null) =>
      setSelection((s) => ({
        ...s,
        invoice: data,
      })),
    [],
  );

  const togglePackage = useCallback((pkg: PackageOption) => {
    setSelection((prev) => {
      const isSelected = prev.packages.some(
        (p) => p.packageId === pkg.packageId,
      );
      return {
        ...prev,
        packages: isSelected
          ? prev.packages.filter((p) => p.packageId !== pkg.packageId)
          : [...prev.packages, pkg],
      };
    });
  }, []);

  const reset = useCallback(
    () =>
      setSelection({
        step: 1,
        branchId: "",
        methodId: "",
        currency: "USD",
        packages: [],
        methods: [],
        invoice: null,
      }),
    [],
  );

  const actions = useMemo(
    () => ({
      setStep,
      next,
      back,
      setCurrency,
      setBranch,
      setMethods,
      setMethod,
      setInvoice,
      togglePackage,
      reset,
    }),
    [
      setStep,
      next,
      back,
      setCurrency,
      setBranch,
      setMethods,
      setMethod,
      setInvoice,
      togglePackage,
      reset,
    ],
  );

  return { selection, actions };
};
