"use client";

import * as React from "react";
import { ServicePublicItem } from "@vitalfit/sdk";
import { ServiceBranchCard } from "./ServiceBranchCard";
import { ServiceCardSkeleton } from "./ServiceCardSkeleton";
import { useTranslations } from "next-intl";

interface BranchServicesSectionProps {
  services: ServicePublicItem[];
  isLoading: boolean;
  branchName?: string;
}

export function BranchServicesSection({
  services,
  isLoading,
  branchName,
}: BranchServicesSectionProps) {
  const t = useTranslations("BranchServices");
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading && services.length > 0) {
      if (isFirstRender) {
        setIsFirstRender(false);
        return;
      }

      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading, services, isFirstRender]);

  if (!isLoading && services.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-24 scroll-mt-10">
      <div className="flex flex-col mb-12 relative">
        <div className="flex items-center gap-4 mb-2">
          <span className="h-[2px] w-8 bg-primary rounded-full" />
          <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            {t("exclusiveOffer", { name: branchName ?? "" })}
          </p>
        </div>

        <h2 className="text-4xl md:text-5xl font-heading italic uppercase tracking-tighter text-slate-900 leading-none">
          {t.rich("title", {
            span: (chunks) => (
              <span className="text-slate-400 font-light not-italic text-3xl md:text-4xl">
                {chunks}
              </span>
            ),
          })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))
          : services.map((service) => (
              <div
                key={service.service_id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{
                  animationDelay: `${services.indexOf(service) * 100}ms`,
                }}
              >
                <ServiceBranchCard service={service} />
              </div>
            ))}
      </div>

      {!isLoading && services.length > 0 && (
        <div className="mt-16 flex justify-center">
          <div className="h-[1px] w-1/4 bg-slate-100" />
        </div>
      )}
    </section>
  );
}
