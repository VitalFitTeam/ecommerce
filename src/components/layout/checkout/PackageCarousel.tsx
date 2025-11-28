"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card"; // Ajusta el import según tu estructura real

// Interfaces (Mantenemos las tuyas)
export interface PackageOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  base_currency?: string;
  duration_days?: number;
}

interface Props {
  packages: PackageOption[];
  selectedPackageId: string | null;
  onSelectPackage: (pkgId: string) => void;
  itemsVisible?: number; // ✨ Nuevo: Hacemos esto configurable
}

// ✨ Sub-componente extraído (ver arriba para la explicación)
const PackageCard = ({
  pkg,
  isSelected,
  onClick,
}: {
  pkg: PackageOption;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Card
    className={`min-w-[220px] flex-1 cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50/10"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={onClick}
  >
    <CardHeader className="p-4 pb-2">
      <CardTitle className="text-sm font-semibold truncate" title={pkg.name}>
        {pkg.name}
      </CardTitle>
      {pkg.duration_days && (
        <CardDescription className="text-xs text-gray-500">
          Duration: {pkg.duration_days} days
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="p-4 pt-0">
      {pkg.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8 leading-4">
          {pkg.description}
        </p>
      )}
      <div className="font-bold text-gray-900 text-lg">
        ${pkg.price}{" "}
        <span className="text-xs font-normal text-gray-500">
          {pkg.base_currency}
        </span>
      </div>
    </CardContent>
  </Card>
);

export const PackageCarousel = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  itemsVisible = 3, // Valor por defecto
}: Props) => {
  const [startIndex, setStartIndex] = useState(0);

  // Lógica defensiva: Si no hay paquetes, no mostramos nada
  if (!packages || packages.length === 0) {return null;}

  // ✨ Mejora Lógica: Deslizar de 1 en 1 es más natural para el usuario que saltar bloques
  // Si prefieres saltar bloques, cambia el 1 por itemsVisible
  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));

  const handleNext = () => {
    setStartIndex((prev) => {
      // Evitamos pasarnos del final de la lista
      const maxIndex = packages.length - itemsVisible;
      return prev < maxIndex ? prev + 1 : prev;
    });
  };

  const visiblePackages = packages.slice(startIndex, startIndex + itemsVisible);

  // Estados derivados para deshabilitar botones
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + itemsVisible >= packages.length;

  return (
    <div className="space-y-3">
      {/* Header y Controles */}
      <div className="flex justify-between items-end">
        <div>
          <h4 className="font-medium text-gray-900 text-sm">
            Opciones adicionales
          </h4>
          <p className="text-xs text-gray-500">Desliza para ver más</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon" // Usamos size="icon" que es cuadrado perfecto en shadcn
            className="h-8 w-8"
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Ver anteriores" // Accesibilidad
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Ver siguientes"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="flex gap-4 overflow-hidden py-1">
        {visiblePackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onClick={() => onSelectPackage(pkg.id)}
          />
        ))}

        {/* State vacío para rellenar espacio si hay pocos items (opcional) */}
        {visiblePackages.length < itemsVisible &&
          Array.from({ length: itemsVisible - visiblePackages.length }).map(
            (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="min-w-[220px] flex-1 opacity-0"
              />
            ),
          )}
      </div>
    </div>
  );
};
