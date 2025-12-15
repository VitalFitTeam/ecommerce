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
} from "@/components/ui/Card";

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
  itemsVisible?: number;
}

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
        ${pkg.price}
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
  itemsVisible = 3,
}: Props) => {
  const [startIndex, setStartIndex] = useState(0);

  if (!packages || packages.length === 0) {
    return null;
  }

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));

  const handleNext = () => {
    setStartIndex((prev) => {
      const maxIndex = packages.length - itemsVisible;
      return prev < maxIndex ? prev + 1 : prev;
    });
  };

  const visiblePackages = packages.slice(startIndex, startIndex + itemsVisible);

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + itemsVisible >= packages.length;

  return (
    <div className="space-y-3">
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
            size="icon"
            className="h-8 w-8"
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Ver anteriores"
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

      <div className="flex gap-4 overflow-hidden py-1">
        {visiblePackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onClick={() => onSelectPackage(pkg.id)}
          />
        ))}

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
