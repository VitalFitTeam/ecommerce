"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface PackageOption {
  packageId: string;
  name: string;
  description?: string;
  price: number;
  ref_price?: number;
  base_currency?: string;
  duration_days?: number;
}

interface Props {
  packages: PackageOption[];
  selectedPackageIds: string[];
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
}) => {
  const t = useTranslations("Checkout.PackageCarousel");

  return (
    <Card
      className={cn(
        "min-w-0 w-full flex-1 cursor-pointer transition-all duration-500 relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border-2",
        isSelected
          ? "border-orange-500 bg-orange-50/40 shadow-2xl shadow-orange-500/20 sm:scale-[1.03]"
          : "border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 bg-white",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute top-4 right-4 sm:top-5 sm:right-5 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-md",
          isSelected
            ? "bg-orange-500 text-white scale-110 rotate-0"
            : "bg-slate-100 text-slate-300 scale-75 opacity-0 sm:group-hover:opacity-100",
        )}
      >
        <Check size={16} className="sm:w-[18px]" strokeWidth={4} />
      </div>

      <CardHeader className="p-5 sm:p-8 pb-3 sm:pb-4">
        <div className="space-y-1.5 sm:space-y-2">
          <CardTitle
            className={cn(
              "text-lg sm:text-xl font-black tracking-tighter transition-colors duration-300 uppercase italic",
              isSelected ? "text-orange-600" : "text-slate-900",
            )}
          >
            {pkg.name}
          </CardTitle>

          {pkg.duration_days && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full animate-pulse",
                  isSelected ? "bg-orange-500" : "bg-emerald-500",
                )}
              />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
                {t("accessDays", { days: pkg.duration_days })}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-8 pt-0">
        <div className="min-h-[40px] sm:min-h-[60px] mb-4 sm:mb-8">
          {pkg.description && (
            <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 italic">
              {pkg.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-0.5 sm:gap-1">
          <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t("investmentLabel")}
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span
              className={cn(
                "text-2xl sm:text-4xl font-black tracking-tighter transition-colors",
                isSelected ? "text-orange-600" : "text-slate-900",
              )}
            >
              $
              {Number(pkg.price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase">
              {pkg.base_currency || "USD"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PackageCarousel = ({
  packages,
  selectedPackageIds = [],
  onSelectPackage,
  itemsVisible = 3,
}: Props) => {
  const t = useTranslations("Checkout.PackageCarousel");
  const [itemsToDisplay, setItemsToDisplay] = useState(3);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const updateItems = () => {
      let newItemsToDisplay;

      if (window.innerWidth < 640) {
        newItemsToDisplay = 1;
      } else if (window.innerWidth < 1024) {
        newItemsToDisplay = 2;
      } else {
        newItemsToDisplay = itemsVisible;
      }

      if (itemsToDisplay !== newItemsToDisplay) {
        setItemsToDisplay(newItemsToDisplay);
        setStartIndex(0);
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, [itemsVisible]);

  if (!packages || packages.length === 0) {
    return null;
  }

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => {
    setStartIndex((prev) => {
      const maxIndex = packages.length - itemsToDisplay;
      return prev < maxIndex ? prev + 1 : prev;
    });
  };

  const visiblePackages = packages.slice(
    startIndex,
    startIndex + itemsToDisplay,
  );
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + itemsToDisplay >= packages.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">
            {t("title")}
          </h4>
          <p className="text-[11px] font-medium text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {packages.length > itemsToDisplay && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all active:scale-90"
              onClick={handlePrev}
              disabled={isPrevDisabled}
            >
              <ChevronLeft size={16} className="text-slate-600 sm:w-[18px]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all active:scale-90"
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              <ChevronRight size={16} className="text-slate-600 sm:w-[18px]" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-4 overflow-hidden py-3 px-1 transition-all duration-500">
        {visiblePackages.map((pkg) => (
          <div
            key={pkg.packageId}
            className="w-full flex-none transition-all duration-500 animate-in fade-in zoom-in-95"
            style={{
              width: `calc(${100 / itemsToDisplay}% - ${
                (16 * (itemsToDisplay - 1)) / itemsToDisplay
              }px)`,
            }}
          >
            <PackageCard
              pkg={pkg}
              isSelected={selectedPackageIds.includes(pkg.packageId)}
              onClick={() => onSelectPackage(pkg.packageId)}
            />
          </div>
        ))}
        {visiblePackages.length < itemsToDisplay &&
          Array.from({ length: itemsToDisplay - visiblePackages.length }).map(
            (_, i) => (
              <div key={`placeholder-${i}`} className="flex-1 invisible" />
            ),
          )}
      </div>
    </div>
  );
};
