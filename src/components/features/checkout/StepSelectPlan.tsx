"use client";

import { useState, useMemo } from "react";
import {
  PackagePlus,
  CheckCircle2,
  MapPin,
  Lock,
  ChevronDown,
  Plus,
  Loader2,
  Sparkles,
  X,
  Dumbbell,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { PackageCarousel, PackageOption } from "./PackageCarousel";
import { MembershipSummary } from "./MembershipSummary";
import {
  BranchInfo,
  PublicMembershipResponse,
  ServicePublicItem,
} from "@vitalfit/sdk";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Props {
  data: PublicMembershipResponse | null;
  allMemberships?: PublicMembershipResponse[];
  onSelectMembership: (id: string | null) => void;
  packages: PackageOption[];
  selectedPackages: PackageOption[];
  togglePackage: (pkg: PackageOption) => void;
  services?: ServicePublicItem[];
  selectedServices?: ServicePublicItem[];
  toggleService?: (service: ServicePublicItem) => void;
  onRemoveMembership: () => void;
  branches: BranchInfo[];
  selectedBranch: string;
  onSelectBranch: (id: string) => void;
  invoiceData?: any;
  isLoadingServices?: boolean;
  hasMoreServices?: boolean;
  onLoadMoreServices?: () => void;
  isMember?: boolean;
  currencySymbol?: string;
}

export const StepSelectPlan = ({
  data,
  allMemberships = [],
  onSelectMembership,
  packages,
  selectedPackages,
  togglePackage,
  services = [],
  selectedServices = [],
  toggleService,
  onRemoveMembership,
  branches,
  selectedBranch,
  onSelectBranch,
  invoiceData,
  isLoadingServices,
  hasMoreServices,
  onLoadMoreServices,
  currencySymbol = "$",
  isMember = false,
}: Props) => {
  const t = useTranslations("Checkout.StepPlan");
  const [showPackages, setShowPackages] = useState<boolean>(
    selectedPackages.length > 0,
  );
  const [showServices, setShowServices] = useState<boolean>(
    selectedServices.length > 0,
  );
  const [skipMembership, setSkipMembership] = useState(false);

  const isLocked = !!invoiceData;

  const packageMap = useMemo(
    () => Object.fromEntries(packages.map((pkg) => [pkg.packageId, pkg])),
    [packages],
  );

  const formatPrice = (price: number = 0) =>
    price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className={cn(
          "bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all",
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
          <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-700">
            <SelectValue placeholder={t("branchPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {branches.map((b) => (
              <SelectItem key={b.branch_id} value={b.branch_id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          !selectedBranch && "opacity-40 pointer-events-none",
        )}
      >
        {!data ? (
          !skipMembership ? (
            <section className="bg-slate-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="p-3 bg-white text-orange-600 rounded-2xl shadow-sm">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 italic">
                      {t("membershipTitle")}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {t("membershipSubtitle")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSkipMembership(true)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-wider"
                >
                  {t("onlyServices")} <X size={14} className="ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allMemberships.map((membership) => (
                  <button
                    key={membership.membership_type_id}
                    onClick={() =>
                      onSelectMembership(String(membership.membership_type_id))
                    }
                    className="group flex flex-col p-6 rounded-3xl border border-white bg-white hover:border-orange-200 hover:shadow-xl transition-all text-left"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {membership.name}
                      </h4>
                      <Dumbbell
                        size={16}
                        className="text-orange-100 group-hover:text-orange-500 transition-colors"
                      />
                    </div>
                    <div className="mt-auto flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        $
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        {membership.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="flex justify-center animate-in fade-in slide-in-from-top-2">
              <Button
                variant="outline"
                onClick={() => setSkipMembership(false)}
                className="rounded-full h-10 text-[11px] font-bold uppercase border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
              >
                <Plus size={14} className="mr-2" /> {t("addMembershipBack")}
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 ml-1">
              {t("selectedPlanLabel")}
            </Label>
            <MembershipSummary plan={data} onRemove={onRemoveMembership} />
          </div>
        )}
      </div>

      <div
        className={cn(
          "space-y-10 transition-all duration-700",
          !selectedBranch
            ? "opacity-30 grayscale pointer-events-none scale-[0.98]"
            : "opacity-100",
        )}
      >
        {packages.length > 0 && (
          <section
            className={cn(
              "bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden",
              isLocked && "opacity-70",
            )}
          >
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 italic">
                    <PackagePlus size={20} className="text-orange-600" />
                    {isLocked
                      ? t("extraServicesTitleLocked")
                      : t("extraServicesTitle")}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    {t("extraServicesDesc")}
                  </p>
                </div>
                {!isLocked && (
                  <div className="w-full sm:w-72">
                    <Select
                      value={showPackages ? "yes" : "no"}
                      onValueChange={(val) => setShowPackages(val === "yes")}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border border-slate-200 bg-white font-medium">
                        <SelectValue placeholder={t("explorePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">{t("hidePackages")}</SelectItem>
                        <SelectItem value="yes">
                          {t("showPackages", { count: packages.length })}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {(showPackages || isLocked) && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                  <PackageCarousel
                    packages={packages}
                    selectedPackageIds={selectedPackages.map(
                      (p) => p.packageId,
                    )}
                    onSelectPackage={(pkgId) =>
                      !isLocked && togglePackage(packageMap[pkgId])
                    }
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {(services.length > 0 || isLoadingServices) && toggleService && (
          <section
            className={cn(
              "bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden",
              isLocked && "opacity-70",
            )}
          >
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 italic">
                    <Plus size={20} className="text-orange-600" />
                    {t("additionalServicesLabel")}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md font-medium">
                    {t("additionalServicesDesc")}
                  </p>
                </div>

                {!isLocked && (
                  <div className="w-full sm:w-72">
                    <Select
                      value={showServices ? "yes" : "no"}
                      onValueChange={(val) => setShowServices(val === "yes")}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border border-slate-200 bg-white font-medium">
                        <SelectValue placeholder={t("explorePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">{t("hideServices")}</SelectItem>
                        <SelectItem value="yes">{t("showServices")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {(showServices || isLocked) && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => {
                      const isSelected = selectedServices.some(
                        (s) => s.service_id === service.service_id,
                      );
                      const userHasMembership = !!data || isMember;
                      const servicePrice = userHasMembership
                        ? Number(service.lowest_price_member)
                        : Number(service.lowest_price_no_member);

                      return (
                        <button
                          key={service.service_id}
                          disabled={isLocked}
                          onClick={() => toggleService(service)}
                          className={cn(
                            "relative text-left group p-5 rounded-3xl border transition-all duration-300",
                            isSelected
                              ? "bg-orange-50 border-orange-200 shadow-md ring-1 ring-orange-200"
                              : "bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-xl",
                            isLocked && "cursor-default opacity-80",
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div
                              className={cn(
                                "p-2.5 rounded-xl transition-all",
                                isSelected
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-white text-slate-400 group-hover:text-orange-500 group-hover:scale-110",
                              )}
                            >
                              <Plus size={18} />
                            </div>
                            {isSelected && (
                              <CheckCircle2
                                size={20}
                                className="text-orange-600 animate-in zoom-in"
                              />
                            )}
                          </div>

                          <h4 className="font-bold text-slate-900 text-[13px] mb-1 leading-tight group-hover:text-orange-700 transition-colors">
                            {service.name}
                          </h4>

                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              $
                            </span>
                            <span className="text-lg font-black text-slate-900">
                              {servicePrice === 0
                                ? t("free")
                                : formatPrice(servicePrice)}
                            </span>
                          </div>

                          {!userHasMembership &&
                            Number(service.lowest_price_member) <
                              Number(service.lowest_price_no_member) && (
                              <p className="text-[9px] font-bold text-orange-400 mt-2 uppercase tracking-tighter italic">
                                {t("saveWithMembership")}
                              </p>
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {hasMoreServices && !isLocked && (
                    <div className="flex justify-center pt-6 border-t border-slate-50">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onLoadMoreServices}
                        disabled={isLoadingServices}
                        className="rounded-2xl border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 font-bold gap-2 min-w-[220px] transition-all"
                      >
                        {isLoadingServices ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            {t("loading")}
                          </>
                        ) : (
                          <>
                            {t("loadMoreServices")} <ChevronDown size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
