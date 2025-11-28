"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/sdk-config";
import { PaginatedBranch, BranchPaymentMethodInfo } from "@vitalfit/sdk";
import { useEffect, useState } from "react";

interface Props {
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedMethod: string;
  setSelectedMethod: (value: string) => void;
}

export const StepPayment = ({
  selectedBranch,
  setSelectedBranch,
  selectedMethod,
  setSelectedMethod,
}: Props) => {
  const { token } = useAuth();

  const [branches, setBranches] = useState<PaginatedBranch[]>([]);
  const [methods, setMethods] = useState<BranchPaymentMethodInfo[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoadingBranches(true);
    api.branch
      .getBranches({ page: 1, search: "" }, token)
      .then((res) => {
        setBranches(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las sucursales");
      })
      .finally(() => setLoadingBranches(false));
  }, [token]);

  useEffect(() => {
    if (!selectedBranch || !token) {
      setMethods([]);
      return;
    }

    setLoadingMethods(true);
    api.paymentMethod
      .getBranchPaymentMethods(selectedBranch, token)
      .then((res) => setMethods(res.data || []))
      .catch((err) => {
        console.error(err);
        setMethods([]);
        setError("No se pudieron cargar los métodos de pago");
      })
      .finally(() => setLoadingMethods(false));
  }, [selectedBranch, token]);

  return (
    <div className="space-y-6">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Sucursal</label>
        <Select
          onValueChange={setSelectedBranch}
          value={selectedBranch}
          disabled={loadingBranches}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loadingBranches ? "Cargando..." : "Selecciona una sucursal"
              }
            />
          </SelectTrigger>

          <SelectContent className="max-h-60 overflow-y-auto">
            {branches.map((branch) => (
              <SelectItem key={branch.branch_id} value={branch.branch_id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Métodos de pago
        </label>
        <Select
          onValueChange={setSelectedMethod}
          value={selectedMethod}
          disabled={!selectedBranch || loadingMethods}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loadingMethods
                  ? "Cargando métodos..."
                  : "Selecciona un método de pago"
              }
            />
          </SelectTrigger>

          <SelectContent className="max-h-60 overflow-y-auto">
            {methods.length === 0 && !loadingMethods ? (
              <div className="p-2 text-gray-500 text-sm">
                No hay métodos disponibles
              </div>
            ) : (
              methods.map((method) => (
                <SelectItem key={method.method_id} value={method.method_id}>
                  {method.name || "(Método sin nombre)"}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
