import { api } from "@/lib/sdk-config";
import { BranchInfo } from "@vitalfit/sdk";
import { useEffect, useState } from "react";

export function useBranches(token: string) {
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.public.getBranchMap(token);
        setBranches(data);
      } catch (err) {
        setError("Error al cargar sucursales");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  return { branches, loading, error };
}
