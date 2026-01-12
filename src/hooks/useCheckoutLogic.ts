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
  const { token, user } = useAuth();
  const { selection, actions } = useCheckout();
  const urlMembershipId = searchParams.get("membershipId")?.trim();
  const activeMembershipId = urlMembershipId || selection.membershipId;

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

  // Sync URL membershipId with selection state
  useEffect(() => {
    if (urlMembershipId && urlMembershipId !== selection.membershipId) {
      actions.reset();
      actions.setMembershipId(urlMembershipId);
    }
  }, [urlMembershipId, selection.membershipId, actions]);

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
    const extrasUSD = selection.packages.reduce(
      (acc, p) => acc + parsePrice(p.price),
      0,
    );
    const subtotalUSD = baseUSD + extrasUSD;

    const baseDisplay = isRef
      ? parsePrice(currentMembership?.ref_price)
      : baseUSD;
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

    const subtotalDisplay = baseDisplay + extrasDisplay;

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
    if (!selection.branchId || !currentMembership || !user) {
      toast.warning(t("missingSelection"), {
        description: t("missingSelectionDetail"),
      });
      return;
    }

    try {
      setIsCreatingInvoice(true);

      const payload = {
        branch_id: selection.branchId,
        user_id:
          user?.role?.name !== "client" ? user?.user_id : (undefined as any),
        items: [
          {
            item_id: currentMembership.membership_type_id,
            item_type: "membership",
            quantity: 1,
          },
          ...selection.packages.map((p) => ({
            item_id: p.packageId,
            item_type: "package",
            quantity: 1,
          })),
        ],
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
    prices,
    isCreatingInvoice,
    loading: { loadingM, loadingP, loadingB, isInitialLoading },
    handlers: { handleProcessCheckout, router },
  };
};
