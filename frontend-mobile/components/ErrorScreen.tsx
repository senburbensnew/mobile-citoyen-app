import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SafeScreen from "./SafeScreen";

export default function ErrorScreen({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const title = t("main_layout.app_title", "My App");
  const oops = t("main_layout.oops", "Oops!");
  const retryText = t("main_layout.retry_text", "Retry");

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
          <Text style={styles.title}>{oops}</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>{retryText}</Text>
          </TouchableOpacity>
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
  errorMessage: {
    fontSize: 16,
    color: "#FF4444",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
