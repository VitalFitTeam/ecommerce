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
  invoiceData: any | null;
}

export const useCheckout = (membershipId: string | null) => {
  const { token, user } = useAuth();

  const [state, setState] = useState<CheckoutState>({
    step: 1,
    branchId: "",
    methodId: "",
    selectedPackage: null,
    invoiceData: null,
  });

  const [data, setData] = useState({
    membership: null as PublicMembershipResponse | null,
    branches: [] as PaginatedBranch[],
    methods: [] as BranchPaymentMethodInfo[],
    packages: [] as PackageOption[],
  });

  const [status, setStatus] = useState({
    loading: true,
    processing: false,
    error: "",
  });

  const updateState = (updates: Partial<CheckoutState>) =>
    setState((prev) => ({ ...prev, ...updates }));

  // =========================================================
  // Carga inicial: membership + packages
  // =========================================================
  useEffect(() => {
    if (!membershipId) {
      setStatus((prev) => ({ ...prev, loading: false }));
      return;
    }

    const init = async () => {
      try {
        const [membershipRes, packagesRes] = await Promise.all([
          api.membership.publicGetMemberships(
            "",
            { page: 1, limit: 50 },
            "USD",
          ),
          api.public.getPackages({ page: 1, limit: 50, currency: "USD" }),
        ]);

        const membership =
          membershipRes.data.find(
            (m: any) => m.membership_type_id === membershipId,
          ) || null;

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

        setData({
          membership,
          branches: [],
          methods: [],
          packages: mappedPackages,
        });
      } catch (e) {
        console.error(e);
        setStatus((prev) => ({
          ...prev,
          error: "Error cargando datos iniciales",
        }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    init();
  }, [membershipId]);

  // =========================================================
  // Carga de sucursales
  // =========================================================
  useEffect(() => {
    if (token) {
      api.branch
        .getBranches({ page: 1, search: "" }, token)
        .then((res) => setData((d) => ({ ...d, branches: res.data || [] })));
    }
  }, [token]);

  // =========================================================
  // Carga de métodos de pago por sucursal
  // =========================================================
  useEffect(() => {
    if (state.branchId && token) {
      api.paymentMethod
        .getBranchPaymentMethods(state.branchId, token)
        .then((res) => setData((d) => ({ ...d, methods: res.data || [] })));
    } else {
      setData((d) => ({ ...d, methods: [] }));
    }
  }, [state.branchId, token]);

  // =========================================================
  // Checkout: crear invoice
  // =========================================================
  const processCheckout = async () => {
    if (!data.membership || !state.branchId || !state.methodId) {return;}

    setStatus((s) => ({ ...s, processing: true, error: "" }));

    try {
      const payload: any = {
        branch_id: state.branchId,
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

      if (user?.role !== "client") {payload.user_id = user?.user_id;}

      const res = await api.billing.createInvoice(payload, token || "");

      updateState({
        invoiceData: {
          invoice_number: res.invoice_id || res.message,
          currency: "USD",
          payments: [],
        },
        step: 3,
      });
    } catch (err) {
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
      setPackage: (pkg: PackageOption | null) =>
        updateState({ selectedPackage: pkg }),
      setBranch: (id: string) => updateState({ branchId: id, methodId: "" }),
      setMethod: (id: string) => updateState({ methodId: id }),
      processCheckout,
      // ⚡ Ahora acepta null correctamente
      updateMembership: (m: PublicMembershipResponse | null) =>
        setData((d) => ({ ...d, membership: m })),
    },
  };
};
