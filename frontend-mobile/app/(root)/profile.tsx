import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import api from "@/lib/api";

const { width } = Dimensions.get("window");

const Citoyen = () => {
  const { t } = useTranslation();
  const { user, logout, roles, ministereId, sectionId, nom, prenom, email, sexe } = useAuth();

  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const openPwForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError(null);
    setShowPwForm(true);
  };

  const closePwForm = () => {
    setShowPwForm(false);
    setPwError(null);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPwError(t("profile_screen.password_mismatch"));
      return;
    }
    if (currentPassword === newPassword) {
      setPwError(t("profile_screen.password_same"));
      return;
    }
    setPwError(null);
    setPwSubmitting(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setShowPwForm(false);
      Alert.alert("", t("profile_screen.password_changed"));
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setPwError(serverErrors.join("\n"));
      } else {
        setPwError(
          err?.response?.data?.message || t("profile_screen.load_error")
        );
      }
    } finally {
      setPwSubmitting(false);
    }
  };

  const initials = `${(prenom || "").charAt(0)}${(nom || "").charAt(0)}`.toUpperCase() || (user || "?").charAt(0).toUpperCase();
  const fullName = `${prenom || ""} ${nom || ""}`.trim() || (user as string) || "";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.heroDecorTop} />
        <View style={styles.heroDecorBottom} />

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.heroName}>{fullName || user}</Text>

        {roles?.length > 0 && (
          <View style={styles.rolesRow}>
            {roles.map((r) => (
              <View key={r} style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.onlineChip}>
          <View style={styles.onlineDotSmall} />
          <Text style={styles.onlineText}>{t("common.online")}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* ── Personal info ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: "#EFF6FF" }]}>
              <MaterialIcons name="person" size={18} color="#2563EB" />
            </View>
            <Text style={styles.cardTitle}>
              {t("profile_screen.personal_info")}
            </Text>
          </View>

          <View>
            <InfoRow icon="badge" label={t("profile_screen.first_name")} value={prenom || "—"} />
            <InfoRow icon="person-outline" label={t("profile_screen.last_name")} value={nom || "—"} />
            <InfoRow icon="email" label={t("profile_screen.email")} value={email || "—"} />
            <InfoRow icon="wc" label={t("profile_screen.gender")} value={sexe || "—"} />
            {ministereId != null && (
              <InfoRow icon="account-balance" label={t("profile_screen.ministry")} value={String(ministereId)} />
            )}
            {sectionId != null && (
              <InfoRow icon="layers" label={t("profile_screen.section")} value={String(sectionId)} isLast />
            )}
          </View>
        </View>

        {/* ── Change password CTA ── */}
        {!showPwForm && (
          <TouchableOpacity style={styles.changePwButton} onPress={openPwForm} activeOpacity={0.88}>
            <View style={styles.changePwIconBox}>
              <MaterialIcons name="lock-outline" size={22} color="#fff" />
            </View>
            <View style={styles.changePwText}>
              <Text style={styles.changePwTitle}>{t("profile_screen.change_password")}</Text>
              <Text style={styles.changePwDesc}>{t("profile_screen.change_password_desc")}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        {/* ── Change password inline form ── */}
        {showPwForm && (
          <View style={styles.card}>
            <View style={styles.formHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: "#EFF6FF" }]}>
                <MaterialIcons name="lock-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>{t("profile_screen.change_password_title")}</Text>
              <TouchableOpacity onPress={closePwForm} style={styles.formClose}>
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {pwError && (
              <View style={styles.pwErrorBanner}>
                <MaterialIcons name="error-outline" size={15} color="#DC2626" />
                <Text style={styles.pwErrorText}>{pwError}</Text>
              </View>
            )}

            <PasswordField
              label={t("profile_screen.current_password")}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              show={showCurrent}
              onToggleShow={() => setShowCurrent((v) => !v)}
            />
            <PasswordField
              label={t("profile_screen.new_password")}
              value={newPassword}
              onChangeText={setNewPassword}
              show={showNew}
              onToggleShow={() => setShowNew((v) => !v)}
            />
            <PasswordField
              label={t("profile_screen.confirm_password")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
            />

            <TouchableOpacity
              style={[styles.saveButton, pwSubmitting && { opacity: 0.6 }]}
              onPress={handleChangePassword}
              disabled={pwSubmitting}
              activeOpacity={0.85}
            >
              {pwSubmitting
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.saveText}>{t("profile_screen.save")}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={closePwForm} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{t("profile_screen.cancel")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Security zone ── */}
        <View style={[styles.card, styles.dangerCard]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: "#FEF2F2" }]}>
              <MaterialIcons name="security" size={18} color="#DC2626" />
            </View>
            <Text style={[styles.cardTitle, { color: "#DC2626" }]}>
              {t("profile_screen.security_zone")}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={14} color="#fff" />
            <Text style={styles.logoutText}>{t("profile_screen.logout")}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("profile_screen.app_footer")}</Text>
          <Text style={styles.footerVersion}>{t("profile_screen.app_version")}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

type InfoRowProps = { icon: string; label: string; value: string; isLast?: boolean };

const InfoRow = ({ icon, label, value, isLast = false }: InfoRowProps) => (
  <View style={[styles.infoRow, !isLast && styles.separator]}>
    <View style={styles.infoIconBox}>
      <MaterialIcons name={icon as any} size={16} color="#6B7280" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  </View>
);

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
};

