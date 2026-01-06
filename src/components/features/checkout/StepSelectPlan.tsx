"use client";

import { useState, useMemo } from "react";
import { PackagePlus, CheckCircle2, MapPin, Lock } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { PackageCarousel, PackageOption } from "./PackageCarousel";
import { MembershipSummary } from "./MembershipSummary";
import { BranchInfo, PublicMembershipResponse } from "@vitalfit/sdk";
import { Label } from "@/components/ui/Label";
import { NoMembershipPlaceholder } from "./NoMembershipPlaceholder";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  data: PublicMembershipResponse | undefined;
  selectedPackages: PackageOption[];
  togglePackage: (pkg: PackageOption) => void;
  packages: PackageOption[];
  onRemoveMembership: () => void;
  branches: BranchInfo[];
  selectedBranch: string;
  onSelectBranch: (id: string) => void;
  invoiceData?: any;
}

export const StepSelectPlan = ({
  data,
  selectedPackages,
  togglePackage,
  packages,
  onRemoveMembership,
  branches,
  selectedBranch,
  onSelectBranch,
  invoiceData,
}: Props) => {
  const t = useTranslations("Checkout.StepPlan");
  const [showCarousel, setShowCarousel] = useState<boolean>(
    selectedPackages.length > 0,
  );

  const isLocked = !!invoiceData;

  const packageMap = useMemo(
    () => Object.fromEntries(packages.map((pkg) => [pkg.packageId, pkg])),
    [packages],
  );

  if (!data) {
    return <NoMembershipPlaceholder />;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className={cn(
          "bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all",
          isLocked && "opacity-70",
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin
              size={16}
              className={isLocked ? "text-slate-400" : "text-orange-500"}
            />
            <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {t("branchLabel")}
            </Label>
          </div>

          {isLocked && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Lock size={11} /> {t("confirmed")}
            </span>
          )}
        </div>

        <Select
          value={selectedBranch}
          onValueChange={onSelectBranch}
          disabled={isLocked}
        >
          <SelectTrigger
            className={cn(
              "h-14 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 transition-all",
              !isLocked && "focus:ring-2 focus:ring-orange-400/30",
              isLocked && "bg-slate-100 cursor-not-allowed",
            )}
          >
            <SelectValue placeholder={t("branchPlaceholder")} />
          </SelectTrigger>

          <SelectContent className="rounded-xl shadow-xl border-slate-100 bg-white">
            {branches.map((b) => (
              <SelectItem
                key={b.branch_id}
                value={b.branch_id}
                className="py-2.5 text-sm font-medium rounded-lg cursor-pointer"
              >
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 ml-1">
          {t("basePlanLabel")}
        </Label>

        <MembershipSummary plan={data} onRemove={onRemoveMembership} />
      </div>

      {packages.length > 0 && (
        <section
          className={cn(
            "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all",
            isLocked && "opacity-70 grayscale-[0.3]",
          )}
        >
          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <PackagePlus
                    size={20}
                    className={isLocked ? "text-slate-400" : "text-orange-600"}
                  />
                  {isLocked
                    ? t("extraServicesTitleLocked")
                    : t("extraServicesTitle")}
                </h3>

                <p className="text-sm text-slate-500 max-w-md">
                  {isLocked
                    ? t("extraServicesDescLocked")
                    : t("extraServicesDesc")}
                </p>
              </div>

              {!isLocked && (
                <div className="w-full sm:w-72">
                  <Select
                    value={showCarousel ? "yes" : "no"}
                    onValueChange={(val) => setShowCarousel(val === "yes")}
                  >
                    <SelectTrigger className="w-full h-11 rounded-xl border border-slate-200 bg-white font-medium">
                      <SelectValue placeholder={t("explorePlaceholder")} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="no">{t("onlyBasePlan")}</SelectItem>
                      <SelectItem value="yes">
                        {t("viewExtraServices", { count: packages.length })}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {(showCarousel || isLocked) && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                {selectedPackages.length > 0 && (
                  <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedPackages.map((pkg) => (
                      <span
                        key={pkg.packageId}
                        className={cn(
                          "text-[11px] font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 shrink-0",
                          isLocked
                            ? "bg-slate-50 text-slate-500 border-slate-200"
                            : "bg-orange-50 text-orange-700 border-orange-100",
                        )}
                      >
                        <CheckCircle2 size={12} />
                        {pkg.name || pkg.packageId}
                      </span>
                    ))}
                  </div>
                )}

                {!isLocked && (
                  <PackageCarousel
                    packages={packages}
                    selectedPackageIds={selectedPackages.map(
                      (p) => p.packageId,
                    )}
                    onSelectPackage={(pkgId) =>
                      togglePackage(packageMap[pkgId])
                    }
                  />
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
