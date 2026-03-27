import { useAuth } from "@/hooks/useAuth";
import api, { API_BASE } from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width: screenWidth } = Dimensions.get("window");
const CHART_WIDTH = screenWidth - 80;

// ── Period map ─────────────────────────────────────────────────────────────────
const PERIODS = [
  { value: 1, label: "Oct." },
  { value: 2, label: "Nov." },
  { value: 3, label: "Déc." },
  { value: 4, label: "Jan." },
  { value: 5, label: "Fév." },
  { value: 6, label: "Mar." },
  { value: 7, label: "Avr." },
  { value: 8, label: "Mai" },
  { value: 9, label: "Jun." },
  { value: 10, label: "Jul." },
  { value: 11, label: "Aoû." },
  { value: 12, label: "Sep." },
  { value: 13, label: "Corr." },
];

// ── DTO types ──────────────────────────────────────────────────────────────────
interface AnneeEntry {
  anneeFiscale: string;
  nombreMinistere: number;
  totalMontantAlloue: number;
  totalMontantEngage: number;
  totalMontantDepense: number;
}
interface PerspectiveAnnee {
  ministereId: string;
  ministereDesignation: string;
  evolutionAnnuelle: AnneeEntry[];
}

interface PeriodeEntry {
  mois: number;
  moisNom: string;
  anneeFiscale: string;
  montantAlloue: number;
  montantEngage: number;
  montantDepense: number;
}
interface PerspectivePeriode {
  ministereId: string;
  ministereDesignation: string;
  evolutionMensuelle: PeriodeEntry[];
}

