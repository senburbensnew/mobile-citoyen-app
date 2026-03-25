// hooks/useAppStartup.ts
import api from "@/lib/api";
import {
  setCurrentFiscalYear,
  setFiscalYears,
  setSelectedFiscalYear,
} from "@/store/fiscalYearsSlice";
import { setInitialDataLoaded } from "@/store/initialDataLoaded";
import { setMinistries } from "@/store/ministriesSlice";
import { setSelectedMinistry } from "@/store/selectedMinistrySlice";
import {
  setExpenses,
  setMinistriesCount,
  setTotalBudget,
} from "@/store/totalBudgetInfosSlice";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function useAppStartup() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);
  const isLoadingRef = useRef(false); // prevent concurrent runs

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      // prevent duplicate runs while loading
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        setIsReady(false);
        setError(null);

        // -------------------------
        // 1️⃣ Fetch fiscal years
        // -------------------------
        const fiscalRes = await api.get("/referentiel/annees-fiscales");

        if (fiscalRes.status !== 200) {
          throw new Error(`HTTP ${fiscalRes.status}`);
        }

        const fiscalData = fiscalRes.data;

        if (!fiscalData || fiscalData.length === 0) {
          throw new Error("Aucune année fiscale trouvée");
        }

        const sorted = [...fiscalData].sort((a, b) => {
          const yearA = parseInt(a.anneeFiscale.split("-")[0]);
          const yearB = parseInt(b.anneeFiscale.split("-")[0]);
          return yearB - yearA;
        });

        if (mountedRef.current) {
          dispatch(setFiscalYears(sorted));
        }

        const current = sorted.find((y) => y.isCurrent) || sorted[0];

        if (mountedRef.current) {
          dispatch(setCurrentFiscalYear(current));
          dispatch(setSelectedFiscalYear(current));
        }

        const year = current.anneeFiscale;

        // -------------------------
        // 2️⃣ Fetch all dependent data in parallel
        // -------------------------
        const [ministries, budget, count] = await Promise.all([
          api.get(`/referentiel/ministeres/${year}`),
          api.get(`/depense/total/${year}`),
          api.get(`/referentiel/nombres/ministere/${year}`),
        ]);

        // Check all responses
        const responses = [ministries, budget, count];

        for (const res of responses) {
          if (res.status < 200 || res.status >= 300) {
            throw new Error(`HTTP ${res.status}`);
          }
        }

        const ministriesData = ministries.data;
        const budgetData = budget.data;
        const ministriesCountData = count.data;

        const sortedMinistries = [...ministriesData].sort((a: any, b: any) =>
          a.designation.localeCompare(b.designation),
        );

        // -------------------------
        // ✅ SUCCESS
        // -------------------------
        if (mountedRef.current) {
          dispatch(setMinistries(sortedMinistries));
          dispatch(setSelectedMinistry(sortedMinistries[0]));
          dispatch(setTotalBudget(budgetData.montantAlloue));
          dispatch(setExpenses(budgetData.montantDepense));
          dispatch(setMinistriesCount(ministriesCountData.totalMinistere));
          dispatch(setInitialDataLoaded(true));
          setIsReady(true);
          setError(null);
        }
        await SplashScreen.hideAsync().catch(() => {});
      } catch (err: any) {

        // Only update state if still mounted
        if (mountedRef.current) {
          dispatch(setInitialDataLoaded(false));
          setError(
            new Error(
              err?.response?.status === 404
                ? "Ressource introuvable (404)"
                : err.message || "Erreur de démarrage",
            ),
          );
          setIsReady(false);
        }
        await SplashScreen.hideAsync().catch(() => {});
      } finally {
        isLoadingRef.current = false;
      }
    };

    init();
  }, [retryCount]); // only re‑run when retry is called

  const retry = () => {
    setRetryCount((c) => c + 1);
  };

  return { isReady, error, retry };
}
