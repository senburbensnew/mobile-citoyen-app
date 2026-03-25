import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SafeScreen from "./SafeScreen";

export default function LoadingScreen() {
  const { t } = useTranslation();
  const title = t("main_layout.app_title", "My App");
  const loadingText = t("main_layout.loading", "Loading...");

  return (
    <SafeScreen>
      <LinearGradient
        colors={["#0A2472", "#1E3A8A", "#D7263D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <StatusBar hidden />
        <View style={styles.container}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>{title}</Text>
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={styles.spinner}
          />
          <Text style={styles.subtitle}>{loadingText}</Text>
        </View>
      </LinearGradient>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 16,
  },
  spinner: {
    marginTop: 8,
  },
});
