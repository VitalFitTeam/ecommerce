"use client";

import { Navbar } from "@/components/layout/Navbar";
import { BranchCard } from "./BranchCard";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/layout/Footer";
import { MapPinIcon } from "lucide-react";
import { useState } from "react";
import FindBranch from "./FindBranch";
import { useTranslations } from "next-intl";

export default function Branches() {
  const [showSucursales, setShowSucursales] = useState(false);

  const branches = [
    {
      title: "VITALFIT ESPAÑA",
      image: "/images/gym-training-spain.png",
      location: "Calle Gran Vía, 28013 Madrid",
      phone: "+34 91 523 4567",
      hours: "Lunes - Viernes: 6:00 am - 9:00 pm",
      services: ["WiFi", "Estacionamiento", "Sauna", "Piscina"],
    },
    {
      title: "VITALFIT VENEZUELA",
      image: "/images/gym-training-venezuela.png",
      location: "Av. Universidad, Caracas",
      phone: "+58 212-5555555",
      hours: "Lunes - Viernes: 6:00 am - 8:00 pm",
      services: ["Gimnasio", "Entrenamiento Personal", "Nutrición"],
      featured: true,
    },
    {
      title: "VITALFIT CHILE",
      image: "/images/gym-training-chile.png",
      location: "Av. Apoquindo, Las Condes, Santiago",
      phone: "+56 9 8765 4321",
      hours: "Lunes - Viernes: 6:00 am - 9:00 pm",
      services: ["CrossFit zona", "Entrenamiento", "Nutrición"],
    },
  ];

  const viewBranches = () => {
    setShowSucursales(true);
  };

  const t = useTranslations("BranchesPage");
  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />
      {showSucursales && <FindBranch />};
      {!showSucursales && (
        <>
          <section className="bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                {t.rich("title", {
                  highlight: (chunks) => (
                    <span className="text-orange-500">{chunks}</span>
                  ),
                  "highlight-dark": (chunks) => (
                    <span className="text-gray-900">{chunks}</span>
                  ),
                })}
              </h1>
              <p className="text-center text-gray-600 w-full mx-auto">
                {t("subtitle")}
              </p>
            </div>
          </section>

          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 mx-4">
                  {branches.map((branch, index) => (
                    <BranchCard key={index} {...branch} />
                  ))}
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    viewBranches();
                  }}
                  className="bg-primary hover:bg-orange-600 text-white px-8 py-2 rounded-full"
                >
                  <MapPinIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  {t("viewButton")}
                </Button>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed">
                {t("footerQuote")}
              </p>
            </div>
          </section>
        </>
      )}
      <Footer />
    </main>
  );
}
