import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import api, { API_BASE } from "@/lib/api";
import { RootState } from "@/store";
import { toMillions } from "@/services/helpers";

interface MonthlyData {
  moisNom: string;
  montantAlloue: number;
  montantDepense: number;
}

interface BarChartItem {
  key: string;
  value: number;
  label?: string;
  frontColor: string;
  spacing: number;
  monthIndex: number;
  type: string;
  monthData: MonthlyData;
}

interface LiveBarChartProps {
  showLegend?: boolean;
  allocationsBarColor?: string;
  depensesBarColor?: string;
}

export default function LiveBarChart({
  showLegend = true,
  allocationsBarColor = "#10b981",
  depensesBarColor = "#ef4444",
}: LiveBarChartProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { moisNom: "Oct", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Nov", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Dec", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Jan", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Feb", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Mar", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Apr", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "May", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Jun", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Jul", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Aug", montantAlloue: 0, montantDepense: 0 },
    { moisNom: "Sep", montantAlloue: 0, montantDepense: 0 },
  ]);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(false);

  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );

  // ✅ Memoized chart data
  const chartData = useMemo(() => {
    return monthlyData.flatMap((month, index) => [
      {
        key: `${month.moisNom}-allocation`,
        value: toMillions(month.montantAlloue),
        label: index % 2 === 0 ? month.moisNom : "",
        frontColor: allocationsBarColor,
        spacing: 2,
        monthIndex: index,
        type: "allocation",
        monthData: month,
      },
      {
        key: `${month.moisNom}-depense`,
        value: toMillions(month.montantDepense),
        frontColor: depensesBarColor,
        spacing: index === monthlyData.length - 1 ? 2 : 20,
        monthIndex: index,
        type: "depense",
        monthData: month,
      },
    ]);
  }, [monthlyData, allocationsBarColor, depensesBarColor]);

  const handleBarPress = (item: BarChartItem) => {
    setSelectedMonth(item.monthData);
  };

  useEffect(() => {
    const fetchBarChartData = async (apiUrl: string) => {
      if (!selectedFiscalYear?.anneeFiscale) return;
      setLoading(true);
      try {
        const response = await api.get(apiUrl);
        const data = response.data;

        setMonthlyData(data);

        // ✅ Automatically select the first non-empty month or fallback to first
        if (data && data.length > 0) {
          const firstNonEmpty =
            data.find(
              (m: MonthlyData) => m.montantAlloue > 0 || m.montantDepense > 0
            ) || data[0];
          setSelectedMonth(firstNonEmpty);
        }
      } catch (error) {
        console.log("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFiscalYear) {
      const apiUrl = `${API_BASE}/Public/depenses/periode/allocation/${selectedFiscalYear.anneeFiscale}`;
      fetchBarChartData(apiUrl);
    }
  }, [selectedFiscalYear]);

  return (
    <View className="w-full relative bg-white mt-5">
      {/* Legend (optional) */}
      {showLegend && (
        <View style={styles.legend}>
          <View style={[styles.legendItem, styles.legendItemAllocations]}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: allocationsBarColor },
              ]}
            />
            <Text style={styles.legendText}>Allocations</Text>
          </View>
          <View style={[styles.legendItem, styles.legendItemDepenses]}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: depensesBarColor },
              ]}
            />
            <Text style={styles.legendText}>Dépenses</Text>
          </View>
        </View>
      )}

      {/* Chart container */}
      <View className="p-4 bg-gray-50 rounded-xl mb-5 h-80 justify-center items-center">
        {loading ? (
          <ActivityIndicator size={"large"} color={"#004AAD"} />
        ) : (
          <BarChart
            data={chartData}
            barWidth={18}
            spacing={8}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisColor="#d1d5db"
            barBorderRadius={4}
            showValuesAsTopLabel
            hideRules={true}
            isAnimated={true}
            initialSpacing={20}
            endSpacing={20}
            onPress={handleBarPress}
            xAxisLabelTextStyle={{
              color: "#6b7280",
              fontSize: 7,
              marginTop: 8,
            }}
            topLabelTextStyle={{
              color: "#374151",
              fontSize: 7,
            }}
            yAxisTextStyle={{
              color: "#6b7280",
              fontSize: 10,
              fontWeight: "500",
            }}
            yAxisLabelFormatter={(value) => `${value}`}
          />
        )}
      </View>

      {/* Selected Month Info */}
      {selectedMonth && (
        <View className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <Text className="text-lg font-bold text-center text-gray-800 mb-2">
            {selectedMonth.moisNom}
          </Text>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-sm text-gray-600">Allocation</Text>
              <Text className="text-xs font-semibold text-blue-600">
                {toMillions(selectedMonth.montantAlloue)} Md HTG
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-sm text-gray-600">Dépenses</Text>
              <Text className="text-xs font-semibold text-red-500">
                {toMillions(selectedMonth.montantDepense)} Md HTG
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-sm text-gray-600">Solde</Text>
              <Text
                className={`text-xs font-semibold ${
                  selectedMonth.montantAlloue - selectedMonth.montantDepense >=
                  0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {toMillions(
                  selectedMonth.montantAlloue - selectedMonth.montantDepense
                )}{" "}
                Md HTG
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 3,
    borderRadius: 10,
    padding: 8,
  },
  legendItemAllocations: {
    backgroundColor: "#F0FDF4",
  },
  legendItemDepenses: {
    backgroundColor: "#FEF2F2",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 16,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
