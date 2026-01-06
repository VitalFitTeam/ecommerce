import { api } from "@/lib/sdk-config";
import { ServicePublicItem } from "@vitalfit/sdk";
import { useState, useCallback } from "react";

export function useBranchServices() {
  const [services, setServices] = useState<ServicePublicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (branchId: string) => {
    if (!branchId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.public.getBranchServices(
        {
          limit: 6,
          currency: "USD",
          sort: "desc",
          page: 1,
          category: "", // o undefined dependiendo de tu SDK
          price: 0, // o undefined
          sortby: "price",
          search: "",
        },
        branchId,
      );

      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("No se pudieron cargar los servicios.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { services, isLoading, error, fetchServices, setServices };
}
