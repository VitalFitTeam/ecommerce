"use client";

import { Store, CreditCard, AlertCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { BranchPaymentMethodInfo, BranchInfo } from "@vitalfit/sdk";

interface Props {
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedMethod: string;
  setSelectedMethod: (value: string) => void;

  branches: BranchInfo[];
  methods: BranchPaymentMethodInfo[];
  loading?: boolean;
}

export const StepPayment = ({
  selectedBranch,
  setSelectedBranch,
  selectedMethod,
  setSelectedMethod,
  branches,
  methods,
  loading = false,
}: Props) => {
  const isMethodDisabled = !selectedBranch || methods.length === 0;

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Detalles de Facturación
        </h2>
        <p className="text-sm text-gray-500">
          Selecciona dónde y cómo deseas pagar.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Store size={16} className="text-gray-400" />
          Sucursal
        </label>

        <Select
          value={selectedBranch}
          onValueChange={(val) => {
            setSelectedBranch(val);
          }}
          disabled={loading || branches.length === 0}
        >
          <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 focus:ring-orange-500">
            <SelectValue
              placeholder={
                loading ? "Cargando sucursales..." : "Selecciona una sucursal"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {branches.length > 0 ? (
              branches.map((branch) => (
                <SelectItem
                  key={branch.branch_id}
                  value={branch.branch_id}
                  className="cursor-pointer"
                >
                  <span className="font-medium">{branch.name}</span>
                </SelectItem>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                No hay sucursales disponibles
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <CreditCard size={16} className="text-gray-400" />
          Método de Pago
        </label>

        <Select
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          disabled={isMethodDisabled}
        >
          <SelectTrigger
            className={`w-full h-11 transition-colors ${
              !selectedBranch
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <SelectValue
              placeholder={
                !selectedBranch
                  ? "Primero selecciona una sucursal"
                  : "No hay métodos de pago disponibles"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {methods.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle size={20} className="text-orange-400" />
                <p>No hay métodos para esta sucursal</p>
              </div>
            ) : (
              methods.map((method) => (
                <SelectItem
                  key={method.method_id}
                  value={method.method_id}
                  className="cursor-pointer"
                >
                  {method.name || "Método estándar"}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {!selectedBranch && (
          <p className="text-xs text-orange-600/80 bg-orange-50 p-2 rounded border border-orange-100">
            ⓘ Debes seleccionar una sucursal para ver los métodos de pago
            disponibles.
          </p>
        )}
      </div>
    </div>
  );
};
