"use client";

import { Input } from "@/components/ui/Input";
import { BranchCardInfo } from "./BranchCardInfo";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
const MapboxPicker = dynamic(() => import("@/components/ui/MapboxPicker"), {
  ssr: false,
});

export default function FindBranch() {
  const branches = [
    {
      title: "VITALFIT ESPAÑA",
      location: "Calle Gran Vía, 28013 Madrid",
      phone: "+34 91 523 4567",
      hours: "Lunes - Viernes: 6:00 am - 9:00 pm",
    },
    {
      title: "VITALFIT VENEZUELA",
      location: "Av. Universidad, Caracas",
      phone: "+58 212-5555555",
      hours: "Lunes - Viernes: 6:00 am - 8:00 pm",
    },
    {
      title: "VITALFIT CHILE",
      location: "Av. Apoquindo, Las Condes, Santiago",
      phone: "+56 9 8765 4321",
      hours: "Lunes - Viernes: 6:00 am - 9:00 pm",
    },
  ];

  return (
    <>
      <section className="py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold md:text-left text-center mb-4">
            <span className="text-black">ENCUENTRA TU SUCURSAL</span>
          </h1>
          <p className="text-center text-gray-600 w-full mx-auto">
            Usa el mapa o la barra de busqueda para para localizar nuestras
            sucursales
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto mt-5 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-6 mb-3">
            <div className="w-full md:w-1/3 md:text-left text-center">
              <Input placeholder="Buscar sucursal..." />
              <Button className="mt-2 ">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Encontrar la más cercana
              </Button>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-6">
              {branches.map((branch, index) => (
                <BranchCardInfo key={index} {...branch} />
              ))}
            </div>

            <div className="w-full md:w-2/3 bg-gray-300 rounded-lg flex items-center justify-center">
              <MapboxPicker />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
