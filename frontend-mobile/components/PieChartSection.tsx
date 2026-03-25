import { MaterialIcons } from "@expo/vector-icons";
import { RootState } from "@/store";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LivePieChart from "./LivePieChart";

const { width } = Dimensions.get("window");

const PieChartSection = () => {
  const { t } = useTranslation();
  const { selectedMinistry } = useSelector(
    (state: RootState) => state.selectedMinistry,
  );

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <MaterialIcons name="pie-chart" size={20} color="#2563EB" />
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>{t("index_screen.piechart_section.title")}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {selectedMinistry?.designation ?? t("index_screen.piechart_section.subtitle_default")}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LivePieChart />
      </View>
    </View>
  );
};

export default PieChartSection;

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
    backgroundColor: "#2563EB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    backgroundColor: "#EFF6FF",
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
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  chartWrapper: {
    padding: 12,
  },
});
