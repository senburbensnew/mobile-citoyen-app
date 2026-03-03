import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import api from "@/lib/api";
import { toMillions } from "@/services/helpers";
import {
  setExpenses,
  setMinistriesCount,
  setTotalBudget,
} from "@/store/totalBudgetInfosSlice";
import FiltersSection from "./FiltersSection";
import TotalBudgetSection from "./TotalBudgetSection";
import PieChartSection from "./PieChartSection";
import BarChartSection from "./BarChartSection";
import Map from "./Map";

const VueEnsemble = () => {
  const dispatch = useDispatch();
  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );

  useEffect(() => {
    const fetchFiscalYearData = async () => {
      if (!selectedFiscalYear?.anneeFiscale) return;
      try {
        const [budgetResp, ministriesResp] = await Promise.all([
          api.get(`/Public/depenses/total/${selectedFiscalYear.anneeFiscale}`),
          api.get(
            `/Public/nombres/ministere${selectedFiscalYear.anneeFiscale}`
          ),
        ]);

        const budgetData = budgetResp.data;
        const ministriesData = ministriesResp.data;

        dispatch(setTotalBudget(toMillions(budgetData.montantAlloue)));
        dispatch(setExpenses(toMillions(budgetData.montantDepense)));
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
