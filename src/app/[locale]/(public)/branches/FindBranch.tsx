"use client";

import { Input } from "@/components/ui/Input";
import { BranchCardInfo } from "./BranchCardInfo";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const MapboxPicker = dynamic(() => import("@/components/ui/MapboxPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex flex-col items-center justify-center text-gray-400 gap-2">
      <MapPinIcon className="w-8 h-8 opacity-50" />
      <span>Cargando mapa...</span>
    </div>
  ),
});

export type BranchMapData = {
  address: string;
  branch_id: string;
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
};

type FindBranchProps = {
  initialBranches: BranchMapData[];
};

export default function FindBranch({ initialBranches }: FindBranchProps) {
  const t = useTranslations("FindBranchPage");

  const [mapBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<BranchMapData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);

  const cardsPerPage = 3;

  const validBranches = useMemo(
    () =>
      mapBranches
        .filter(
          (b) =>
            typeof b.latitude === "number" &&
            typeof b.longitude === "number" &&
            !(b.latitude === 0 && b.longitude === 0),
        )
        .map((b) => ({
          title: b.name,
          location: b.address,
          phone: b.phone,
        })),
    [mapBranches],
  );

  const totalPages = Math.ceil(validBranches.length / cardsPerPage);

  const currentBranches = validBranches.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage,
  );

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col">
      <section className="py-8 px-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 uppercase">
            {t("title")}
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-6 py-6 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full lg:w-1/3 xl:w-[380px] flex flex-col gap-5">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={t("search_placeholder")}
                  className="w-full h-11 pl-10 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <Button className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm">
                <MapPinIcon className="w-5 h-5" />
                {t("find_nearest_button")}
              </Button>
            </div>

            <div className="space-y-4">
              {!validBranches.length && (
                <div className="p-8 bg-white border border-dashed rounded-xl text-center text-gray-500">
                  {t("no_valid_branches_found")}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {currentBranches.map((branch) => (
                  <BranchCardInfo
                    key={branch.title}
                    title={branch.title}
                    location={branch.location}
                    phone={branch.phone}
                    onClick={() =>
                      setSelectedBranch(
                        mapBranches.find((b) => b.name === branch.title) ||
                          null,
                      )
                    }
                  />
                ))}
              </div>

              {validBranches.length > 0 && (
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border shadow-sm">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-orange-500 disabled:opacity-30"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </Button>

                  <span className="text-xs font-semibold text-gray-600">
                    Página {currentPage + 1} de {totalPages}
                  </span>

                  <Button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-orange-500 disabled:opacity-30"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-2/3">
            <div
              className="
                h-[320px] 
                md:h-[400px] 
                lg:h-[calc(100vh-180px)] 
                xl:h-[calc(100vh-150px)]
                lg:sticky lg:top-6 
                rounded-2xl overflow-hidden shadow-xl border bg-gray-100
              "
            >
              <MapboxPicker
                branches={mapBranches}
                isLoading={false}
                selectedBranch={selectedBranch}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
