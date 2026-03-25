import api from "@/lib/api";
import { RootState } from "@/store";
import {
  setExpenses,
  setMinistriesCount,
  setTotalBudget,
} from "@/store/totalBudgetInfosSlice";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BarChartSection from "./BarChartSection";
import FiltersSection from "./FiltersSection";
import PieChartSection from "./PieChartSection";
import TotalBudgetSection from "./TotalBudgetSection";

const VueEnsemble = () => {
  const dispatch = useDispatch();
  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears,
  );
  // Skip initial mount — startup already preloaded data for the default year
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const fetchFiscalYearData = async () => {
      if (!selectedFiscalYear?.anneeFiscale) return;
      try {
        const [budgetResp, ministriesResp] = await Promise.all([
          api.get(`/depense/total/${selectedFiscalYear.anneeFiscale}`),
          api.get(
            `/referentiel/nombres/ministere/${selectedFiscalYear.anneeFiscale}`,
          ),
        ]);

        const budgetData = budgetResp.data;
        const ministriesData = ministriesResp.data;

        dispatch(setTotalBudget(budgetData.montantAlloue));
        dispatch(setExpenses(budgetData.montantDepense));
        dispatch(setMinistriesCount(ministriesData.totalMinistere));
      } catch (error) {
        console.error("Error fetching fiscal year data:", error);
      }
    };

    fetchFiscalYearData();
  }, [selectedFiscalYear, dispatch]);

  return (
    <View className="gap-3">
      {/* <Map /> */}
      <TotalBudgetSection />
      <FiltersSection />
      <PieChartSection />
      <BarChartSection />
    </View>
  );
};

export default VueEnsemble;
