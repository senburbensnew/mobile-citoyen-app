import { MaterialIcons } from "@expo/vector-icons";
import { RootState } from "@/store";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LiveBarChart from "./LiveBarChart";

const { width } = Dimensions.get("window");

const BarChartSection = () => {
  const { t } = useTranslation();
  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears,
  );

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <MaterialIcons name="bar-chart" size={20} color="#059669" />
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>{t("index_screen.barchart_section.title")}</Text>
            <Text style={styles.subtitle}>{t("index_screen.barchart_section.subtitle")}</Text>
          </View>
        </View>
        {selectedFiscalYear && (
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>
              {selectedFiscalYear.anneeFiscale}
            </Text>
          </View>
        )}
      </View>

      {/* Legend pills */}
      <View style={styles.legendRow}>
        <View style={[styles.legendPill, { backgroundColor: "#F0FDF4" }]}>
          <View style={[styles.dot, { backgroundColor: "#10b981" }]} />
          <Text style={[styles.legendText, { color: "#065F46" }]}>
            {t("index_screen.barchart_section.allocations")}
          </Text>
        </View>
        <View style={[styles.legendPill, { backgroundColor: "#FEF2F2" }]}>
          <View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
          <Text style={[styles.legendText, { color: "#991B1B" }]}>
            {t("index_screen.barchart_section.depenses")}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LiveBarChart
          showLegend={false}
          allocationsBarColor="#10b981"
          depensesBarColor="#ef4444"
        />
      </View>
    </View>
  );
};

export default BarChartSection;

const styles = StyleSheet.create({
  card: {
    width: width * 0.95,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  accentBar: {
    height: 4,
    backgroundColor: "#10b981",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  yearBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  yearBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  legendRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  legendPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    marginBottom: 4,
  },
  chartWrapper: {
    paddingHorizontal: 8,
  },
});
