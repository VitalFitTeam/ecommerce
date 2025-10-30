"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServicesCard";
import ServiceModal from "@/components/services/ServiceModal";
import SearchInput from "@/components/ui/SearchInput";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";

export default function ServicesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    rating: "",
  });

  // Estado para controlar el modal
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const services = [
    {
      id: 1,
      title: "Yoga",
      description:
        "Encuentra tu paz interior y mejora tu flexibilidad con nuestras clases de yoga para todos los niveles.",
      price: 25,
      rating: 5,
      image: "/images/services/yoga_services.jpg",
    },
    {
      id: 2,
      title: "CrossFit",
      description:
        "Desafía tus límites con nuestros entrenamientos de alta intensidad que combinan fuerza y cardio.",
      price: 50,
      rating: 4.8,
      image: "/images/services/crossfit_services.jpg",
    },
    {
      id: 3,
      title: "Spinning",
      description:
        "Pedalea al ritmo de la música y quema calorías en nuestras enérgicas clases de spinning.",
      price: 50,
      rating: 4.5,
      image: "/images/services/spinning_services.jpg",
    },
  ];

  const handleClearFilters = () => {
    setFilters({ name: "", category: "", rating: "" });
  };

  return (
    <>
      <Navbar />

      <section className="pt-28 pb-10 px-6 bg-gray-50 min-h-screen">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-center text-5xl md:text-6xl font-bold mb-5">
            <span className="text-[#F27F2A]">NUESTROS</span> SERVICIOS
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mt-2">
            Explora la variedad de clases que ofrecemos para ayudarte a alcanzar
            tus metas de fitness.
          </p>
        </div>

        {/* Filtros */}
        <div className="hidden md:flex w-full flex-wrap items-center justify-between gap-4 mb-10">
          {/* Grupo de búsqueda y selects */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 flex-1 min-w-[250px]">
            {/* Campo de búsqueda */}
            <div className="w-full sm:w-[900px] md:w-[400px]">
              <SearchInput
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>

            <select
              value={filters.rating}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, rating: e.target.value }))
              }
              className="w-50 md:w-60 px-3 py-2 border border-[#A4A4A4] rounded-lg focus:border-[#F27F2A] focus:ring-[#F27F2A] focus:outline-none text-gray-700 text-sm"
            >
              <option value="">Rating</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-50 md:w-60 px-3 py-2 border border-[#A4A4A4] rounded-lg focus:border-[#F27F2A] focus:ring-[#F27F2A] focus:outline-none text-gray-700 text-sm"
            >
              <option value="">Categoría</option>
            </select>
          </div>

          {/* Grupo de vista y borrar filtros */}
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 w-full md:w-auto">
            <span className="text-gray-600 font-bold mr-3 text-base">
              Vista:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md border text-sm mr-4 cursor-pointer ${
                  view === "grid"
                    ? "bg-[#F27F2A] text-white border-[#F27F2A]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
                Cuadrícula
              </button>

              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md border mr-4 text-sm cursor-pointer ${
                  view === "list"
                    ? "bg-[#F27F2A] text-white border-[#F27F2A]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
                Lista
              </button>
            </div>

            {/* Borrar filtros */}
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-gray-600 font-bold text-base hover:text-[#F27F2A] transition cursor-pointer"
            >
              Borrar filtros
            </button>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full h-[1px] bg-gray-300 mb-10" />

        {/* Renderizado dinámico */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                view="grid"
                onLearnMore={() => handleOpenModal(service)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                view="list"
                onLearnMore={() => handleOpenModal(service)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </>
  );
}
