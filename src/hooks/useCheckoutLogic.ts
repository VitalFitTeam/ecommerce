"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/sdk-config";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuth } from "@/context/AuthContext";
import { useTax } from "@/hooks/useTax";
import { usePublicMemberships } from "@/hooks/usePublicMemberships";
import { usePublicPackages } from "@/hooks/usePublicPackages";
import { useBranches } from "@/hooks/useBranches";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useCheckoutLogic = () => {
  const t = useTranslations("Checkout.Notifications");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, loading: authLoading } = useAuth();
  const { selection, actions } = useCheckout();
  const urlMembershipId = searchParams.get("membershipId")?.trim();
  const activeMembershipId = urlMembershipId || selection.membershipId;
  const urlServiceId = searchParams.get("serviceId")?.trim();
  const [currentService, setCurrentService] = useState<any | null>(null);
  const [loadingS, setLoadingS] = useState(false);

  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const lastFetchedBranchId = useRef<string | null>(null);

  const { memberships, loading: loadingM } = usePublicMemberships(
    selection.currency || "USD",
    undefined,
  );
  const { packages: rawPackages, loading: loadingP } = usePublicPackages(
    selection.currency || "USD",
  );
  const { branches, loading: loadingB } = useBranches(token);
  const { taxRate } = useTax(selection.branchId, token);

  const isInitialLoading =
    (loadingM || loadingB || loadingP) &&
    (!memberships || memberships.length === 0);

  const parsePrice = (v: any) =>
    parseFloat(v?.toString().replace(/[^0-9.-]+/g, "") || "0");

  const normalizedPackages = useMemo(() => {
    if (!rawPackages) {
      return [];
    }
    return rawPackages.map((pkg: any) => ({
      ...pkg,
      packageId: pkg.packageId || pkg.id,
      price: parsePrice(pkg.price),
      ref_price: parsePrice(pkg.ref_price),
    }));
  }, [rawPackages]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      if (
        !urlMembershipId &&
        !urlServiceId &&
        (selection.membershipId ||
          selection.packages.length > 0 ||
          selection.branchId)
      ) {
        actions.reset();
      }
    } else {
      if (selection.userId && selection.userId !== user.user_id) {
        actions.reset();
        actions.setUserId(user.user_id);
      } else if (!selection.userId) {
        if (
          selection.membershipId ||
          selection.packages.length > 0 ||
          selection.branchId
        ) {
          actions.reset();
        }
        actions.setUserId(user.user_id);
      }
    }
  }, [
    user,
    authLoading,
    selection.userId,
    selection.membershipId,
    selection.packages.length,
    selection.branchId,
    actions,
    urlMembershipId,
    urlServiceId,
  ]);
  useEffect(() => {
    if (urlMembershipId && urlMembershipId !== selection.membershipId) {
      actions.reset();
      actions.setMembershipId(urlMembershipId);
    }
  }, [urlMembershipId, selection.membershipId, actions]);

  useEffect(() => {
    if (urlServiceId) {
      const fetchService = async () => {
        setLoadingS(true);
        try {
          const res = await api.public.getServices({ limit: 100 } as any);
          const found = res.data?.find(
            (s: any) => s.service_id === urlServiceId,
          );
          setCurrentService(found || null);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingS(false);
        }
      };
      fetchService();
    }
  }, [urlServiceId]);

  const currentMembership = useMemo(
    () =>
      memberships?.find(
        (m) => String(m.membership_type_id) === String(activeMembershipId),
      ),
    [memberships, activeMembershipId],
  );

  const prices = useMemo(() => {
    const isRef = selection.currency !== "USD";
    const currentTax = taxRate || 0;

    const baseUSD = parsePrice(currentMembership?.price);
    const serviceUSD = parsePrice(currentService?.lowest_price_member); // Assuming member price preference
    const extrasUSD = selection.packages.reduce(
      (acc, p) => acc + parsePrice(p.price),
      0,
    );
    const subtotalUSD = baseUSD + serviceUSD + extrasUSD;

    const baseDisplay = isRef
      ? parsePrice(currentMembership?.ref_price)
      : baseUSD;
    const serviceDisplay = isRef
      ? parsePrice(currentService?.ref_lowest_price_member)
      : serviceUSD;
    const extrasDisplay = selection.packages.reduce((acc, cartPkg) => {
      const freshPkg = normalizedPackages.find(
        (p) => p.packageId === cartPkg.packageId,
      );
      return (
        acc +
        (isRef
          ? parsePrice(freshPkg?.ref_price || cartPkg.ref_price)
          : parsePrice(freshPkg?.price || cartPkg.price))
      );
    }, 0);

    const subtotalDisplay = baseDisplay + serviceDisplay + extrasDisplay;

    return {
      subtotalBase: subtotalUSD,
      taxAmountBase: subtotalUSD * currentTax,
      baseTotal: subtotalUSD * (1 + currentTax),
      displayTotal: subtotalDisplay * (1 + currentTax),
      displaySymbol: isRef
        ? currentMembership?.ref_currency === "VES"
          ? "Bs."
          : currentMembership?.ref_currency || "$"
        : "$",
      taxPercentage: currentTax * 100,
    };
  }, [
    currentMembership,
    currentService,
    selection.packages,
    normalizedPackages,
    taxRate,
    selection.currency,
  ]);

  useEffect(() => {
    const branchId = selection.branchId;
    if (
      !branchId ||
      !token ||
      selection.step > 2 ||
      branchId === lastFetchedBranchId.current
    ) {
      return;
    }

    const fetchMethods = async () => {
      try {
        lastFetchedBranchId.current = branchId;
        const res = await api.paymentMethod.getBranchPaymentMethods(
          branchId,
          token,
        );
        actions.setMethods(res?.data || res || []);
      } catch (err) {
        lastFetchedBranchId.current = null;
        actions.setMethods([]);
        toast.error(t("methodsError"), {
          description: t("methodsErrorDetail"),
        });
      }
    };
    fetchMethods();
  }, [selection.branchId, token, selection.step, actions, t]);

  const handleProcessCheckout = useCallback(async () => {
    if (
      !selection.branchId ||
      (!currentMembership && !currentService) ||
      !user
    ) {
      toast.warning(t("missingSelection"), {
        description: t("missingSelectionDetail"),
      });
      return;
    }

    try {
      setIsCreatingInvoice(true);

      const items: any[] = [
        ...(currentMembership
          ? [
              {
                item_id: currentMembership.membership_type_id,
                item_type: "membership",
                quantity: 1,
              },
            ]
          : []),
        ...(currentService
          ? [
              {
                item_id: currentService.service_id,
                item_type: "service",
                quantity: 1,
              },
            ]
          : []),
        ...selection.packages.map((p) => ({
          item_id: p.packageId,
          item_type: "package",
          quantity: 1,
        })),
      ];

      const payload = {
        branch_id: selection.branchId,
        user_id: undefined as any,
        items,
      };

      const res = await api.billing.createInvoice(payload, token || "");
      const invoiceData = (res as any).data || res;

      if (invoiceData && (invoiceData.invoice_id || invoiceData.id)) {
        actions.setInvoice(invoiceData);
        toast.success(t("invoiceSuccess"), {
          description: t("invoiceSuccessDetail"),
        });
        setTimeout(() => {
          actions.next();
        }, 100);
      } else {
        throw new Error("Invalid Invoice Data");
      }
    } catch (error) {
      console.error("Error en Facturación:", error);
      toast.error(t("invoiceError"), {
        description: t("invoiceErrorDetail"),
      });
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [
    selection.branchId,
    selection.packages,
    currentMembership,
    token,
    user,
    actions,
    t,
  ]);

  return {
    selection,
    actions,
    token,
    branches,
    normalizedPackages,
    currentMembership,
    currentService,
    prices,
    isCreatingInvoice,
    loading: { loadingM, loadingP, loadingB, loadingS, isInitialLoading },
    handlers: { handleProcessCheckout, router },
  };
};