interface SectionEntry {
  anneeFiscale: string;
  totalMontantAlloue: number;
  totalMontantEngage: number;
  totalMontantDepense: number;
}
interface PerspectiveSection {
  sectionId: string;
  sectionDesignation: string;
  evolutionAnnuelle: SectionEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const CardHeader = ({ icon, title }: { icon: string; title: string }) => (
  <View style={styles.cardHeader}>
    <View style={styles.cardIconBox}>
      <MaterialIcons name={icon as any} size={16} color="#2563EB" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const Legend = ({
  items,
}: {
  items: { color: string; label: string }[];
}) => (
  <View style={styles.legend}>
    {items.map((item) => (
      <View key={item.label} style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
        <Text style={styles.legendText}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const StateRow = ({
  loading,
  error,
}: {
  loading: boolean;
  error: string | null;
}) => {
  if (loading)
    return (
      <View style={styles.stateBox}>
        <ActivityIndicator size="small" color="#2563EB" />
      </View>
    );
  if (error)
    return (
      <View style={styles.stateBox}>
        <MaterialIcons name="error-outline" size={16} color="#DC2626" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  return null;
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function PerspectiveComponent() {
  const { ministereId } = useAuth();

  const [anneeData, setAnneeData] = useState<PerspectiveAnnee | null>(null);
  const [anneeLoading, setAnneeLoading] = useState(false);
  const [anneeError, setAnneeError] = useState<string | null>(null);

  const [selectedPeriode, setSelectedPeriode] = useState(4);
  const [periodeData, setPeriodeData] = useState<PerspectivePeriode | null>(null);
  const [periodeLoading, setPeriodeLoading] = useState(false);
  const [periodeError, setPeriodeError] = useState<string | null>(null);

  const [sectionData, setSectionData] = useState<PerspectiveSection | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [hasSectionId, setHasSectionId] = useState(false);

  // Annual perspective
  useEffect(() => {
    if (!ministereId) return;
    const fetch = async () => {
      setAnneeLoading(true);
      setAnneeError(null);
      try {
        const { data } = await api.get(
          `${API_BASE}/perspective/annee/${ministereId}`
        );
        setAnneeData(data);
      } catch {
        setAnneeError("Aucune donnée annuelle disponible");
      } finally {
        setAnneeLoading(false);
      }
    };
    fetch();
  }, [ministereId]);

  // Period perspective
  useEffect(() => {
    if (!ministereId) return;
    const fetch = async () => {
      setPeriodeLoading(true);
      setPeriodeError(null);
      try {
        const { data } = await api.get(
          `${API_BASE}/perspective/periode/${ministereId}/${selectedPeriode}`
        );
        setPeriodeData(data);
      } catch {
        setPeriodeError("Aucune donnée pour cette période");
      } finally {
        setPeriodeLoading(false);
      }
    };
    fetch();
  }, [ministereId, selectedPeriode]);

  // Section perspective
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: userInfo } = await api.get(`${API_BASE}/auth/userInfo`);
        if (!userInfo.sectionId) return;
        const sId = String(userInfo.sectionId);
        setHasSectionId(true);
        setSectionLoading(true);
        setSectionError(null);
        try {
          const { data } = await api.get(
            `${API_BASE}/perspective/section/${sId}`
          );
          setSectionData(data);
        } catch {
          setSectionError("Aucune donnée disponible pour votre section");
        } finally {
          setSectionLoading(false);
        }
      } catch {
        // user has no sectionId — skip silently
      }
    };
    fetch();
  }, []);

  // ── Chart data builders ──────────────────────────────────────────────────────
  const anneeChartData = (anneeData?.evolutionAnnuelle ?? []).flatMap(
    (a, i) => {
      const isLast = i === (anneeData?.evolutionAnnuelle?.length ?? 0) - 1;
      return [
        {
          value: toMillions(a.totalMontantAlloue),
          frontColor: "#2563EB",
          label: a.anneeFiscale,
          labelTextStyle: styles.chartLabel,
          labelWidth: 56,
          spacing: 2,
        },
        {
          value: toMillions(a.totalMontantEngage),
          frontColor: "#F59E0B",
          spacing: 2,
        },
        {
          value: toMillions(a.totalMontantDepense),
          frontColor: "#10B981",
          spacing: isLast ? 4 : 18,
        },
      ];
    }
  );

  const periodeChartData = (periodeData?.evolutionMensuelle ?? []).map(
    (a, i) => ({
      value: toMillions(a.montantAlloue),
      frontColor: "#2563EB",
      label: a.anneeFiscale,
      labelTextStyle: styles.chartLabel,
      labelWidth: 56,
      spacing: i === (periodeData?.evolutionMensuelle?.length ?? 0) - 1 ? 4 : 14,
    })
  );

  const sectionChartData = (sectionData?.evolutionAnnuelle ?? []).flatMap((a, i) => {
    const isLast = i === (sectionData?.evolutionAnnuelle?.length ?? 0) - 1;
    return [
      {
        value: toMillions(a.totalMontantAlloue),
        frontColor: "#2563EB",
        label: a.anneeFiscale,
        labelTextStyle: styles.chartLabel,
        labelWidth: 56,
        spacing: 2,
      },
      {
        value: toMillions(a.totalMontantEngage),
        frontColor: "#F59E0B",
        spacing: 2,
      },
      {
        value: toMillions(a.totalMontantDepense),
        frontColor: "#10B981",
        spacing: isLast ? 4 : 18,
      },
    ];
  });

  const triLegend = [
    { color: "#2563EB", label: "Alloué" },
    { color: "#F59E0B", label: "Engagé" },
    { color: "#10B981", label: "Dépensé" },
  ];

  const commonBarProps = {
    barWidth: 14,
    barBorderRadius: 3,
    yAxisThickness: 0,
    xAxisThickness: 1,
    xAxisColor: "#E5E7EB",
    hideRules: true,
    isAnimated: true,
    initialSpacing: 16,
    endSpacing: 8,
    showValuesAsTopLabel: true,
    topLabelTextStyle: styles.topLabel,
    yAxisTextStyle: styles.yAxisText,
    xAxisLabelTextStyle: styles.chartLabel,
    labelsExtraHeight: 16,
    width: CHART_WIDTH,
  };

  return (
    <View style={styles.container}>
      {/* ── Annual budget evolution ── */}
      <View style={styles.card}>
        <CardHeader icon="trending-up" title="Évolution Budgétaire Annuelle" />
        <StateRow loading={anneeLoading} error={anneeError} />
        {!anneeLoading && anneeChartData.length > 0 && (
          <>
            <Legend items={triLegend} />
            <View style={styles.chartBox}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart data={anneeChartData} {...commonBarProps} />
              </ScrollView>
            </View>
          </>
        )}
      </View>

      {/* ── Period evolution ── */}
      <View style={styles.card}>
        <CardHeader icon="date-range" title="Allocation par Période" />

        {/* Period chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.value}
              onPress={() => setSelectedPeriode(p.value)}
              style={[
                styles.periodChip,
                selectedPeriode === p.value && styles.periodChipActive,
              ]}
            >
              <Text
                style={[
                  styles.periodChipText,
                  selectedPeriode === p.value && styles.periodChipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <StateRow loading={periodeLoading} error={periodeError} />
        {!periodeLoading && periodeChartData.length > 0 && (
          <>
            <Legend items={[{ color: "#2563EB", label: "Alloué" }]} />
            <View style={styles.chartBox}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart data={periodeChartData} {...commonBarProps} />
              </ScrollView>
            </View>
          </>
        )}
      </View>

      {/* ── Section evolution ── */}
      {(hasSectionId || sectionLoading) && (
        <View style={styles.card}>
          <CardHeader icon="layers" title="Évolution de ma Section" />
          <StateRow loading={sectionLoading} error={sectionError} />
          {!sectionLoading && sectionChartData.length > 0 && (
            <>
              {!!sectionData?.sectionDesignation && (
                <Text style={styles.sectionDesig}>
                  {sectionData.sectionDesignation}
                </Text>
              )}
              <Legend items={triLegend} />
              <View style={styles.chartBox}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart data={sectionChartData} {...commonBarProps} />
                </ScrollView>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  stateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    justifyContent: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
  },
  legend: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  chartBox: {
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 9,
    color: "#6B7280",
  },
  topLabel: {
    fontSize: 8,
    color: "#374151",
    fontWeight: "600",
  },
  yAxisText: {
    fontSize: 9,
    color: "#9CA3AF",
  },
  chipScroll: {
    marginTop: 10,
    marginBottom: 4,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 6,
  },
  periodChipActive: {
    backgroundColor: "#2563EB",
  },
  periodChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  periodChipTextActive: {
    color: "#fff",
  },
  sectionDesig: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 2,
    fontStyle: "italic",
  },
});
