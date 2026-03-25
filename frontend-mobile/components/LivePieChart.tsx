import api, { API_BASE } from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { RootState } from "@/store";
import { arc, pie } from "d3-shape";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";
import { useSelector } from "react-redux";

const AnimatedView = Animated.createAnimatedComponent(View);

interface ArticleData {
  articleId: string;
  label: string;
  value: number;
  totalMontantAlloue: number;
  totalMontantEngage: number;
  totalMontantDepense: number;
  color: string;
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  percent: string;
}

// Color palette for consistent colors
const COLOR_PALETTE = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
];

// Android-compatible Touchable Component
const AndroidTouchable = ({ children, onPress, style }: any) => {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple("#E5E7EB", false)}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

export default function DonutChart() {
  const { t } = useTranslation();
  const [data, setData] = useState<ArticleData[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const size = 260;
  const innerRadius = 40;
  const outerRadius = 110;

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const pieData = useMemo(
    () =>
      pie<ArticleData>()
        .value((d: { value: any }) => d.value)
        .sort(null)(data),
    [data],
  );
  const arcGen = useMemo(
    () =>
      arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(4),
    [],
  );

  // Show only 3 items if showAll is false
  const displayedData = showAll ? data : data.slice(0, 3);

  const scale = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(scale.value, {
          duration: 700,
          easing: Easing.out(Easing.exp),
        }),
      },
    ],
  }));

  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears,
  );
  const { selectedMinistry } = useSelector(
    (state: RootState) => state.selectedMinistry,
  );

  useEffect(() => {
    const fetchPieChartData = async () => {
      if (!selectedFiscalYear || !selectedMinistry) return;

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `${API_BASE}/depense/ministere/${selectedFiscalYear.anneeFiscale}/${selectedMinistry.id}`,
        );

        const articles = response.data[0]?.articles || [];

        if (articles.length === 0) {
          setData([]);
          setError(t("livepiechart.no_data"));
          return;
        }

        const formattedData = articles.map((item: any, index: number) => ({
          articleId: item.articleId || `ART-${index + 1}`,
          label: item.articleDesignation || "Article sans désignation",
          value: item.totalMontantAlloue || 0,
          totalMontantAlloue: item.totalMontantAlloue || 0,
          totalMontantEngage: item.totalMontantEngage || 0,
          totalMontantDepense: item.totalMontantDepense || 0,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        }));

        setData(formattedData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError(t("livepiechart.error_404"));
        } else if (error.response?.status === 500) {
          setError(t("livepiechart.error_500"));
        } else if (error.message?.includes("Network Error")) {
          setError(t("livepiechart.error_network"));
        } else {
          setError(t("livepiechart.error_generic"));
        }

        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [selectedFiscalYear, selectedMinistry]);

  useEffect(() => {
    scale.value = 1;
  }, []);

  const center = { x: size / 2, y: size / 2 };

  const handlePressItem = (item: ArticleData) => {
    setModalData(item);
    setModalVisible(true);
  };

  const handlePressArc = (
    index: number,
    centroid: [number, number],
    d: any,
  ) => {
    const next = selected === index ? null : index;
    setSelected(next);

    const percent = total > 0 ? ((d.data.value / total) * 100).toFixed(1) : "0";
    if (next !== null) {
      setTooltip({
        x: centroid[0],
        y: centroid[1],
        label: d.data.label,
        percent,
      });
    } else {
      setTooltip(null);
    }
  };

  const handleDismissTooltip = () => {
    setSelected(null);
    setTooltip(null);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ArticleData;
    index: number;
  }) => {
    const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";

    return (
      <AndroidTouchable
        onPress={() => handlePressItem(item)}
        style={styles.listItem}
      >
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <View style={styles.listContent}>
          <Text style={styles.itemLabel}>
            <Text style={styles.boldText}>{t("livepiechart.article")} {item.articleId}</Text> -{" "}
            {item.label}
          </Text>
          <Text style={styles.itemValue}>
            {percent}% ({toMillions(item.value)} Md HTG)
          </Text>
        </View>
      </AndroidTouchable>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const DataRow = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <View style={styles.dataRow}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{toMillions(value)} Md HTG</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>{t("livepiechart.loading")}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t("livepiechart.error_title")}</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && data.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t("livepiechart.no_data")}</Text>
        </View>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <Pressable onPress={handleDismissTooltip}>
            <View style={styles.chartContainer}>
              <AnimatedView
                style={[
                  {
                    width: size,
                    height: size,
                  },
                  animatedStyle,
                ]}
                renderToHardwareTextureAndroid={true}
              >
                <Svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  renderToHardwareTextureAndroid={true}
                >
                  <G x={center.x} y={center.y}>
                    <Circle cx={0} cy={0} r={innerRadius - 1} fill="#fff" />
                    {pieData.map((d, i) => {
                      const path = arcGen(d);
                      const centroid = arc()
                        .innerRadius((innerRadius + outerRadius) / 2)
                        .outerRadius((innerRadius + outerRadius) / 2)
                        .centroid(d);
                      const [cx, cy] = centroid;
                      const distance = selected === i ? 12 : 0;
                      const angle = Math.atan2(cy, cx);
                      const dx = Math.cos(angle) * distance;
                      const dy = Math.sin(angle) * distance;

                      return (
                        <G key={i} transform={`translate(${dx}, ${dy})`}>
                          <Path
                            d={path}
                            fill={data[i].color}
                            stroke="#fff"
                            strokeWidth={2}
                            onPress={() => handlePressArc(i, centroid, d)}
                          />
                        </G>
                      );
                    })}
                  </G>
                </Svg>
              </AnimatedView>

              {tooltip && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.tooltip,
                    {
                      left: center.x + tooltip.x - 60,
                      top: center.y + tooltip.y - 60,
                    },
                  ]}
                >
                  <Text style={styles.tooltipTitle}>{tooltip.label}</Text>
                  <Text style={styles.tooltipValue}>{tooltip.percent}%</Text>
                </View>
              )}
            </View>
            <View style={styles.dataListContainer}>
              <Text style={styles.dataListTitle}>{t("livepiechart.repartition_title")}</Text>

              <View style={styles.listWrapper}>
                <FlatList
                  data={displayedData}
                  renderItem={renderItem}
                  keyExtractor={(item, index) =>
                    item.articleId?.toString() || index.toString()
                  }
                  ItemSeparatorComponent={renderSeparator}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContentContainer}
                  scrollEnabled={false}
                />
              </View>

              {data.length > 3 && (
                <AndroidTouchable
                  onPress={() => setShowAll(!showAll)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAll
                      ? t("common.show_less")
                      : t("common.show_more", { count: data.length - 3 })}
                  </Text>
                </AndroidTouchable>
              )}
            </View>
          </Pressable>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {t("livepiechart.article")} {modalData?.articleId}
                </Text>
                <Text style={styles.modalSubtitle}>{modalData?.label}</Text>

                <View style={styles.modalDataContainer}>
                  <DataRow
                    label={t("common.montant_alloue")}
                    value={modalData?.totalMontantAlloue || 0}
                    color="#3B82F6"
                  />
                  <DataRow
                    label={t("common.montant_engage")}
                    value={modalData?.totalMontantEngage || 0}
                    color="#F59E0B"
                  />
                  <DataRow
                    label={t("common.montant_depense")}
                    value={modalData?.totalMontantDepense || 0}
                    color="#10B981"
                  />
                </View>

                <AndroidTouchable
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>{t("common.close")}</Text>
                </AndroidTouchable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#EF4444",
    marginBottom: 8,
    includeFontPadding: false,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
    includeFontPadding: false,
  },
  debugContainer: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
  },
  debugText: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "monospace",
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    includeFontPadding: false,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  dataListContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  dataListTitle: {
    fontSize: 13,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#6B7280",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  listWrapper: {
    width: "100%",
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  listItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    minHeight: Platform.OS === "android" ? 56 : 48,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
    flexDirection: "column",
  },
  itemLabel: {
    color: "#374151",
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  boldText: {
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
  },
  itemValue: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 3,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  separator: {
    height: 8,
  },
  showMoreButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    minHeight: Platform.OS === "android" ? 48 : 44,
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  showMoreText: {
    textAlign: "center",
    color: "#1D4ED8",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tooltip: {
    position: "absolute",
    width: 120,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    ...(Platform.OS === "android" && {
      elevation: 10,
    }),
  },
  tooltipTitle: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    includeFontPadding: false,
  },
  tooltipValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    marginTop: 4,
    includeFontPadding: false,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    ...(Platform.OS === "android" && {
      paddingTop: Platform.Version >= 21 ? 25 : 20,
    }),
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    ...(Platform.OS === "android" && {
      elevation: 24,
    }),
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    includeFontPadding: false,
  },
  modalDataContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 4,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  dataLabel: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalCloseButton: {
    marginTop: 4,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: Platform.OS === "android" ? 48 : 44,
    justifyContent: "center",
  },
  modalCloseText: {
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    fontSize: 14,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
