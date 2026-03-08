import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Switch,
  Pressable,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesome5 } from "@expo/vector-icons";
import { t } from "i18next";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Line, Path, Polyline } from "react-native-svg";

const Citoyen = () => {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/(root)"); // ✅ redirect
  };

  const OtherCard = ({
    title = "",
    titleColor = "text-gray-700",
    borderColor = "",
    children,
  }) => {
    return (
      <View
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
        }}
        className={`w-full my-2 bg-white rounded-lg p-4 ${borderColor}`}
      >
        {/* ✅ Corrected className syntax */}
        <Text className={`text-lg font-semibold mb-4 ${titleColor}`}>
          {title}
        </Text>
        {children}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 3,
        alignItems: "center",
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="py-2">
        <View style={styles.cardWrapper}>
          {user && (
            <View style={[styles.section, styles.profileSection]}>
              <View style={styles.profileHeader} className="items-center">
                <View style={{ marginRight: 12 }} className="relative">
                  {/* Avatar Circle */}
                  <View className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8"
                    >
                      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <Circle cx="12" cy="7" r="4" />
                    </Svg>
                  </View>

                  {/* Camera Button */}
                  <TouchableOpacity className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400">
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <Circle cx="12" cy="13" r="3" />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.profileName}>{user}</Text>
                  <View className="mt-2 flex-row items-center justify-center rounded-md border px-2 py-0.5 w-fit bg-green-500/20 border-green-400/30">
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <Path d="M21.801 10A10 10 0 1 1 17 3.335" />
                      <Path d="m9 11 3 3L22 4" />
                    </Svg>
                    <Text className="text-green-100 text-xs font-medium">
                      En ligne
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        <View
          style={styles.cardWrapper}
          className="justify-center items-center"
        >
          <OtherCard title={"⚡ Informations Personnelles"}>
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 4,
                    color: "#374151",
                  }}
                >
                  Nom complet
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 16,
                    backgroundColor: "#f3f3f5",
                  }}
                  value=""
                  editable={false}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 4,
                    color: "#374151",
                  }}
                >
                  Adresse email
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 16,
                    backgroundColor: "#f3f3f5",
                  }}
                  value=""
                  keyboardType="email-address"
                  editable={false}
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 4,
                    color: "#374151",
                  }}
                >
                  Téléphone
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 16,
                    backgroundColor: "#f3f3f5",
                  }}
                  value=""
                  keyboardType="phone-pad"
                  editable={false}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 4,
                    color: "#374151",
                  }}
                >
                  Département
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 16,
                    backgroundColor: "#f3f3f5",
                  }}
                  value=""
                  editable={false}
                />
              </View>
            </View>
          </OtherCard>
          <OtherCard title={"🛠️ Preferences"}>
            <View style={{ gap: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    Notifications email
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}
                  >
                    Recevoir les notifications par email
                  </Text>
                </View>
                <Switch />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    Notifications push
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}
                  >
                    Alertes en temps réel
                  </Text>
                </View>
                <Switch />
              </View>
            </View>
          </OtherCard>
          <OtherCard title={"Actions Rapides"}>
            <View style={{ gap: 12 }}>
              {/* Change Password Button */}
              <Pressable
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    height: 36,
                    width: "100%",
                  },
                  pressed && { backgroundColor: "#f3f4f6" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    height: 36,
                    width: "100%",
                  }}
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                  >
                    <Path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
                    <Path d="m21 2-9.6 9.6" />
                    <Circle cx="7.5" cy="15.5" r="5.5" />
                  </Svg>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#000000",
                    }}
                  >
                    Changer le mot de passe
                  </Text>
                </View>
              </Pressable>
              {/* 2FA Management Button */}
              <Pressable
                style={({ pressed }) => [
                  {
                    flexDirection: "row",

                    alignItems: "center",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    height: 36,
                    width: "100%",
                  },
                  pressed && { backgroundColor: "#f3f4f6" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    height: 36,
                    width: "100%",
                  }}
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                  >
                    <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </Svg>
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#000000",
                    }}
                  >
                    Gestion 2FA
                  </Text>
                </View>
              </Pressable>
            </View>
          </OtherCard>
          <OtherCard
            title={"Zones de securite"}
            titleColor={"text-red-700"}
            borderColor={"border border-red-500"}
          >
            <>
              <View className="p-3 bg-red-50 rounded-lg">
                <View className="flex-row items-center mb-2">
                  <View className="w-4 h-4 justify-center items-center mr-2">
                    <Text className="text-red-600 text-base font-bold">🛡️</Text>
                  </View>
                  <Text className="text-sm text-red-700 font-medium">
                    Session sécurisée inactive
                  </Text>
                </View>
                <Text className="text-xs text-red-600">
                  Votre session n'est pas protégée par authentification à deux
                  facteurs
                </Text>
              </View>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 8 }} // same as "mr-2"
              >
                <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <Polyline points="16 17 21 12 16 7" />
                <Line x1="21" y1="12" x2="9" y2="12" />
              </Svg>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <FontAwesome5 name="sign-out-alt" size={14} color="#fff" />
                <Text style={styles.logoutText}>{t("Déconnexion")}</Text>
              </TouchableOpacity>
            </>
          </OtherCard>
          <View
            className="bg-white rounded-lg p-5 w-full mt-2"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <Text className="text-center text-gray-500 text-xs">
              Portail Gouvernemental de Transparence Budgétaire
            </Text>
            <Text className="text-center text-gray-500 text-xs mt-1">
              République d'Haïti • Version 1.0
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Citoyen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  cardWrapper: {
    width: width * 0.95,
    alignSelf: "center",
  },
  section: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 6,
  },
  profileSection: {
    backgroundColor: "#1B3997",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },

  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  profileLabel: {
    fontSize: 12,
    color: "#fff",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7000B",
    color: "#fff",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 13,
  },
});
