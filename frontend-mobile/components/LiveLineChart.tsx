import api from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

interface AnnualData {
  anneeFiscale: string;
  nombreMinistere: number;
  totalMontantAlloue: number;
  totalMontantEngage: number;
  totalMontantDepense: number;
}

export default function LiveLineChart() {
  const { t } = useTranslation();
  const [annualData, setAnnualData] = useState<AnnualData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/perspective/annee/global");
        setAnnualData(response.data.evolutionAnnuelle ?? []);
      } catch (e: any) {
        if (e?.response?.status >= 500) {
          setError(t("common.error_server"));
        } else if (e?.code === "ECONNABORTED" || e?.message === "Network Error") {
          setError(t("common.error_network"));
        } else {
          setError(t("common.error_loading"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>{error}</Text>
      </View>
    );
  }

  if (annualData.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>{t("common.no_data")}</Text>
      </View>
    );
  }

  // Shorten label: "2021-2022" → "21-22"
  const shortLabel = (label: string) =>
    label
      .split("-")
      .map((p) => p.slice(-2))
      .join("-");

  const chartWidth = width * 0.95 - 56;
  const spacing =
    annualData.length > 1
      ? (chartWidth - 40) / (annualData.length - 1)
      : chartWidth - 40;

  const alloueData = annualData.map((d) => ({
    value: toMillions(d.totalMontantAlloue),
    label: shortLabel(d.anneeFiscale),
  }));
  const engageData = annualData.map((d) => ({
    value: toMillions(d.totalMontantEngage),
  }));
  const depenseData = annualData.map((d) => ({
    value: toMillions(d.totalMontantDepense),
  }));

  const latest = annualData[annualData.length - 1];

  return (
    <View style={styles.wrapper}>
      {/* Area line chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={alloueData}
          data2={engageData}
          data3={depenseData}
          width={chartWidth}
          height={180}
          spacing={spacing}
          initialSpacing={20}
          endSpacing={20}
          color1="#7c3aed"
          color2="#f59e0b"
          color3="#ef4444"
          thickness={2}
          areaChart
          startFillColor1="#7c3aed"
          endFillColor1="#ffffff"
          startOpacity1={0.2}
          endOpacity1={0}
          startFillColor2="#f59e0b"
          endFillColor2="#ffffff"
          startOpacity2={0.15}
          endOpacity2={0}
          startFillColor3="#ef4444"
          endFillColor3="#ffffff"
          startOpacity3={0.15}
          endOpacity3={0}
          curved
          isAnimated
          hideRules={false}
          rulesColor="#F3F4F6"
          rulesThickness={1}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.xLabelText}
          dataPointsRadius1={4}
          dataPointsRadius2={4}
          dataPointsRadius3={4}
          dataPointsColor1="#7c3aed"
          dataPointsColor2="#f59e0b"
          dataPointsColor3="#ef4444"
          yAxisLabelFormatter={(v: number) => `${v}`}
        />
      </View>

      {/* Latest year summary cards */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderLeftColor: "#7c3aed" }]}>
          <Text style={styles.metricLabel}>
            {t("index_screen.perspective_section.alloue")}
          </Text>
          <Text style={[styles.metricValue, { color: "#7c3aed" }]}>
            {toMillions(latest.totalMontantAlloue)}
          </Text>
          <Text style={styles.metricUnit}>Md HTG</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: "#f59e0b" }]}>
          <Text style={styles.metricLabel}>
            {t("index_screen.perspective_section.engage")}
          </Text>
          <Text style={[styles.metricValue, { color: "#d97706" }]}>
            {toMillions(latest.totalMontantEngage)}
          </Text>
          <Text style={styles.metricUnit}>Md HTG</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: "#ef4444" }]}>
          <Text style={styles.metricLabel}>
            {t("index_screen.perspective_section.depense")}
          </Text>
          <Text style={[styles.metricValue, { color: "#ef4444" }]}>
            {toMillions(latest.totalMontantDepense)}
          </Text>
          <Text style={styles.metricUnit}>Md HTG</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  chartContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingTop: 12,
    paddingBottom: 4,
    marginBottom: 12,
    alignItems: "center",
  },
  center: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  axisText: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  xLabelText: {
    color: "#6b7280",
    fontSize: 9,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
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
    fontSize: 14,
    fontWeight: "700",
  },
  metricUnit: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
});
