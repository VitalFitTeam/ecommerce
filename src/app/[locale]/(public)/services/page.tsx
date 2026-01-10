"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServicesCard";
import ServiceModal from "@/components/services/ServiceModal";
import SearchInput from "@/components/ui/SearchInput";
import {
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { api } from "@/lib/sdk-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { RecentServicesCarousel } from "@/components/services/RecentServicesCarousel";
import { useWishlist } from "@/hooks/useWishlist";
import { mainCurrencies } from "@vitalfit/sdk";

const ServiceSkeleton = ({ view }: { view: "grid" | "list" }) => (
  <div
    className={cn(
      "animate-pulse bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm",
      view === "list" ? "flex h-40" : "h-[330px]",
    )}
  >
    <div
      className={cn(
        "bg-gray-200",
        view === "list" ? "w-48 h-full" : "w-full h-40",
      )}
    />
    <div className="p-4 flex-1 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-10 bg-gray-200 rounded mt-4" />
    </div>
  </div>
);

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    const storedView = localStorage.getItem("services_view_mode");
    if (storedView === "grid" || storedView === "list") {
      setView(storedView);
    }
  }, []);

  const changeView = (newView: "grid" | "list") => {
    setView(newView);
    localStorage.setItem("services_view_mode", newView);
  };

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  const { wishlistItems, toggleFavorite } = useWishlist();
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchServices = useCallback(async () => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params: any = {
        page,
        limit,
        search: filters.search,
        category: filters.category,
        currency,
        sortby: "price",
        sort,
      };

      if (maxPrice !== "") {
        params.price = Number(maxPrice);
      }

      const response = await api.public.getServices(params);
      const newData = response.data || [];

      setServices((prev) => (page === 1 ? newData : [...prev, ...newData]));
      setTotalPages(
        Math.ceil((response.total || response.data.length || 0) / limit),
      );
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingMore(false);
      }, 300);
    }
  }, [page, filters, sort, maxPrice, currency]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          page < totalPages
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, maxPrice, currency]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("recent_services") || "[]",
      );
      setRecentServices(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (services.length > 0 && recentServices.length > 0) {
      let changed = false;
      const updatedRecent = recentServices.map((rs) => {
        const fresh = services.find((s) => s.service_id === rs.service_id);
        if (fresh && JSON.stringify(fresh) !== JSON.stringify(rs)) {
          changed = true;
          return fresh;
        }
        return rs;
      });

      if (changed) {
        setRecentServices(updatedRecent);
        localStorage.setItem("recent_services", JSON.stringify(updatedRecent));
      }
    }
  }, [services, recentServices]);

  useEffect(() => {
    if (currency === "USD" || recentServices.length === 0) {
      return;
    }

    const refreshRecentPricing = async () => {
      try {
        const response = await api.public.getServices({
          currency,
          limit: 100,
          page: 1,
        } as any);

        if (response.data) {
          setRecentServices((prev) => {
            let changed = false;
            const updated = prev.map((rs) => {
              const fresh = response.data.find(
                (s: any) => s.service_id === rs.service_id,
              );
              if (fresh && JSON.stringify(fresh) !== JSON.stringify(rs)) {
                changed = true;
                return fresh;
              }
              return rs;
            });
            if (changed) {
              localStorage.setItem("recent_services", JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Error refreshing recent services pricing:", e);
      }
    };

    refreshRecentPricing();
  }, [currency]);

  const saveRecentService = (service: any) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("recent_services") || "[]",
      );
      const filtered = stored.filter(
        (s: any) => s.service_id !== service.service_id,
      );
      const updated = [service, ...filtered].slice(0, 10);
      localStorage.setItem("recent_services", JSON.stringify(updated));
      setRecentServices(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
    saveRecentService(service);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", category: "" });
    setMaxPrice("");
    setSort("desc");
    setCurrency("USD");
    setPage(1);
  };

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 px-4 md:px-8 bg-gray-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto mb-12 text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            {t.rich("title", {
              highlight: (chunk) => (
                <span className="text-[#F27F2A] prevent-clip">{chunk}</span>
              ),
            })}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="sticky top-24 z-30 max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SearchInput
                placeholder={t("filters.searchPlaceholder")}
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />

              <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => changeView("grid")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    view === "grid"
                      ? "bg-white shadow text-[#F27F2A]"
                      : "text-gray-500",
                  )}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => changeView("list")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    view === "list"
                      ? "bg-white shadow text-[#F27F2A]"
                      : "text-gray-500",
                  )}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                {t("filters.label")}
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 md:flex flex-wrap items-center gap-4",
                showFiltersMobile ? "block" : "hidden md:flex",
              )}
            >
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full md:w-48 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="">{t("filters.categoryDefault")}</option>
                {[
                  ...new Map(
                    services.map((s) => [
                      s.service_category?.category_id,
                      s.service_category,
                    ]),
                  ).values(),
                ].map(
                  (cat: any) =>
                    cat && (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ),
                )}
              </select>

              <Input
                type="number"
                placeholder={t("filters.maxPrice")}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full md:w-40"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                className="w-full md:w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="desc">{t("filters.sortDesc")}</option>
                <option value="asc">{t("filters.sortAsc")}</option>
              </select>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full md:w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
              >
                {mainCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleClearFilters}
                variant="ghost"
                className="text-red-500 w-full md:w-auto"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                {t("filters.clear")}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12">
          {recentServices.length > 0 && !loading && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#F27F2A] rounded-full" />
                <h2 className="text-xl font-bold text-gray-800">
                  {t("recentlyViewed")}
                </h2>
              </div>

              <RecentServicesCarousel
                services={recentServices}
                wishlistItems={wishlistItems}
                onToggleFavorite={toggleFavorite}
                onOpen={handleOpenModal}
                showReferencePrice={currency !== "USD"}
              />
            </div>
          )}

          {loading ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {[...Array(6)].map((_, i) => (
                <ServiceSkeleton key={i} view={view} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <FunnelIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900">
                {t("empty.noResults")}
              </h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                {t("empty.adjustFilters")}
              </p>
              <Button className="mt-6" onClick={handleClearFilters}>
                {t("empty.showAll")}
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "animate-in fade-in duration-500",
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "flex flex-col gap-6",
              )}
            >
              {services.map((service) => {
                const wishlistItem = wishlistItems.find(
                  (item) => item.service_id === service.service_id,
                );
                return (
                  <ServiceCard
                    key={service.service_id}
                    service={service}
                    view={view}
                    isFavorite={!!wishlistItem}
                    wishlistId={wishlistItem?.wishlist_id}
                    onToggleFavorite={toggleFavorite}
                    onLearnMore={() => handleOpenModal(service)}
                    showReferencePrice={currency !== "USD"}
                  />
                );
              })}
            </div>
          )}

          <div ref={observerTarget} className="h-10 w-full" />

          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>

      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        showReferencePrice={currency !== "USD"}
        isFavorite={
          selectedService &&
          !!wishlistItems.find(
            (item) => item.service_id === selectedService.service_id,
          )
        }
        wishlistId={
          selectedService
            ? wishlistItems.find(
                (item) => item.service_id === selectedService.service_id,
              )?.wishlist_id
            : undefined
        }
        onToggleFavorite={toggleFavorite}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
      />

      <Footer />
    </>
  );
}
