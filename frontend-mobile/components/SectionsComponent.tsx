import { useAuth } from "@/hooks/useAuth";
import api, { API_BASE } from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { RootState } from "@/store";
import { arc, pie } from "d3-shape";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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

// TypeScript interfaces
interface SectionData {
  sectionId: string;
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

export default function SectionsComponent({}) {
  const [data, setData] = useState<SectionData[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ministereId } = useAuth();

  const size = 260;
  const innerRadius = 40;
  const outerRadius = 110;

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const pieData = useMemo(
    () =>
      pie<SectionData>()
        .value((d) => d.value)
        .sort(null)(data),
    [data],
  );
  const arcGen = useMemo(
    () =>
      arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(4),
    [],
  );

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
          `${API_BASE}/depense/ministere/section/${selectedFiscalYear.anneeFiscale}/${ministereId}`,
        );

        const articles = response.data[0]?.articles || [];

        if (articles.length === 0) {
          setData([]);
          return;
        }

        const formattedData = articles.map((item: any, index: number) => ({
          sectionId: item.sectionId,
          label: item.sectionDesignation,
          value: item.totalMontantAlloue,
          totalMontantAlloue: item.totalMontantAlloue,
          totalMontantEngage: item.totalMontantEngage,
          totalMontantDepense: item.totalMontantDepense,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        }));

        setData(formattedData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError(
            // "Endpoint des articles non trouvé - Vérifiez l'URL de l'API"
            "Aucune donnée",
          );
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

  const handlePressItem = (item: SectionData) => {
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

    const percent = ((d.data.value / total) * 100).toFixed(1);
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
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && data.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Aucune donnée disponible pour cette période
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
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  },
                  animatedStyle,
                ]}
              >
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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

              {/* Data List */}
              <View style={styles.dataListContainer}>
                <Text style={styles.dataListTitle}>
                  Répartition des dépenses
                </Text>

                <View style={styles.dataList}>
                  {data.map((d, i) => {
                    const percent = ((d.value / total) * 100).toFixed(1);
                    return (
                      <TouchableOpacity
                        onPress={() => handlePressItem(d)}
                        key={i}
                        style={styles.dataListItem}
                      >
                        <View
                          style={[
                            styles.dataListColor,
                            { backgroundColor: d.color },
                          ]}
                        />
                        <View style={styles.dataListContent}>
                          <Text style={styles.dataListLabel}>
                            <Text style={styles.dataListBold}>
                              Section {d.sectionId}
                            </Text>{" "}
                            - {d.label}
                          </Text>
                          <Text style={styles.dataListValue}>
                            {percent}% ({toMillions(d.value)} Md HTG)
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Tooltip */}
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
          </Pressable>

          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Section {modalData?.sectionId}
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

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Fermer</Text>
                </TouchableOpacity>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  legendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#4B5563",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dataListContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: "100%",
  },
  dataListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  dataList: {
    flexDirection: "column",
  },
  dataListItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  dataListColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  dataListContent: {
    flex: 1,
    flexDirection: "column",
  },
  dataListLabel: {
    color: "#374151",
    fontSize: 12,
    lineHeight: 16,
  },
  dataListBold: {
    fontWeight: "700",
  },
  dataListValue: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  tooltip: {
    position: "absolute",
    width: 120,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
  },
  tooltipTitle: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  tooltipValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
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
    paddingVertical: 8,
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
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  modalCloseButton: {
    marginTop: 8,
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseText: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 14,
  },
});
