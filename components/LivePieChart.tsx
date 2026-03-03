import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableNativeFeedback,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import { pie, arc } from "d3-shape";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api, { API_BASE } from "@/lib/api";
import { toMillions } from "@/services/helpers";

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
    [data]
  );
  const arcGen = useMemo(
    () =>
      arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(4),
    []
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
    (state: RootState) => state.fiscalYears
  );
  const { selectedMinistry } = useSelector(
    (state: RootState) => state.selectedMinistry
  );

  useEffect(() => {
    const fetchPieChartData = async () => {
      if (!selectedFiscalYear || !selectedMinistry) return;

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching article data for:", {
          year: selectedFiscalYear.anneeFiscale,
          ministryId: selectedMinistry.id,
        });

        const response = await api.get(
          `${API_BASE}/Public/depenses/ministere${selectedFiscalYear.anneeFiscale}/${selectedMinistry.id}`
        );

        console.log("API Response:", response.data);

        const articles = response.data[0]?.articles || [];

        if (articles.length === 0) {
          setData([]);
          setError("Aucune donnée disponible pour les articles");
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
          setError("Aucune donnée");
        } else if (error.response?.status === 500) {
          setError("Erreur serveur - Veuillez réessayer plus tard");
        } else if (error.message?.includes("Network Error")) {
          setError("Erreur de connexion - Vérifiez votre réseau");
        } else {
          setError("Erreur lors du chargement des données des articles");
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
    d: any
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
            <Text style={styles.boldText}>Article {item.articleId}</Text> -{" "}
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
      <Text style={styles.dataValue}>{value} HTG</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>
            Chargement des données des articles...
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && data.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Aucune donnée d'article disponible pour cette période
          </Text>
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
              <Text style={styles.dataListTitle}>Répartition des dépenses</Text>

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
                      ? "Afficher moins"
                      : `Afficher plus (+${data.length - 3})`}
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
                  Article {modalData?.articleId}
                </Text>
                <Text style={styles.modalSubtitle}>{modalData?.label}</Text>

                <View style={styles.modalDataContainer}>
                  <DataRow
                    label="Montant Alloué"
                    value={modalData?.totalMontantAlloue || 0}
                    color="#3B82F6"
                  />
                  <DataRow
                    label="Montant Engagé"
                    value={modalData?.totalMontantEngage || 0}
                    color="#F59E0B"
                  />
                  <DataRow
                    label="Montant Dépensé"
                    value={modalData?.totalMontantDepense || 0}
                    color="#10B981"
                  />
                </View>

                <AndroidTouchable
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Fermer</Text>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }
      : {
          elevation: 4,
          shadowColor: "#000",
        }),
    width: "100%",
  },
  dataListTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#111827",
    marginBottom: 12,
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
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    minHeight: Platform.OS === "android" ? 56 : 48,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
    color: "#111827",
    fontSize: 12,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    marginTop: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
    marginHorizontal: 8,
  },
  showMoreButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    minHeight: Platform.OS === "android" ? 48 : 44,
    justifyContent: "center",
  },
  showMoreText: {
    textAlign: "center",
    color: "#1E40AF",
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
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    ...(Platform.OS === "android" && {
      elevation: 24,
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    includeFontPadding: false,
  },
  modalDataContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  dataLabel: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalCloseButton: {
    marginTop: 8,
    backgroundColor: "#3B82F6",
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
