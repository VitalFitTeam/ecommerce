"use client";

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MembershipDetail() {
  const membership = {
    name: "PLAN FULL",
    price: 60,
    duration_days: 30,
    services: [
      "Gimnasio",
      "Piscina",
      "Clases Premium",
      "Clase Personalizada",
      "Yoga",
    ],
    benefits: [
      "Acceso ilimitado a todas las áreas del gimnasio incluyendo al área de Yoga.",
      "6 clases premium al mes incluyendo spinning.",
      "Sala exclusiva para entrenamiento personal.",
      "Descuento en productos y eventos especiales.",
    ],
    branches: [
      { name: "Sucursal Centro", status: "Disponible" },
      { name: "Sucursal Norte", status: "No Disponible" },
      { name: "Sucursal Sur", status: "Disponible" },
    ],
    restrictions:
      "Cancelación requieren notificación 30 días antes de la fecha de renovación.",
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />

      {/* Imagen fija con radio */}
      <section className="w-full h-[320px] relative overflow-hidden px-6 pt-6">
        <div className="w-full h-full rounded-[20px] overflow-hidden relative">
          <Image
            src="/images/detallefit.png"
            alt="Detalle Membresía"
            fill
            className="object-cover"
            style={{ borderRadius: "20px" }}
          />
        </div>
      </section>

      {/* Contenido principal */}
      <section className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Columna Izquierda */}
        <div>
          <h1 className="text-[96px] font-bold leading-none">
            <span className="text-[#F27F2A]">Plan</span>{" "}
            <span className="text-black">Full</span>
          </h1>

          <p className="text-[15px] text-[#0F172A] mt-4">
            Ideal para personas que buscan acceso completo a todos los servicios
            Premium.
          </p>

          <p className="text-6xl font-extrabold text-black mt-6">
            ${membership.price}/MES
          </p>
          <p className="text-[15px] text-[#0F172A] mt-2">
            Con renovación automática
          </p>

          <Button className="bg-[#F27F2A] text-white mt-6 w-[265px] h-[39px] rounded-md hover:bg-orange-700">
            Comprar Membresía
          </Button>

          <h2 className="text-[30px] text-black font-bold mt-10">
            Servicios incluidos
          </h2>
          <ul className="mt-4 space-y-2">
            {membership.services.map((s, i) => (
              <li key={i} className="text-[15px] text-[#0F172A]">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna Derecha */}
        <div>
          <h3 className="text-[30px] font-bold mb-4">Beneficios</h3>
          <ul className="list-disc pl-6 mb-6">
            {membership.benefits.map((b, i) => (
              <li key={i} className="text-[15px] text-[#0F172A] mb-2">
                {b}
              </li>
            ))}
          </ul>

          <h3 className="text-[30px] font-bold mb-4">
            Disponibilidad por sucursales
          </h3>
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-[15px] font-bold text-[#0F172A] px-2">
                  Sucursal
                </th>
                <th className="text-left text-[15px] font-bold text-[#0F172A] px-2">
                  Estatus
                </th>
              </tr>
            </thead>
            <tbody>
              {membership.branches.map((branch, i) => (
                <tr key={i}>
                  <td className="text-[15px] text-[#0F172A] px-2">
                    {branch.name}
                  </td>
                  <td
                    className={`text-[15px] font-bold px-2 ${
                      branch.status === "Disponible"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {branch.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-[30px] font-bold mt-10 mb-4">Restricciones</h3>
          <p className="text-[15px] text-[#0F172A]">
            {membership.restrictions}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
