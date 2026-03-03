import { View, Text, Dimensions, StyleSheet } from "react-native";
import LivePieChart from "./LivePieChart";

const PieChartSection = () => {
  return (
    <View className="justify-center items-center">
      <View
        style={{
          width: width * 0.95,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            padding: 6,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#1F2937",
              }}
            >
              💰 Répartition budgétaire
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#4B5563",
              }}
            >
              Distribution du budget par ministere
            </Text>
          </View>

          {/* Legends */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#2563EB",
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#EF4444",
                }}
              />
            </View>
          </View>
        </View>

        {/* Chart */}
        <View
          style={{
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <LivePieChart />
        </View>
      </View>
    </View>
  );
};

export default PieChartSection;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subHeaderBold: {
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  smallBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  image: {
    width: width * 0.95,
    height: 200,
    borderRadius: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  overlayText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
  },
  filterContainer: {
    width: width * 0.95,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: width * 0.025,
    borderLeftWidth: 4,
    borderLeftColor: "#145efc",
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterHeaderText: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 12,
    color: "#4B5563",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButton: {
    marginLeft: 8,
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ministryContainer: {
    width: width * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: width * 0.025,
  },
  ministryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ministryHeaderText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1F2937",
  },
  ministryLegends: {
    flexDirection: "row",
    width: 16,
    height: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  ministryChartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ministryTotalTextContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  ministryTotalText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#1F2937",
  },
  recentReportsContainer: {
    flexDirection: "column",
    gap: 12,
    width: width * 0.95,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: width * 0.025,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
  },
  recentReportsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  recentReportsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  recentReportsLegends: {
    flexDirection: "row",
    width: 16,
    height: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
    marginBottom: 1,
  },
  reportCardInner: {
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#FEFFFC",
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#1F2937",
  },
  reportMinistry: {
    fontSize: 12,
    color: "#6B7280",
  },
  reportRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  reportBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    padding: 8,
  },
  reportBoxTitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  reportBoxValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  reportProjectsContainer: {
    marginBottom: 12,
  },
  reportProjectsLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  reportProjectsBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  reportProjectBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  reportActionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  reportActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reportActionText: {
    fontSize: 10,
  },
  badgeBase: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  badgeDefault: { backgroundColor: "#2563EB", borderColor: "transparent" },
  badgeDestructive: { backgroundColor: "#EF4444", borderColor: "transparent" },
  badgeSecondary: { backgroundColor: "#E5E7EB", borderColor: "transparent" },
  badgeOutline: { backgroundColor: "transparent", borderColor: "#D1D5DB" },
});
