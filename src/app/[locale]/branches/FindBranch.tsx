"use client";

import { Input } from "@/components/ui/Input";
import { BranchCardInfo } from "./BranchCardInfo";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
const MapboxPicker = dynamic(() => import("@/components/ui/MapboxPicker"), {
  ssr: false,
});

export default function FindBranch() {
  const t = useTranslations("FindBranchPage");

  const branches = [
    {
      title: "VITALFIT ESPAÑA",
      location: "Calle Gran Vía, 28013 Madrid",
      phone: "+34 91 523 4567",
      hours: t("branch_hours_spain"),
    },
    {
      title: "VITALFIT VENEZUELA",
      location: "Av. Universidad, Caracas",
      phone: "+58 212-5555555",
      hours: t("branch_hours_venezuela"),
    },
    {
      title: "VITALFIT CHILE",
      location: "Av. Apoquindo, Las Condes, Santiago",
      phone: "+56 9 8765 4321",
      hours: t("branch_hours_chile"),
    },
  ];

  return (
    <>
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold md:text-left text-center mb-3">
            <span className="text-gray-900">{t("title")}</span>
          </h1>
          <p className="text-lg text-gray-500 w-full md:w-2/3 mx-auto md:mx-0 text-center md:text-left">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center md:items-start">
            <div className="w-full md:w-1/3 space-y-3">
              <Input
                placeholder={t("search_placeholder")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
              />
              <Button className="w-full bg-orange-400 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5" />
                {t("find_nearest_button")}
              </Button>
            </div>

            <div className="hidden md:block md:w-2/3" />
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-6">
              {branches.map((branch, index) => (
                <BranchCardInfo key={index} {...branch} />
              ))}
            </div>

            <div className="w-full md:w-2/3 bg-gray-100 rounded-xl shadow-xl overflow-hidden min-h-[550px]">
              <MapboxPicker />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
