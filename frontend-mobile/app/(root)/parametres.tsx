import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { changeAppLanguage } from "@/services/helpers";
import { RootState } from "@/store";

export default function Settings() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const { user } = useAuth();
  const router = useRouter();

  const langMap = { FR: "fr", HT: "ht" } as const;

  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears,
  );

  function handleRoleChange() {
    router.push({ pathname: "/(auth)/login" });
  }

  const handleProfile = () => {
    router.replace("/(root)/profile");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Gradient Header ── */}
      <LinearGradient
        colors={["#1A3C90", "#D7263D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerIconRow}>
          <View style={styles.headerIconCircle}>
            <Ionicons name="settings" size={24} color="#fff" />
          </View>
        </View>
        <Text style={styles.headerTitle}>{t("parametreScreen.titre")}</Text>
        {user ? (
          <View style={styles.userChip}>
            <MaterialIcons name="person" size={13} color="#fff" />
            <Text style={styles.userChipText}>{user}</Text>
          </View>
        ) : null}
      </LinearGradient>

      <View style={styles.cards}>
        {/* ── Profile (authenticated) ── */}
        {user && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(37,99,235,0.1)" }]}>
                <MaterialIcons name="person-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>
                  {t("parametreScreen.profil", "Profil")}
                </Text>
                <Text style={styles.cardDesc}>
                  {t("parametreScreen.profil_desc", "Consultez votre profil")}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleProfile} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>
                {t("parametreScreen.voir_profil", "Voir Profil")}
              </Text>
              <MaterialIcons name="arrow-forward" color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Language ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(16,185,129,0.1)" }]}>
              <Ionicons name="globe-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                {t("parametreScreen.langue_interface")}
              </Text>
              <Text style={styles.cardDesc}>
                {t("parametreScreen.choisir_langue_affichage")}
              </Text>
            </View>
          </View>
          <View style={styles.pillRow}>
            <TouchableOpacity
              style={[styles.pill, language === "fr" ? styles.pillActive : styles.pillInactive]}
              onPress={() => changeAppLanguage(langMap["FR"])}
              activeOpacity={0.8}
            >
              <Text style={language === "fr" ? styles.pillTextActive : styles.pillTextInactive}>
                Français
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, language === "ht" ? styles.pillActive : styles.pillInactive]}
              onPress={() => changeAppLanguage(langMap["HT"])}
              activeOpacity={0.8}
            >
              <Text style={language === "ht" ? styles.pillTextActive : styles.pillTextInactive}>
                Kreyòl
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Fiscal Year ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(245,158,11,0.1)" }]}>
              <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{t("Année fiscale")}</Text>
              <Text style={styles.cardDesc}>
                {t("parametreScreen.annee_fiscale_sélectionnee")}
              </Text>
            </View>
          </View>
          <View style={styles.fiscalBox}>
            <Text style={styles.fiscalYear}>
              {selectedFiscalYear?.anneeFiscale}
            </Text>
            <Text style={styles.fiscalPeriod}>
              {i18n.language === "ht"
                ? selectedFiscalYear?.labelFiscale
                    ?.replace("Octobre", "Oktòb")
                    .replace("Septembre", "Septanm")
                : selectedFiscalYear?.labelFiscale}
            </Text>
          </View>
        </View>

        {/* ── About ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(99,102,241,0.1)" }]}>
              <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                {t("parametreScreen.a_propos")}
              </Text>
              <Text style={styles.cardDesc}>
                {t("parametreScreen.texte_a_propos")}
              </Text>
            </View>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              {t("parametreScreen.version_a_propos")} 1.0 MVP
            </Text>
          </View>
        </View>

        {/* ── Login (unauthenticated) ── */}
        {!user && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(217,38,61,0.1)" }]}>
                <FontAwesome5 name="shield-alt" size={18} color="#D7263D" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>
                  {t("parametreScreen.acces_restreint")}
                </Text>
                <Text style={styles.cardDesc}>
                  {t("parametreScreen.reserve_au_personnel_autorise")}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRoleChange} activeOpacity={0.8}>
              <FontAwesome5 name="lock" size={14} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {t("parametreScreen.connexion")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // ── Header ──
  header: {
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerIconRow: {
    marginBottom: 10,
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    gap: 4,
  },
  userChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  // ── Cards container ──
  cards: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Language pills ──
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: "#2563EB",
  },
  pillInactive: {
    backgroundColor: "#F3F4F6",
  },
  pillTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pillTextInactive: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  // ── Fiscal year ──
  fiscalBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  fiscalYear: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  fiscalPeriod: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Version badge ──
  versionBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  versionText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  // ── Primary button ──
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
