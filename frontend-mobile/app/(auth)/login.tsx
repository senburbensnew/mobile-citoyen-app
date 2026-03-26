import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import * as Clipboard from "expo-clipboard";
import "../../i18n/i18n";
import { useTranslation } from "react-i18next";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginError {
  message?: string;
  code?: string;
}

type FocusedField = "username" | "password" | null;

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const { width } = Dimensions.get("window");

  const cardWidth = useMemo(() => {
    return width > 1000
      ? width * 0.4
      : width > 800
      ? width * 0.5
      : width > 600
      ? width * 0.7
      : width * 0.9;
  }, [width]);

  const isDisabled = useMemo(
    () =>
      credentials.username.trim() === "" ||
      credentials.password.trim() === "" ||
      isLocked,
    [credentials.username, credentials.password, isLocked],
  );

  const updateCredentials = useCallback(
    (field: keyof LoginCredentials, value: string) => {
      setCredentials((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copié", "Texte copié dans le presse-papier");
  };

  const handleLogin = async () => {
    setError("");

    if (isLocked) {
      setError(
        t(
          "login_screen.compte_bloque",
          "Trop de tentatives. Réessayez dans 5 minutes.",
        ),
      );
      return;
    }

    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError(
        t(
          "login_screen.champs_obligatoires",
          "Tous les champs sont obligatoires",
        ),
      );
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials.username, credentials.password);
      setFailedAttempts(0);
      router.replace("/(root)");
    } catch (err) {
      const error = err as LoginError;
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 5) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
        }, 300000);
      }

      if (
        error.message?.includes("network") ||
        error.message?.includes("Network")
      ) {
        setError(
          t(
            "login_screen.erreur_reseau",
            "Erreur de réseau. Vérifiez votre connexion.",
          ),
        );
      } else if (
        error.message?.includes("timeout") ||
        error.message?.includes("Timeout")
      ) {
        setError(
          t("login_screen.timeout", "Temps de réponse dépassé. Réessayez."),
        );
      } else {
        setError(
          error.message ||
            t(
              "login_screen.identifiants_incorrects",
              "Identifiants incorrects",
            ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const inputBorderColor = (field: FocusedField) => {
    if (isLoading || isLocked) return "#F3F4F6";
    if (focusedField === field) return "#2563EB";
    return "#E5E7EB";
  };

  const inputIconColor = (field: FocusedField) =>
    focusedField === field ? "#2563EB" : "#9CA3AF";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#1A3C90", "#D7263D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* ── Logo ── */}
            <View style={styles.logoArea}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logoImage}
                  accessibilityLabel={t(
                    "login_screen.logo",
                    "Logo de l'application",
                  )}
                />
              </View>
              <View style={styles.flagRow}>
                <Text style={styles.republicText}>
                  {t("login_screen.republique_haiti", "République d'Haïti")}
                </Text>
                <View style={styles.flagDots}>
                  <View style={[styles.dot, { backgroundColor: "#2563eb" }]} />
                  <View style={[styles.dot, { backgroundColor: "#dc2626" }]} />
                </View>
              </View>
            </View>

            {/* ── Form Card ── */}
            <View style={[styles.card, { width: cardWidth }]}>
              {/* Card header */}
              <View style={styles.cardTitleArea}>
                <Text style={styles.cardTitle}>
                  {t(
                    "login_screen.connexion_securisee",
                    "Connexion Sécurisée",
                  )}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {t(
                    "login_screen.saisissez_vos_identifiants_pour_acceder_au_dashboard.",
                    "Saisissez vos identifiants pour accéder au dashboard.",
                  )}
                </Text>
              </View>

              {/* Lockout banner */}
              {isLocked && (
                <View style={styles.bannerWarning}>
                  <Feather name="alert-triangle" size={16} color="#d97706" />
                  <Text style={styles.bannerWarningText}>
                    {t(
                      "login_screen.compte_bloque",
                      "Trop de tentatives. Réessayez dans 5 minutes.",
                    )}
                  </Text>
                </View>
              )}

              {/* Error banner */}
              {error ? (
                <View style={styles.bannerError}>
                  <Feather name="alert-circle" size={16} color="#b91c1c" />
                  <Text style={styles.bannerErrorText}>{error}</Text>
                </View>
              ) : null}

              {/* Username */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  {t("login_screen.nom_utilisateur", "Nom d'utilisateur")}
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    {
                      borderColor: inputBorderColor("username"),
                      backgroundColor: isLoading ? "#F9FAFB" : "#fff",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color={inputIconColor("username")}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    value={credentials.username}
                    onChangeText={(v) => updateCredentials("username", v)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t(
                      "login_screen.entrez_votre_nom_utilisateur",
                      "Entrez votre nom d'utilisateur",
                    )}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={!isLoading && !isLocked}
                    returnKeyType="next"
                    accessibilityLabel={t(
                      "login_screen.nom_utilisateur",
                      "Nom d'utilisateur",
                    )}
                    accessibilityRole="text"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  {t("login_screen.mot_de_passe", "Mot de passe")}
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    {
                      borderColor: inputBorderColor("password"),
                      backgroundColor: isLoading ? "#F9FAFB" : "#fff",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={inputIconColor("password")}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={credentials.password}
                    onChangeText={(v) => updateCredentials("password", v)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    editable={!isLoading && !isLocked}
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    accessibilityLabel={t(
                      "login_screen.mot_de_passe",
                      "Mot de passe",
                    )}
                    accessibilityRole="text"
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeButton}
                    disabled={isLoading}
                    accessibilityLabel={
                      showPassword
                        ? t(
                            "login_screen.cacher_mot_de_passe",
                            "Cacher le mot de passe",
                          )
                        : t(
                            "login_screen.afficher_mot_de_passe",
                            "Afficher le mot de passe",
                          )
                    }
                    accessibilityRole="button"
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={isLoading ? "#9CA3AF" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Failed attempts */}
              {failedAttempts > 0 && !isLocked && (
                <Text style={styles.attemptsText}>
                  {t("login_screen.tentatives_echouees", "Tentatives échouées")}
                  : {failedAttempts}/5
                </Text>
              )}

              {/* Login button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isDisabled || isLoading}
                accessibilityLabel={t(
                  "login_screen.se_connecter",
                  "Se connecter",
                )}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDisabled || isLoading }}
                style={[
                  styles.loginButton,
                  { opacity: isDisabled || isLoading ? 0.6 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#1A3C90", "#1e40af"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.loginButtonText}>
                        {t("login_screen.se_connecter", "Se connecter")}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Back link */}
              <Link href="/(root)" asChild>
                <TouchableOpacity style={styles.backRow} activeOpacity={0.7}>
                  <Ionicons name="arrow-back" size={16} color="#6B7280" />
                  <Text style={styles.backText}>
                    {t("login_screen.aller_accueil", "Aller à l'accueil")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* ── Demo card (glass, outside white card) ── */}
            <View style={[styles.demoCard, { width: cardWidth }]}>
              <View style={styles.demoHeader}>
                <Ionicons
                  name="flask-outline"
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.demoTitle}>
                  {t("login_screen.compte_demo", "Compte de démonstration")}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => copyToClipboard("Commis1112")}
                activeOpacity={0.7}
                accessibilityLabel="Copier le nom d'utilisateur"
              >
                <View style={styles.demoRow}>
                  <Text style={styles.demoLabel}>
                    {t("login_screen.nom_utilisateur", "Nom d'utilisateur")}:{" "}
                  </Text>
                  <Text style={styles.demoValue}>Commis1112</Text>
                  <Feather
                    name="copy"
                    size={12}
                    color="rgba(255,255,255,0.7)"
                    style={styles.demoIcon}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => copyToClipboard("Pass123$")}
                activeOpacity={0.7}
                accessibilityLabel="Copier le mot de passe"
              >
                <View style={styles.demoRow}>
                  <Text style={styles.demoLabel}>
                    {t("login_screen.mot_de_passe", "Mot de passe")}:{" "}
                  </Text>
                  <Text style={styles.demoValue}>Pass123$</Text>
                  <Feather
                    name="copy"
                    size={12}
                    color="rgba(255,255,255,0.7)"
                    style={styles.demoIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* ── Security footer ── */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t(
                  "login_screen.interface_securisee",
                  "Cette interface est sécurisée et réservée au personnel autorisé.",
                )}
              </Text>
              <Text style={styles.footerText}>
                {t(
                  "login_screen.tentative_non_autorisee",
                  "Toute tentative d'accès non autorisée sera signalée.",
                )}
              </Text>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  gradient: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    gap: 16,
  },
  // ── Logo ──
  logoArea: { alignItems: "center", gap: 10 },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 8,
    borderWidth: 4,
    borderColor: "#facc15",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    overflow: "hidden",
  },
  logoImage: { width: "100%", height: "100%", resizeMode: "contain" },
  flagRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  republicText: { fontSize: 14, color: "#dbeafe" },
  flagDots: { flexDirection: "row", gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  // ── Form card ──
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 16,
  },
  cardTitleArea: { alignItems: "center", gap: 6 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  cardSubtitle: { fontSize: 13, color: "#6B7280", textAlign: "center" },
  // ── Banners ──
  bannerWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 1,
    borderRadius: 10,
  },
  bannerWarningText: { color: "#92400e", fontSize: 12, flex: 1 },
  bannerError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
  },
  bannerErrorText: { color: "#b91c1c", fontSize: 12, flex: 1 },
  // ── Fields ──
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: "500", color: "#374151" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
  },
  inputIcon: { paddingLeft: 12 },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  eyeButton: { padding: 12 },
  attemptsText: {
    fontSize: 12,
    color: "#dc2626",
    textAlign: "center",
    marginTop: -4,
  },
  // ── Login button ──
  loginButton: { borderRadius: 10, overflow: "hidden" },
  loginButtonGradient: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  // ── Back link ──
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  backText: { color: "#6B7280", fontSize: 14 },
  // ── Demo card ──
  demoCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  demoTitle: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
    fontSize: 14,
  },
  demoRow: { flexDirection: "row", alignItems: "center" },
  demoLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  demoValue: { fontSize: 12, color: "#fff", fontWeight: "600" },
  demoIcon: { marginLeft: 6 },
  // ── Footer ──
  footer: { alignItems: "center", gap: 4, paddingHorizontal: 8 },
  footerText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
