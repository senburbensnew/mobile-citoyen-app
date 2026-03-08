import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  Image,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { t } from "i18next";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { changeAppLanguage } from "@/services/helpers";

export default function Settings() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const { user } = useAuth();
  const router = useRouter();

  const langMap = {
    FR: "fr",
    HT: "ht",
  } as const;

  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );

  function handleRoleChange() {
    router.push({
      pathname: "(auth)/login",
    });
  }

  const handleProfile = () => {
    router.replace("/(root)/profile"); // ✅ redirect
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>⚙️ {t("parametreScreen.titre")}</Text>

            {user && (
              <View style={styles.section}>
                <View>
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons
                      name="person-outline"
                      color="#6366F1"
                      size={20}
                    />
                    <Text className="text-lg font-semibold text-gray-900 ml-2">
                      {t("parametreScreen.profil", "Profil")}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 mb-3">
                    {t("parametreScreen.profil_desc", "Consultez votre profil")}
                  </Text>

                  <TouchableOpacity
                    style={{ backgroundColor: "#2563EB" }}
                    className="border border-gray-200 rounded-lg py-3 px-4"
                    onPress={() => {
                      handleProfile();
                    }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="flex-row items-center">
                        {/*                         <MaterialIcons
                          name="person-outline"
                          color="#6366F1"
                          size={20}
                        /> */}
                        <Text className="text-white text-base font-medium ml-3">
                          Voir Profil
                        </Text>
                      </Text>
                      <MaterialIcons
                        name="arrow-forward"
                        color="white"
                        size={16}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🌐 {t("parametreScreen.langue_interface")}
              </Text>
              <Text style={styles.sectionDesc}>
                {t("parametreScreen.choisir_langue_affichage")}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    // i18n.changeLanguage("fr");
                    changeAppLanguage(langMap["FR"]);
                  }}
                  style={[
                    styles.langButton,
                    language === "fr"
                      ? styles.langSelected
                      : styles.langUnselected,
                  ]}
                >
                  <Text
                    style={
                      language === "fr"
                        ? styles.langTextSelected
                        : styles.langTextUnselected
                    }
                  >
                    Français
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // i18n.changeLanguage("ht");
                    changeAppLanguage(langMap["HT"]);
                  }}
                  style={[
                    styles.langButton,
                    language === "ht"
                      ? styles.langSelected
                      : styles.langUnselected,
                  ]}
                >
                  <Text
                    style={
                      language === "ht"
                        ? styles.langTextSelected
                        : styles.langTextUnselected
                    }
                  >
                    Kreyòl
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 {t("Année fiscale")}</Text>
              <Text style={styles.sectionDesc}>
                {t("parametreScreen.annee_fiscale_sélectionnee")}
              </Text>
              <View style={styles.fiscalContainer}>
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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                ℹ️ {t("parametreScreen.a_propos")}
              </Text>
              <Text style={styles.sectionDesc}>
                {t("parametreScreen.texte_a_propos")}
              </Text>
              <Text style={styles.version}>
                {t("parametreScreen.version_a_propos")} 1.0 MVP
              </Text>
            </View>

            {!user && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  👤 {t("parametreScreen.acces_restreint")}
                </Text>
                <Text style={styles.sectionDesc}>
                  {t("parametreScreen.reserve_au_personnel_autorise")}
                </Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    onPress={() => handleRoleChange()}
                    style={[styles.roleButton]}
                  >
                    <FontAwesome5
                      name="shield-alt"
                      size={14}
                      color="#fff"
                      style={styles.icon}
                    />
                    <Text style={styles.roleText}>
                      {t("parametreScreen.connexion")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
  },
  cardWrapper: {
    width: width * 0.95,
    alignSelf: "center",
    height: "100%",
  },
  card: {
    padding: 16,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 12,
    height: "100%",
  },
  title: {
    fontSize: 18, // same as headerText in TotalBudgetSection
    fontWeight: "600",
    marginBottom: 16,
  },
  section: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14, // same as subHeader in TotalBudgetSection
    fontWeight: "500",
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12, // small description
    color: "#6B7280",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  langSelected: {
    backgroundColor: "#2563EB",
  },
  langUnselected: {
    backgroundColor: "#F3F4F6",
  },
  langTextSelected: {
    color: "#fff",
    fontSize: 14, // increased from 12 to match subHeader scale
  },
  langTextUnselected: {
    color: "#374151",
    fontSize: 14, // match selected
  },
  fiscalContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  fiscalYear: {
    fontWeight: "500",
    fontSize: 16, // match boxValue style in TotalBudgetSection
  },
  fiscalPeriod: {
    fontSize: 14, // increased from 10
    color: "#9CA3AF",
  },
  version: {
    fontSize: 12, // slightly bigger than before
    color: "#9CA3AF",
    marginTop: 4,
  },
  roleButtons: {
    marginTop: 8,
    gap: 8,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  roleText: {
    color: "#fff",
    fontSize: 14, // increase from 12
  },
});
