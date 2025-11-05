"use client";

import { Input } from "@/components/ui/Input";
import { BranchCardInfo } from "./BranchCardInfo";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";

const MapboxPicker = dynamic(() => import("@/components/ui/MapboxPicker"), {
  ssr: false,
});

export type BranchMapData = {
  address: string;
  branch_id: string;
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
};

export default function FindBranch() {
  const t = useTranslations("FindBranchPage");
  const [mapBranches, setMapBranches] = useState<BranchMapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMapBranches() {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/public/branches-map`);

        if (!response.ok) {
          throw new Error(
            `Error al obtener las sucursales: ${response.status} ${response.statusText}`,
          );
        }

        const data: { data: BranchMapData[] } = await response.json();
        setMapBranches(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          "No pudimos cargar las ubicaciones del mapa. Verifica la URL de la API.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchMapBranches();
  }, []);

  const validBranches = useMemo(() => {
    return mapBranches
      .filter((branch) => {
        const isValid =
          typeof branch.latitude === "number" &&
          typeof branch.longitude === "number" &&
          !(branch.latitude === 0 && branch.longitude === 0);
        return isValid;
      })
      .map((branch) => ({
        title: branch.name,
        location: branch.address,
        phone: branch.phone,
      }));
  }, [mapBranches, t]);

  return (
    <>
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold md:text-left text-center mb-2 text-gray-900">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 w-full md:w-2/3 mx-auto md:mx-0 text-center md:text-left">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="px-6 bg-white">
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={t("search_placeholder")}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 text-base">
                <MagnifyingGlassIcon className="w-5 h-5" />
                {t("find_nearest_button")}
              </Button>
            </div>

            <div className="hidden md:block md:w-2/3" />
          </div>
          {/* Fila de Sucursales y Mapa */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-4">
              {" "}
              {isLoading && (
                <div className="p-4 bg-white rounded-lg shadow-md text-center text-orange-600 font-semibold flex items-center justify-center">
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  {t("loading_branches")}{" "}
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-md text-center text-red-700 font-medium">
                  🚨 {t("error_loading_branches")}{" "}
                </div>
              )}
              {!isLoading &&
                !error &&
                validBranches.map((branch, index) => (
                  <BranchCardInfo
                    key={index}
                    title={branch.title}
                    location={branch.location}
                    phone={branch.phone}
                  />
                ))}
              {!isLoading &&
                !error &&
                validBranches.length === 0 &&
                mapBranches.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md text-center text-yellow-700 font-medium">
                    {t("no_valid_branches_found")}
                  </div>
                )}
            </div>
            <div className="w-full md:w-2/3 rounded-xl shadow-lg overflow-hidden min-h-[550px]">
              <MapboxPicker branches={mapBranches} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