const PasswordField = ({ label, value, onChangeText, show, onToggleShow }: PasswordFieldProps) => (
  <View style={styles.pwFieldWrapper}>
    <Text style={styles.pwFieldLabel}>{label}</Text>
    <View style={styles.pwInputRow}>
      <TextInput
        style={styles.pwInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={onToggleShow} style={styles.pwEyeBtn}>
        <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  </View>
);

export default Citoyen;

// ── Styles ─────────────────────────────────────────────────────────────────────

const BLUE = "#1B3997";
const BLUE_LIGHT = "#2563EB";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContent: { paddingBottom: 40 },

  hero: {
    backgroundColor: BLUE,
    paddingTop: 40, paddingBottom: 36,
    alignItems: "center", overflow: "hidden", position: "relative",
  },
  heroDecorTop: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)", top: -80, right: -60,
  },
  heroDecorBottom: {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)", bottom: -60, left: -40,
  },
  avatarWrapper: { position: "relative", marginBottom: 14 },
  avatarRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center", justifyContent: "center",
  },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: BLUE_LIGHT, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: 1 },
  onlineDot: {
    position: "absolute", bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#22C55E", borderWidth: 2, borderColor: BLUE,
  },
  heroName: { fontSize: 22, fontWeight: "700", color: "#fff", letterSpacing: 0.3, marginBottom: 8 },
  rolesRow: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
    gap: 6, marginBottom: 10, paddingHorizontal: 24,
  },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3,
  },
  roleBadgeText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  onlineChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1, borderColor: "rgba(34,197,94,0.35)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, gap: 6,
  },
  onlineDotSmall: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#22C55E" },
  onlineText: { color: "#BBF7D0", fontSize: 12, fontWeight: "500" },

  body: { paddingHorizontal: width * 0.04, paddingTop: 20, gap: 14 },

  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  dangerCard: { borderWidth: 1, borderColor: "#FECACA" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  cardIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },

  stateRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  stateText: { color: "#6B7280", fontSize: 14 },

  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, gap: 12 },
  infoIconBox: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center",
  },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11, color: "#9CA3AF", fontWeight: "500",
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2,
  },
  infoValue: { fontSize: 15, color: "#111827", fontWeight: "500" },
  separator: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },

  changePwButton: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: BLUE_LIGHT, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 18,
    shadowColor: BLUE_LIGHT, shadowOpacity: 0.35,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  changePwIconBox: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  changePwText: { flex: 1 },
  changePwTitle: { fontSize: 15, fontWeight: "700", color: "#fff" },
  changePwDesc: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },

  formHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  formClose: { padding: 4, marginLeft: "auto" },

  pwErrorBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 16,
  },
  pwErrorText: { flex: 1, fontSize: 13, color: "#DC2626", lineHeight: 18 },
  pwFieldWrapper: { marginBottom: 14 },
  pwFieldLabel: {
    fontSize: 12, fontWeight: "600", color: "#374151",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4,
  },
  pwInputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#D1D5DB",
    borderRadius: 10, backgroundColor: "#F9FAFB", paddingHorizontal: 12,
  },
  pwInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: "#111827" },
  pwEyeBtn: { padding: 4 },

  saveButton: {
    backgroundColor: BLUE_LIGHT, borderRadius: 12,
    paddingVertical: 14, alignItems: "center", marginTop: 4, marginBottom: 10,
  },
  saveText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  cancelButton: {
    borderWidth: 1, borderColor: "#D1D5DB",
    borderRadius: 12, paddingVertical: 13, alignItems: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#374151" },

  logoutButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#DC2626", paddingVertical: 13, borderRadius: 12, gap: 8,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  footer: { alignItems: "center", paddingVertical: 8 },
  footerText: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  footerVersion: { fontSize: 11, color: "#D1D5DB", marginTop: 3 },
});
