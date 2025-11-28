"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServicesCard";
import ServiceModal from "@/components/services/ServiceModal";
import SearchInput from "@/components/ui/SearchInput";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { api } from "@/lib/sdk-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });
  const [maxPrice, setMaxPrice] = useState<number>();
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [sortBy] = useState<"price">("price");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const currency = "USD";

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", category: "" });
    setMaxPrice(undefined);
    setSort("desc");
    setPage(1);
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search: filters.search,
        category: filters.category,
        currency,
        sortby: sortBy,
        sort,
      };

      if (maxPrice !== undefined && maxPrice !== null) {
        params.price = maxPrice;
      }

      const response = await api.public.getServices(params);

      setServices(response.data || []);
      setTotalPages(
        Math.ceil((response.total || response.data.length || 0) / limit),
      );
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, sort, sortBy, currency, maxPrice]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <>
      <Navbar />

      <section className="pt-28 pb-10 px-6 bg-gray-50 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-5">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-[#F27F2A]">{chunks}</span>
              ),
            })}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mt-2">
            {t("subtitle")}
          </p>
        </div>
        <div className="hidden md:flex w-full flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <div className="w-full sm:w-[900px] md:w-[400px]">
              <SearchInput
                placeholder={t("filters.searchPlaceholder")}
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-50 md:w-60 px-3 py-2 border rounded-lg text-sm text-gray-700"
            >
              <option value="">{t("filters.categoryDefault")}</option>

              {[
                ...new Map(
                  services.map((s) => [
                    s.service_category?.category_id,
                    s.service_category,
                  ]),
                ),
              ].map(([id, cat]: any) => (
                <option key={id} value={id}>
                  {cat?.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder={t("filters.maxPrice")}
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-40 px-3 py-2 border rounded-lg text-sm text-gray-700"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "asc" | "desc")}
              className="w-40 px-3 py-2 border rounded-lg text-sm text-gray-700"
            >
              <option value="desc">{t("filters.sortDesc")}</option>
              <option value="asc">{t("filters.sortAsc")}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-bold">
              {t("filters.viewLabel")}
            </span>

            <Button
              onClick={() => setView("grid")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${
                view === "grid"
                  ? "bg-[#F27F2A] text-white border-[#F27F2A]"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
              {t("filters.viewGrid")}
            </Button>

            <Button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${
                view === "list"
                  ? "bg-[#F27F2A] text-white border-[#F27F2A]"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
              {t("filters.viewList")}
            </Button>

            <Button onClick={handleClearFilters} variant="outline">
              {t("filters.clear")}
            </Button>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-300 mb-10" />
        {loading ? (
          <p className="text-center text-gray-500">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No hay servicios</p>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }
          >
            {services.map((service) => (
              <ServiceCard
                key={service.service_id}
                service={service}
                view={view}
                onLearnMore={() => handleOpenModal(service)}
              />
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8 gap-4">
          <Button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            variant="ghost"
          >
            Anterior
          </Button>

          <span className="px-4 py-2">
            {page} / {totalPages}
          </span>

          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="ghost"
          >
            Siguiente
          </Button>
        </div>
      </section>

      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </>
  );
}
