"use client";

import { useState, useMemo } from "react";
import { PackagePlus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { PackageCarousel, PackageOption } from "./PackageCarousel";
import { MembershipSummary } from "./MembershipSummary";
import { PublicMembershipResponse } from "@vitalfit/sdk";

interface Props {
  data: PublicMembershipResponse | null;
  updateData: (data: PublicMembershipResponse | null) => void;
  selectedPackage: PackageOption | null;
  setSelectedPackage: (pkg: PackageOption | null) => void;
  packages: PackageOption[];
}

export const StepSelectPlan = ({
  data,
  updateData,
  selectedPackage,
  setSelectedPackage,
  packages,
}: Props) => {
  // =========================================================
  // 1️⃣ Estado local: mostrar u ocultar carousel de paquetes
  // =========================================================
  const [showCarousel, setShowCarousel] = useState<boolean>(!!selectedPackage);

  // =========================================================
  // 2️⃣ Computed: mapa de paquetes por id (optimizado con useMemo)
  // Siempre se llama, incluso si data es null
  // =========================================================
  const packageMap = useMemo(
    () =>
      (packages || []).reduce(
        (acc, pkg) => {
          acc[pkg.id] = pkg;
          return acc;
        },
        {} as Record<string, PackageOption>,
      ),
    [packages],
  );

  // =========================================================
  // 3️⃣ Guard Clause: si no hay membresía seleccionada
  // =========================================================
  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 animate-in fade-in zoom-in duration-300">
        <PackagePlus className="mx-auto h-10 w-10 mb-2 opacity-50" />
        <p>No membership selected yet.</p>
      </div>
    );
  }

  // =========================================================
  // 4️⃣ Handler del select "Sí/No" para mostrar paquetes
  // =========================================================
  const handleAddonToggle = (val: string) => {
    const isYes = val === "yes";
    setShowCarousel(isYes);

    // Si el usuario selecciona "No", borramos la selección
    if (!isYes) {
      setSelectedPackage(null);
    }
  };

  // =========================================================
  // 5️⃣ Render
  // =========================================================
  return (
    <div className="space-y-6">
      {/* Resumen del plan */}
      <MembershipSummary plan={data} onRemove={() => updateData(null)} />

      {/* Selector de paquetes adicionales */}
      {packages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all">
          {/* Header */}
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

            {/* Select Sí/No */}
            <div className="w-full sm:w-64">
              <Select
                value={showCarousel ? "yes" : "no"}
                onValueChange={handleAddonToggle}
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

          {/* Carousel de paquetes */}
          {showCarousel && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <PackageCarousel
                packages={packages}
                selectedPackageId={selectedPackage?.id ?? null}
                onSelectPackage={(pkgId) =>
                  setSelectedPackage(packageMap[pkgId] || null)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
