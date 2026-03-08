import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useAuth } from "@/hooks/useAuth";
import "../../i18n/i18n";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();
  const hideNotificationsTab = true;
  const hideProfileTab = true;
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <Header />,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 55,
          paddingBottom: 4,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) =>
            user ? (
              <Ionicons name="speedometer" color={color} size={size} />
            ) : (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          tabBarLabel: user ? t("root_tabs.dashboard") : t("root_tabs.accueil"),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" color={color} size={size} />
          ),
          tabBarLabel: "Notifications",
          href: hideNotificationsTab === true ? null : "/(root)/notifications",
          // tabBarStyle: { display: "none" },
          // tabBarButton: () => null,
        }}
      />
      {/*       <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            // <Ionicons name="lock-closed" color={color} size={size} />
            <Ionicons name="speedometer" color={color} size={size} />
          ),
          tabBarLabel: t("root_tabs.dashboard"),
          href: !user ? null : "/(root)/dashboard",
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" color={color} size={size} />
          ),
          tabBarLabel: t("root_tabs.profil"),
          href: hideProfileTab ? null : "/(root)/profile",
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          tabBarLabel: t("root_tabs.parametres"),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 200,
    marginBottom: 5,
  },
  title: {
    flexDirection: "row", // make items horizontal
    alignItems: "center", // vertically center items
    justifyContent: "space-between", // space out logo, title, FR, and bell
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 8,
  },
  langText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 12,
  },
  pickerWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  picker: {
    height: 45,
    width: 220,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // translucent glass effect
    color: "#fff", // text color
    paddingHorizontal: 12,
  },
  pickerItem: {
    fontSize: 14,
    color: "#fff",
  },
});
