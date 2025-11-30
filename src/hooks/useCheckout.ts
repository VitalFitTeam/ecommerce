import { useState, useEffect } from "react";
import { api } from "@/lib/sdk-config";
import { useAuth } from "@/context/AuthContext";
import type {
  PublicMembershipResponse,
  PaginatedBranch,
  BranchPaymentMethodInfo,
  PackagePublicItem,
} from "@vitalfit/sdk";
import type { PackageOption } from "@/components/layout/checkout/PackageCarousel";

interface CheckoutState {
  step: number;
  branchId: string;
  methodId: string;
  selectedPackage: PackageOption | null;
  invoiceData: {
    invoice_number: string;
    currency: string;
    payments: any[];
  } | null;
  currency: string;
}

interface CheckoutData {
  membership: PublicMembershipResponse | null;
  branches: PaginatedBranch[];
  methods: BranchPaymentMethodInfo[];
  packages: PackageOption[];
  prices?: {
    baseTotal: number;
    refTotal: number;
    refSymbol: string;
    refCurrency: string;
  };
}

export const useCheckout = (membershipId: string | null) => {
  const { token, user } = useAuth();

  const [state, setState] = useState<CheckoutState>({
    step: 1,
    branchId: "",
    methodId: "",
    selectedPackage: null,
    invoiceData: null,
    currency: "USD",
  });

  const [data, setData] = useState<CheckoutData>({
    membership: null,
    branches: [],
    methods: [],
    packages: [],
  });

  const [status, setStatus] = useState({
    loading: true,
    processing: false,
    error: "",
  });

  const updateState = (updates: Partial<CheckoutState>) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    if (!membershipId) {
      setStatus((prev) => ({ ...prev, loading: false }));
      return;
    }

    const init = async () => {
      try {
        const currency = state.currency;

        const [membershipRes, packagesRes] = await Promise.all([
          api.membership.publicGetMemberships(
            "",
            { page: 1, limit: 50 },
            currency,
          ),
          api.public.getPackages({ page: 1, limit: 50, currency }),
        ]);

        const memberships: PublicMembershipResponse[] = membershipRes.data;
        const membership =
          memberships.find((m) => m.membership_type_id === membershipId) ||
          null;

        const mappedPackages: PackageOption[] = (packagesRes.data || []).map(
          (p: PackagePublicItem) => ({
            id: p.packageId,
            name: p.name,
            description: p.description,
            price: p.price,
            base_currency: p.base_currency,
            ref_currency: p.ref_currency,
            ref_price: p.ref_price,
            startAt: p.startAt,
            endAt: p.endAt,
            isActive: p.isActive,
          }),
        );

        const baseTotal =
          Number(membership?.price || 0) +
          (state.selectedPackage
            ? Number(state.selectedPackage.price || 0)
            : 0);

        const refTotal =
          Number(membership?.ref_price || 0) +
          (state.selectedPackage
            ? Number(state.selectedPackage.price || 0)
            : 0);

        const refSymbol =
          membership?.ref_currency === "VES"
            ? "Bs."
            : membership?.ref_currency || "$";
        const refCurrency = membership?.ref_currency || "VES";

        setData((prev) => ({
          ...prev,
          membership,
          packages: mappedPackages,
          prices: { baseTotal, refTotal, refSymbol, refCurrency },
        }));
      } catch (e) {
        console.error(e);
        setStatus((prev) => ({ ...prev, error: "Error cargando datos" }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    init();
  }, [membershipId, state.currency]);

  useEffect(() => {
    if (!token) {return;}

    api.branch
      .getBranches({ page: 1, search: "" }, token)
      .then((res) =>
        setData((prev) => ({ ...prev, branches: res.data || [] })),
      );
  }, [token]);

  useEffect(() => {
    if (!state.branchId || !token) {
      setData((prev) => ({ ...prev, methods: [] }));
      return;
    }

    api.paymentMethod
      .getBranchPaymentMethods(state.branchId, token)
      .then((res) => setData((prev) => ({ ...prev, methods: res.data || [] })));
  }, [state.branchId, token]);

  const processCheckout = async () => {
    if (!data.membership || !state.branchId || !state.methodId) {return;}

    setStatus((s) => ({ ...s, processing: true, error: "" }));

    try {
      const payload: any = {
        branch_id: state.branchId,
        currency: state.currency,
        items: [
          {
            item_id: data.membership.membership_type_id,
            item_type: "membership",
            quantity: 1,
          },
        ],
      };

      if (state.selectedPackage) {
        payload.items.push({
          item_id: state.selectedPackage.id,
          item_type: "package",
          quantity: 1,
        });
      }

      if (user?.role !== "client") {
        payload.user_id = user?.user_id;
      }

      const res = await api.billing.createInvoice(payload, token || "");

      updateState({
        invoiceData: {
          invoice_number: res.invoice_id || res.message,
          currency: state.currency,
          payments: [],
        },
        step: 3,
      });
    } catch {
      setStatus((s) => ({ ...s, error: "Error al procesar la compra." }));
    } finally {
      setStatus((s) => ({ ...s, processing: false }));
    }
  };

  return {
    state,
    data,
    status,
    actions: {
      setStep: (step: number) => updateState({ step }),
      setCurrency: (currency: string) => updateState({ currency }),
      setPackage: (pkg: PackageOption | null) =>
        updateState({ selectedPackage: pkg }),
      setBranch: (id: string) => updateState({ branchId: id, methodId: "" }),
      setMethod: (id: string) => updateState({ methodId: id }),
      processCheckout,
      updateMembership: (m: PublicMembershipResponse | null) =>
        setData((d) => ({ ...d, membership: m })),

      setInvoiceData: (invoiceData: CheckoutState["invoiceData"]) =>
        updateState({ invoiceData }),
    },
  };
};
