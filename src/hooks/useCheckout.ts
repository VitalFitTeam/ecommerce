"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  BranchPaymentMethodInfo,
  InvoiceDetail,
  ServicePublicItem,
} from "@vitalfit/sdk";
import { PackageOption } from "@/components/features/checkout/PackageCarousel";

interface CheckoutSelection {
  step: number;
  branchId: string;
  methodId: string;
  membershipId: string | null;
  currency: string;
  packages: PackageOption[];
  services: ServicePublicItem[];
  methods: BranchPaymentMethodInfo[];
  invoice: InvoiceDetail | null;
}

const INITIAL_STATE: CheckoutSelection = {
  step: 1,
  branchId: "",
  methodId: "",
  membershipId: null,
  currency: "USD",
  packages: [],
  services: [],
  methods: [],
  invoice: null,
};

export const useCheckout = () => {
  const [selection, setSelection] = useState<CheckoutSelection>(() => {
    if (typeof window === "undefined") {
      return INITIAL_STATE;
    }

    const saved = localStorage.getItem("vitalfit_checkout_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al parsear el estado inicial", e);
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    if (selection.step === 3) {
      localStorage.removeItem("vitalfit_checkout_state");
    } else {
      localStorage.setItem(
        "vitalfit_checkout_state",
        JSON.stringify(selection),
      );
    }
  }, [selection]);

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
        services: [],
        packages: [],
        invoice: null,
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

  const setMembershipId = useCallback(
    (id: string | null) => setSelection((s) => ({ ...s, membershipId: id })),
    [],
  );

  const togglePackage = useCallback((pkg: PackageOption) => {
    setSelection((prev) => {
      const exists = prev.packages.some((p) => p.packageId === pkg.packageId);
      return {
        ...prev,
        packages: exists
          ? prev.packages.filter((p) => p.packageId !== pkg.packageId)
          : [...prev.packages, pkg],
      };
    });
  }, []);

  const toggleService = useCallback((service: ServicePublicItem) => {
    setSelection((prev) => {
      const exists = prev.services.some(
        (s) => s.service_id === service.service_id,
      );
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s.service_id !== service.service_id)
          : [...prev.services, service],
      };
    });
  }, []);

  const setInvoice = useCallback(
    (data: InvoiceDetail | null) =>
      setSelection((s) => ({ ...s, invoice: data })),
    [],
  );

  const reset = useCallback(() => {
    localStorage.removeItem("vitalfit_checkout_state");
    setSelection(INITIAL_STATE);
  }, []);

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
      setMembershipId,
      togglePackage,
      toggleService,
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
      setMembershipId,
      togglePackage,
      toggleService,
      reset,
    ],
  );

  return { selection, actions };
};
