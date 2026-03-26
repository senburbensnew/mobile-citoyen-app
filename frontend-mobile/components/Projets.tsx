import api from "@/lib/api";
import { toMillions } from "@/services/helpers";
import { LinearGradient } from "expo-linear-gradient";
import {
  Briefcase,
  CircleAlert,
  MapPin,
  Search,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HaitiMap from "./HaitiMap";

const { width } = Dimensions.get("window");


interface Bailleur {
  id: string;
  designation: string;
  type: string;
  typeFinancement: string;
}

interface Financement {
  montantAlloue: number;
  montantAutorise: number;
  bailleur: Bailleur;
}

interface ProjetItem {
  projetId: string;
  projetDesignation: string;
  anneeFiscale: string;
  programme: { id: string; designation: string };
  commune: { id: string; designation: string };
  latitude: string | null;
  longitude: string | null;
  financement: Financement;
}

interface DeptResponse {
  departementDesignation: string;
  nombreProjets: number;
  projets: ProjetItem[];
}

const FINANCEMENT_COLORS: Record<string, { accent: string; bg: string; text: string }> = {
  Don: { accent: "#10b981", bg: "#ECFDF5", text: "#065f46" },
  Prêt: { accent: "#3b82f6", bg: "#EFF6FF", text: "#1e40af" },
  "Budget National": { accent: "#f59e0b", bg: "#FFFBEB", text: "#78350f" },
};
const DEFAULT_FIN_COLOR = { accent: "#8b5cf6", bg: "#F5F3FF", text: "#4c1d95" };

const Projets = () => {
  const { t } = useTranslation();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptData, setDeptData] = useState<DeptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDeptId) return;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      setDeptData(null);
      try {
        const res = await api.get(`/projet/departement/${selectedDeptId}`);
        setDeptData(res.data);
      } catch (e: any) {
        if (e?.response?.status >= 500) {
          setError(t("projets_screen.error_500"));
        } else if (e?.response?.status === 404) {
          setError(t("projets_screen.error_404"));
        } else if (e?.code === "ECONNABORTED" || e?.message === "Network Error") {
          setError(t("projets_screen.error_network"));
        } else {
          setError(t("projets_screen.error_generic"));
        }
        console.error("Error fetching projects:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedDeptId]);

  const filteredProjects = useMemo(() => {
    if (!deptData?.projets) return [];
    const q = searchQuery.toLowerCase();
    if (!q) return deptData.projets;
    return deptData.projets.filter(
      (p) =>
        p.projetDesignation.toLowerCase().includes(q) ||
        p.commune.designation.toLowerCase().includes(q)
    );
  }, [deptData, searchQuery]);

  // ── Sub-components ────────────────────────────────────────────────────────

  const ProjectCard = ({ projet }: { projet: ProjetItem }) => {
    const finColor =
      FINANCEMENT_COLORS[projet.financement.bailleur.typeFinancement] ??
      DEFAULT_FIN_COLOR;
    const utilRate = Math.min(
      projet.financement.montantAutorise / projet.financement.montantAlloue,
      1
    );

    return (
      <View style={[styles.projectCard, { borderLeftColor: finColor.accent }]}>
        {/* Programme + fiscal year */}
        <View style={styles.cardTopRow}>
          <View style={[styles.programmePill, { backgroundColor: finColor.bg }]}>
            <Text
              style={[styles.programmePillText, { color: finColor.text }]}
              numberOfLines={1}
            >
              {projet.programme.designation}
            </Text>
          </View>
          <View style={styles.fiscalYearBadge}>
            <Text style={styles.fiscalYearBadgeText}>{projet.anneeFiscale}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {projet.projetDesignation}
        </Text>

        {/* ID + financing type */}
        <View style={styles.badgesRow}>
          <View style={styles.projetIdBadge}>
            <Text style={styles.projetIdText}>{projet.projetId}</Text>
          </View>
          <View
            style={[
              styles.typeFinPill,
              { backgroundColor: finColor.bg, borderColor: finColor.accent + "60" },
            ]}
          >
            <Text style={[styles.typeFinPillText, { color: finColor.text }]}>
              {projet.financement.bailleur.typeFinancement}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Finance stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statAmountRow}>
              <Text style={styles.statAmount}>
                {toMillions(projet.financement.montantAlloue)}
              </Text>
              <Text style={styles.statUnit}>{t("common.md_htg")}</Text>
            </View>
            <Text style={styles.statLabel}>{t("projets_screen.card_alloue")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statAmountRow}>
              <Text style={[styles.statAmount, { color: finColor.accent }]}>
                {toMillions(projet.financement.montantAutorise)}
              </Text>
              <Text style={styles.statUnit}>{t("common.md_htg")}</Text>
            </View>
            <Text style={styles.statLabel}>{t("projets_screen.card_autorise")}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(utilRate * 100)}%`, backgroundColor: finColor.accent },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {Math.round(utilRate * 100)}% {t("projets_screen.card_autorise").toLowerCase()}
        </Text>

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.cardFooterItem}>
            <MapPin size={13} color="#9ca3af" />
            <Text style={styles.cardFooterText} numberOfLines={1}>
              {projet.commune.designation}
            </Text>
          </View>
          <Text style={styles.cardFooterBailleur} numberOfLines={1}>
            {projet.financement.bailleur.designation}
          </Text>
        </View>
      </View>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const renderContent = () => {
    if (selectedDeptId === null) {
      return (
        <View style={styles.statusContainer}>
          <MapPin size={40} color="#9CA3AF" />
          <Text style={styles.statusText}>{t("projets_screen.select_dept")}</Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#001F5B" />
          <Text style={styles.statusText}>{t("projets_screen.loading")}</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.statusContainer}>
          <CircleAlert size={40} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // re-trigger effect by toggling then restoring
              const id = selectedDeptId;
              setSelectedDeptId(null);
              setTimeout(() => setSelectedDeptId(id), 0);
            }}
          >
            <Text style={styles.retryButtonText}>{t("projets_screen.retry")}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filteredProjects.length === 0) {
      return (
        <View style={styles.statusContainer}>
          <Briefcase size={40} color="#9CA3AF" />
          <Text style={styles.statusText}>{t("projets_screen.no_projects")}</Text>
          <Text style={styles.statusSubText}>
            {t("projets_screen.no_projects_subtitle")}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.projectsList}>
        {filteredProjects.map((projet) => (
          <ProjectCard key={projet.projetId} projet={projet} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#004AAD", "#B000B9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerIconWrap}>
            <Briefcase size={24} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t("projets_screen.title")}</Text>
            <Text style={styles.headerSubtitle}>
              {deptData
                ? `${deptData.departementDesignation} — ${t("projets_screen.count", { count: deptData.nombreProjets })}`
                : selectedDeptId
                ? `${t(`departments.${selectedDeptId}`)} — ${t("projets_screen.loading")}`
                : t("projets_screen.picker_label")}
            </Text>
          </View>
        </LinearGradient>

        {/* Department map picker */}
        <View style={styles.mapCard}>
          <Text style={styles.pickerLabel}>{t("projets_screen.picker_label")}</Text>
          <HaitiMap
            selectedDeptId={selectedDeptId}
            onSelectDepartment={(id) => {
              setSelectedDeptId(id);
              setSearchQuery("");
            }}
          />
        </View>

        {/* Search input */}
        {selectedDeptId !== null && (
          <View style={styles.searchContainer}>
            <Search
              size={16}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t("projets_screen.search_placeholder")}
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        {/* Content */}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default Projets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 2,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },

  // Map card
  mapCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    paddingHorizontal: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // Status states
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    maxWidth: width * 0.7,
  },
  statusSubText: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
    maxWidth: width * 0.65,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    maxWidth: width * 0.7,
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#001F5B",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Projects list
  projectsList: {
    gap: 14,
  },

  // Project card
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 4,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  programmePill: {
    flex: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  programmePillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fiscalYearBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  fiscalYearBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  projetIdBadge: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#F9FAFB",
  },
  projetIdText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
  },
  typeFinPill: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeFinPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  statAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  statUnit: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },

  // Progress bar
  progressTrack: {
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: -4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  cardFooterText: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  cardFooterBailleur: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
});
