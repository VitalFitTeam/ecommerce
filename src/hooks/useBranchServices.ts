"use client";

import { api } from "@/lib/sdk-config";
import { ServicePublicItem } from "@vitalfit/sdk";
import { useState, useCallback, useRef } from "react";

export function useBranchServices() {
  const [services, setServices] = useState<ServicePublicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12; // Cantidad de items por carga

  const fetchServices = useCallback(
    async (branchId: string, isNextPage = false) => {
      if (!branchId) {
        return;
      }

      if (isNextPage && (!hasMore || isLoading)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      // Si es la página 1 (isNextPage = false), reseteamos todo
      const pageToFetch = isNextPage ? page + 1 : 1;

      try {
        const response = await api.public.getBranchServices(
          {
            limit: limit,
            page: pageToFetch,
            currency: "USD",
            sort: "desc",
            sortby: "price",
            category: "",
            price: 0,
            search: "",
          },
          branchId,
        );

        const newData = response.data || [];

        setServices((prev) => (isNextPage ? [...prev, ...newData] : newData));

        setPage(pageToFetch);

        if (newData.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setIsLoading(false);
      }
    },
    [page, hasMore, isLoading],
  );

  const resetServices = useCallback(() => {
    setServices([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    services,
    isLoading,
    error,
    hasMore,
    fetchServices,
    resetServices,
  };
}
