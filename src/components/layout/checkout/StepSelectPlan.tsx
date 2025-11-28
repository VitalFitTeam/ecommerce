"use client";

import { Trash2, Info, PackagePlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "@/lib/sdk-config";
import type { PackagePublicItem } from "@vitalfit/sdk";
import { PackageCarousel, PackageOption } from "./PackageCarousel";

interface MembershipPlan {
  name: string;
  description?: string;
  price: number;
  ref_price?: string | number;
  base_currency?: string;
  ref_currency?: string;
  duration_days?: number;
}

interface Props {
  data: MembershipPlan | null;
  updateData: (data: any) => void;
  onSelectPackage?: (pkgId: string | null) => void;
}

export const StepSelectPlan = ({
  data,
  updateData,
  onSelectPackage,
}: Props) => {
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await api.public.getPackages({
          page: 1,
          limit: 10,
          currency: "USD",
        });
        const mapped: PackageOption[] = (res.data || []).map(
          (p: PackagePublicItem) => ({
            id: p.packageId,
            name: p.name,
            description: p.description,
            price: p.price,
            base_currency: p.base_currency,
          }),
        );
        setPackages(mapped);
      } catch (err) {
        console.error("Error loading packages:", err);
      } finally {
        setLoadingPackages(false);
      }
    };
    loadPackages();
  }, []);
  useEffect(() => {
    onSelectPackage?.(selectedPackageId);
  }, [selectedPackageId, onSelectPackage]);

  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
        <PackagePlus className="mx-auto h-10 w-10 mb-2 opacity-50" />
        <p>No membership selected yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {data.name}
              <span className="bg-orange-100 text-orange-600 p-1 rounded-full">
                <Info size={14} />
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {data.description || "Plan de membresía seleccionado."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => updateData(null)}
            title="Eliminar plan"
          >
            <Trash2 size={18} />
          </Button>
        </div>

        <div className="bg-gray-50/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              Precio Total
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                ${data.price}
              </span>
              <span className="text-gray-600 font-medium">
                {data.base_currency}
              </span>
            </div>
            {data.ref_price && (
              <span className="text-xs text-gray-400 mt-1">
                ~ {data.ref_price} {data.ref_currency}
              </span>
            )}
          </div>

          {data.duration_days && (
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Duración: {data.duration_days} días
              </span>
            </div>
          )}
        </div>
      </div>
      {packages.length > 0 && !loadingPackages && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PackagePlus size={20} className="text-blue-500" />
                Complementa tu plan
              </h3>
              <p className="text-sm text-gray-500">
                ¿Deseas agregar sesiones o servicios extra?
              </p>
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={showCarousel ? "yes" : "no"}
                onValueChange={(val) => {
                  const isYes = val === "yes";
                  setShowCarousel(isYes);
                  if (!isYes) {
                    setSelectedPackageId(null);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No, solo la membresía</SelectItem>
                  <SelectItem value="yes">Sí, ver paquetes extra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showCarousel && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <PackageCarousel
                packages={packages}
                selectedPackageId={selectedPackageId}
                onSelectPackage={setSelectedPackageId}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
