import { useState, useCallback } from "react";
import api from "../lib/api";

export function useApi<T = any>(initialEndpoint: string | null) {
  const [endpoint, setEndpoint] = useState<string | null>(initialEndpoint);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (customEndpoint?: string) => {
      const finalEndpoint = customEndpoint || endpoint;
      if (!finalEndpoint) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(finalEndpoint);
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Ressource introuvable (404)");
        } else {
          setError(err.message ?? "Une erreur est survenue");
        }
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { data, error, loading, fetchData, setEndpoint };
}
