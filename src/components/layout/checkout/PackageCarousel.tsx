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
}

export const PackageCarousel = ({
  packages,
  selectedPackageId,
  onSelectPackage,
}: Props) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, packages.length - visibleCount),
    );

  const visiblePackages = packages.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Paquetes adicionales</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={startIndex + visibleCount >= packages.length}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none">
        {visiblePackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`min-w-[220px] cursor-pointer border ${
              selectedPackageId === pkg.id
                ? "border-orange-500"
                : "border-gray-200"
            }`}
            onClick={() => onSelectPackage(pkg.id)}
          >
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                {pkg.name}
              </CardTitle>
              {pkg.duration_days && (
                <CardDescription className="text-xs text-gray-500">
                  {pkg.duration_days} días
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {pkg.description && (
                <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
              )}
              <p className="font-semibold text-gray-900">
                ${pkg.price} {pkg.base_currency || ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
