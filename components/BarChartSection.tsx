import { View, Text, Dimensions, StyleSheet } from "react-native";
import LiveBarChart from "./LiveBarChart";

const BarChartSection = () => {
  return (
    <View className="justify-center items-center">
      <View style={styles.ministryContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>📈 Évolution mensuelle</Text>
            <Text style={styles.subtitle}>
              Suivi des allocations et dépenses par mois par année fiscale
            </Text>
          </View>

          {/* Legends */}
          <View style={styles.legendsContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10b981" }]}
              />
              <Text style={styles.legendText}>Allocations</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#ef4444" }]}
              />
              <Text style={styles.legendText}>Dépenses</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <LiveBarChart
            showLegend={false}
            allocationsBarColor="#10b981"
            depensesBarColor="#ef4444"
          />
        </View>
      </View>
    </View>
  );
};

export default BarChartSection;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  ministryContainer: {
    width: width * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTextContainer: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  legendsContainer: {
    alignItems: "flex-start",
    marginLeft: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  chartContainer: {
    marginTop: 8,
  },
});
