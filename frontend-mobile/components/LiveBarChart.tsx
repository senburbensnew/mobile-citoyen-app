import api, { API_BASE } from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { RootState } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";

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
  const { t } = useTranslation();
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
    (state: RootState) => state.fiscalYears,
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
              (m: MonthlyData) => m.montantAlloue > 0 || m.montantDepense > 0,
            ) || data[0];
          setSelectedMonth(firstNonEmpty);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (selectedFiscalYear) {
      const apiUrl = `${API_BASE}/depense/periode/allocation/${selectedFiscalYear.anneeFiscale}`;
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
      <View
        className="p-4 rounded-xl mb-3 h-80 justify-center items-center"
        style={{ backgroundColor: "#FAFAFA", borderWidth: 1, borderColor: "#F3F4F6" }}
      >
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
        <View style={styles.monthCard}>
          <View style={styles.monthCardHeader}>
            <View style={styles.monthDot} />
            <Text style={styles.monthName}>{selectedMonth.moisNom}</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { borderLeftColor: "#10b981" }]}>
              <Text style={styles.metricLabel}>{t("index_screen.barchart_section.allocation")}</Text>
              <Text style={[styles.metricValue, { color: "#059669" }]}>
                {toMillions(selectedMonth.montantAlloue)}
              </Text>
              <Text style={styles.metricUnit}>Md HTG</Text>
            </View>
            <View style={[styles.metricCard, { borderLeftColor: "#ef4444" }]}>
              <Text style={styles.metricLabel}>{t("index_screen.barchart_section.depenses")}</Text>
              <Text style={[styles.metricValue, { color: "#ef4444" }]}>
                {toMillions(selectedMonth.montantDepense)}
              </Text>
              <Text style={styles.metricUnit}>Md HTG</Text>
            </View>
            <View
              style={[
                styles.metricCard,
                {
                  borderLeftColor:
                    selectedMonth.montantAlloue -
                      selectedMonth.montantDepense >=
                    0
                      ? "#10b981"
                      : "#ef4444",
                },
              ]}
            >
              <Text style={styles.metricLabel}>{t("index_screen.barchart_section.solde")}</Text>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color:
                      selectedMonth.montantAlloue -
                        selectedMonth.montantDepense >=
                      0
                        ? "#059669"
                        : "#ef4444",
                  },
                ]}
              >
                {toMillions(
                  selectedMonth.montantAlloue - selectedMonth.montantDepense,
                )}
              </Text>
              <Text style={styles.metricUnit}>Md HTG</Text>
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
  monthCard: {
    marginTop: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  monthCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  monthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9CA3AF",
    marginRight: 8,
  },
  monthName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  metricUnit: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
});
