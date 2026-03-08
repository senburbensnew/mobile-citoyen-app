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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import Svg, { Path } from "react-native-svg";
import * as Clipboard from "expo-clipboard";
import "../../i18n/i18n";
import { useTranslation } from "react-i18next";

// Types for better TypeScript support
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginError {
  message?: string;
  code?: string;
}

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const { width, height } = Dimensions.get("window");

  // Memoized calculations
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
    [credentials.username, credentials.password, isLocked]
  );

  // Memoized credential updates
  const updateCredentials = useCallback(
    (field: keyof LoginCredentials, value: string) => {
      setCredentials((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copié", "Texte copié dans le presse-papier");
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Check if account is locked
    if (isLocked) {
      setError(
        t(
          "login_screen.compte_bloque",
          "Trop de tentatives. Réessayez dans 5 minutes."
        )
      );
      return;
    }

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError(
        t(
          "login_screen.champs_obligatoires",
          "Tous les champs sont obligatoires"
        )
      );
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials.username, credentials.password);
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      router.replace("/(root)");
    } catch (err) {
      const error = err as LoginError;
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
        }, 300000); // 5 minutes
      }

      // More specific error handling
      if (
        error.message?.includes("network") ||
        error.message?.includes("Network")
      ) {
        setError(
          t(
            "login_screen.erreur_reseau",
            "Erreur de réseau. Vérifiez votre connexion."
          )
        );
      } else if (
        error.message?.includes("timeout") ||
        error.message?.includes("Timeout")
      ) {
        setError(
          t("login_screen.timeout", "Temps de réponse dépassé. Réessayez.")
        );
      } else {
        setError(
          error.message ||
            t("login_screen.identifiants_incorrects", "Identifiants incorrects")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#1A3C90", "#D7263D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View className="items-center mb-6">
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#ffffff",
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
                  marginBottom: 12,
                }}
              >
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    borderRadius: 40,
                  }}
                  accessibilityLabel={t(
                    "login_screen.logo",
                    "Logo de l'application"
                  )}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: "#dbeafe" }}>
                  {t("login_screen.republique_haiti", "République d'Haïti")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 8,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#2563eb",
                      marginRight: 4,
                      borderRadius: "100%",
                    }}
                  />
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#dc2626",
                      borderRadius: "100%",
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                width: cardWidth,
                backgroundColor: "white",
                borderRadius: 16,
                padding: 24,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                marginVertical: 16,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 12,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#4B5563",
                  }}
                >
                  {t("login_screen.connexion_securisee", "Connexion Sécurisée")}
                </Text>
                <Text
                  style={{
                    color: "#4b5563",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {t(
                    "login_screen.saisissez_vos_identifiants_pour_acceder_au_dashboard.",
                    "Saisissez vos identifiants pour accéder au dashboard."
                  )}
                </Text>
              </View>

              {/* Lockout Warning */}
              {isLocked && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: "#fef3c7",
                    borderColor: "#f59e0b",
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Feather name="alert-triangle" size={16} color="#d97706" />
                  <Text
                    style={{
                      color: "#92400e",
                      fontSize: 12,
                      marginLeft: 8,
                      flex: 1,
                    }}
                  >
                    {t(
                      "login_screen.compte_bloque",
                      "Trop de tentatives. Réessayez dans 5 minutes."
                    )}
                  </Text>
                </View>
              )}

              {/* Error Message */}
              {error ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: "#fef2f2",
                    borderColor: "#fecaca",
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Feather name="alert-circle" size={16} color="#b91c1c" />
                  <Text
                    style={{
                      color: "#b91c1c",
                      fontSize: 12,
                      marginLeft: 8,
                      flex: 1,
                    }}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Username Input */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    color: "#374151",
                    marginBottom: 4,
                    fontWeight: "500",
                  }}
                >
                  {t("login_screen.nom_utilisateur", "Nom d'utilisateur")}
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isLoading ? "#9ca3af" : "#d1d5db",
                    borderRadius: 8,
                    padding: 12,
                    color: "#111827",
                    backgroundColor: isLoading ? "#f3f4f6" : "white",
                  }}
                  value={credentials.username}
                  onChangeText={(text) => updateCredentials("username", text)}
                  placeholder={t(
                    "login_screen.entrez_votre_nom_utilisateur",
                    "Entrez votre nom d'utilisateur"
                  )}
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoComplete="username"
                  editable={!isLoading && !isLocked}
                  returnKeyType="next"
                  accessibilityLabel={t(
                    "login_screen.nom_utilisateur",
                    "Nom d'utilisateur"
                  )}
                  accessibilityRole="text"
                />
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    color: "#374151",
                    marginBottom: 4,
                    fontWeight: "500",
                  }}
                >
                  {t("login_screen.mot_de_passe", "Mot de passe")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: isLoading ? "#9ca3af" : "#d1d5db",
                    borderRadius: 8,
                    backgroundColor: isLoading ? "#f3f4f6" : "white",
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      padding: 12,
                      color: "#111827",
                    }}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={credentials.password}
                    onChangeText={(text) => updateCredentials("password", text)}
                    editable={!isLoading && !isLocked}
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    accessibilityLabel={t(
                      "login_screen.mot_de_passe",
                      "Mot de passe"
                    )}
                    accessibilityRole="text"
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={{ padding: 12 }}
                    disabled={isLoading}
                    accessibilityLabel={
                      showPassword
                        ? t(
                            "login_screen.cacher_mot_de_passe",
                            "Cacher le mot de passe"
                          )
                        : t(
                            "login_screen.afficher_mot_de_passe",
                            "Afficher le mot de passe"
                          )
                    }
                    accessibilityRole="button"
                  >
                    {showPassword ? (
                      <Feather
                        name="eye-off"
                        size={20}
                        color={isLoading ? "#9ca3af" : "#555"}
                      />
                    ) : (
                      <Feather
                        name="eye"
                        size={20}
                        color={isLoading ? "#9ca3af" : "#555"}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Failed Attempts Counter */}
              {failedAttempts > 0 && !isLocked && (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      color: "#dc2626",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {t(
                      "login_screen.tentatives_echouees",
                      "Tentatives échouées"
                    )}
                    : {failedAttempts}/5
                  </Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isDisabled || isLoading}
                accessibilityLabel={t(
                  "login_screen.se_connecter",
                  "Se connecter"
                )}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDisabled || isLoading }}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  overflow: "hidden",
                  opacity: isDisabled || isLoading ? 0.6 : 1,
                }}
              >
                <LinearGradient
                  colors={["#1e3a8a", "#1e40af"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 48,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#1e40af",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                      </Svg>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          fontWeight: "600",
                          marginLeft: 8,
                        }}
                      >
                        {t("login_screen.se_connecter", "Se connecter")}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Back to Settings */}
              <View
                style={{
                  paddingVertical: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: "gray", fontSize: 16, marginRight: 4 }}>
                  ←
                </Text>
                <Link href="/(root)/parametres">
                  <Text
                    style={{
                      color: "gray",
                      textDecorationLine: "none",
                      fontSize: 16,
                    }}
                  >
                    {t(
                      "login_screen.retour_aux_parametres",
                      "Retour aux paramètres"
                    )}
                  </Text>
                </Link>
              </View>

              {/* Demo Account */}
              <View>
                <View
                  style={{
                    backgroundColor: "#F0FDF4",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 5,
                    borderWidth: 1,
                    borderColor: "#BBF7D0",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 6,
                      color: "#166534",
                    }}
                  >
                    {t("login_screen.compte_demo", "Compte de démonstration")} :
                  </Text>

                  <TouchableOpacity
                    onPress={() => copyToClipboard("Commis1112")}
                    className="active:opacity-70"
                    accessibilityLabel="Copier le nom d'utilisateur"
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#166534",
                          fontWeight: "500",
                        }}
                      >
                        {t("login_screen.nom_utilisateur", "Nom d'utilisateur")}
                        :{" "}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#15803d" }}>
                        Commis1112
                      </Text>
                      <Feather
                        name="copy"
                        size={12}
                        color="#15803d"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => copyToClipboard("Pass123$")}
                    className="active:opacity-70"
                    accessibilityLabel="Copier le mot de passe"
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#166534",
                          fontWeight: "500",
                        }}
                      >
                        {t("login_screen.mot_de_passe", "Mot de passe")}:{" "}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#15803d" }}>
                        Pass123$
                      </Text>
                      <Feather
                        name="copy"
                        size={12}
                        color="#15803d"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <View
                style={{
                  marginTop: 16,
                  backgroundColor: "#f9fafb",
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <Text
                  style={{
                    color: "#4b5563",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  {t(
                    "login_screen.interface_securisee",
                    "Cette interface est sécurisée et réservée au personnel autorisé."
                  )}
                </Text>
                <Text
                  style={{
                    color: "#4b5563",
                    textAlign: "center",
                    fontSize: 12,
                    lineHeight: 16,
                    marginTop: 4,
                  }}
                >
                  {t(
                    "login_screen.tentative_non_autorisee",
                    "Toute tentative d'accès non autorisée sera signalée."
                  )}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
