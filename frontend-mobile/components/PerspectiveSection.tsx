import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LiveArticleChart from "./LiveArticleChart";
import LiveLineChart from "./LiveLineChart";

const { width } = Dimensions.get("window");

const ARTICLES = [
  { id: "1", labelKey: "article_1" },
  { id: "2", labelKey: "article_2" },
  { id: "3", labelKey: "article_3" },
  { id: "4", labelKey: "article_4" },
  { id: "5", labelKey: "article_5" },
  { id: "6", labelKey: "article_6" },
  { id: "7", labelKey: "article_7" },
  { id: "8", labelKey: "article_8" },
  { id: "9", labelKey: "article_9" },
];

const PerspectiveSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"global" | "article">("global");
  const [selectedArticle, setSelectedArticle] = useState("1");

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <MaterialIcons name="timeline" size={20} color="#7c3aed" />
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>
              {t("index_screen.perspective_section.title")}
            </Text>
            <Text style={styles.subtitle}>
              {t("index_screen.perspective_section.subtitle")}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "global" && styles.tabActive]}
          onPress={() => setActiveTab("global")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "global" && styles.tabTextActive,
            ]}
          >
            {t("index_screen.perspective_section.tab_global")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "article" && styles.tabActive]}
          onPress={() => setActiveTab("article")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "article" && styles.tabTextActive,
            ]}
          >
            {t("index_screen.perspective_section.tab_article")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legend pills — global tab only */}
      {activeTab === "global" && (
        <View style={styles.legendRow}>
          <View style={[styles.legendPill, { backgroundColor: "#F5F3FF" }]}>
            <View style={[styles.dot, { backgroundColor: "#7c3aed" }]} />
            <Text style={[styles.legendText, { color: "#5b21b6" }]}>
              {t("index_screen.perspective_section.alloue")}
            </Text>
          </View>
          <View style={[styles.legendPill, { backgroundColor: "#FFFBEB" }]}>
            <View style={[styles.dot, { backgroundColor: "#f59e0b" }]} />
            <Text style={[styles.legendText, { color: "#92400e" }]}>
              {t("index_screen.perspective_section.engage")}
            </Text>
          </View>
          <View style={[styles.legendPill, { backgroundColor: "#FEF2F2" }]}>
            <View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
            <Text style={[styles.legendText, { color: "#991B1B" }]}>
              {t("index_screen.perspective_section.depense")}
            </Text>
          </View>
        </View>
      )}

      {/* Article picker — article tab only */}
      {activeTab === "article" && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlePickerContent}
            style={styles.articlePicker}
          >
            {ARTICLES.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.articlePill,
                  selectedArticle === a.id && styles.articlePillActive,
                ]}
                onPress={() => setSelectedArticle(a.id)}
              >
                <Text
                  style={[
                    styles.articlePillText,
                    selectedArticle === a.id && styles.articlePillTextActive,
                  ]}
                >
                  {t(`index_screen.perspective_section.${a.labelKey}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.articleLegendRow}>
            <View style={[styles.legendPill, { backgroundColor: "#ECFEFF" }]}>
              <View style={[styles.dot, { backgroundColor: "#0891b2" }]} />
              <Text style={[styles.legendText, { color: "#164e63" }]}>
                {t("index_screen.perspective_section.alloue")}
              </Text>
            </View>
            <View style={[styles.legendPill, { backgroundColor: "#FFFBEB" }]}>
              <View style={[styles.dot, { backgroundColor: "#f59e0b" }]} />
              <Text style={[styles.legendText, { color: "#92400e" }]}>
                {t("index_screen.perspective_section.engage")}
              </Text>
            </View>
            <View style={[styles.legendPill, { backgroundColor: "#FEF2F2" }]}>
              <View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
              <Text style={[styles.legendText, { color: "#991B1B" }]}>
                {t("index_screen.perspective_section.depense")}
              </Text>
            </View>
          </View>
        </>
      )}

      <View style={styles.divider} />

      {/* Chart */}
      <View style={styles.chartWrapper}>
        {activeTab === "global" ? (
          <LiveLineChart />
        ) : (
          <LiveArticleChart articleId={selectedArticle} />
        )}
      </View>
    </View>
  );
};

export default PerspectiveSection;

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
    backgroundColor: "#7c3aed",
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
    backgroundColor: "#F5F3FF",
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
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#7c3aed",
    fontWeight: "600",
  },
  legendRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  articleLegendRow: {
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
  articlePicker: {
    marginBottom: 10,
  },
  articlePickerContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  articlePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  articlePillActive: {
    backgroundColor: "#ECFEFF",
    borderColor: "#0891b2",
  },
  articlePillText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },
  articlePillTextActive: {
    color: "#0891b2",
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
