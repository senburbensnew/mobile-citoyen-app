import { loadSavedLanguage } from "@/services/helpers";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import SafeScreen from "../components/SafeScreen";
import { AuthProvider } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { RootState, store } from "../store";
import { setSelectedFiscalYear } from "../store/fiscalYearsSlice";
import "./globals.css";
import FiscalYear from "@/models/FiscalYear";

loadSavedLanguage();

SplashScreen.preventAutoHideAsync()

function LoadingScreen() {
  const { t } = useTranslation();

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
            resizeMode="contain"
          />
          <Text style={styles.title}>{t("main_layout.app_title")}</Text>
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={styles.spinner}
          />
          <Text style={styles.subtitle}>{t("main_layout.loading")}</Text>
        </View>
      </LinearGradient>
    </SafeScreen>
  );
}

function ErrorScreen({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const { t } = useTranslation();

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
            resizeMode="contain"
          />
          <Text style={styles.title}>{t("main_layout.app_title")}</Text>
          <Text style={styles.title}>{t("main_layout.oops")}</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>{t("main_layout.retry_text")}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeScreen>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedFiscalYear = useSelector(
    (state: RootState) => state.fiscalYears.selectedFiscalYear,
  );

  // --- API Hooks ---
  // Fiscal years API
  const {
    data: fiscalData,
    error: fiscalError,
    loading: fiscalLoading,
    fetchData: fetchFiscalYears,
  } = useApi<FiscalYear[]>("/Public/annees-fiscales");

  // Ministries API
  const {
    data: ministriesData,
    error: ministriesError,
    loading: ministriesLoading,
    fetchData: fetchMinistries,
  } = useApi<any[]>(null); // endpoint set dynamically

  // Budget API
  const {
    data: budgetData,
    error: budgetError,
    loading: budgetLoading,
    fetchData: fetchBudget,
  } = useApi<any>(null);

  // Ministries count API
  const {
    data: ministriesCountData,
    error: ministriesCountError,
    loading: ministriesCountLoading,
    fetchData: fetchMinistriesCount,
  } = useApi<any>(null);

  // --- Combined loading/error state ---
  const [isReady, setIsReady] = useState(false);
  const [combinedError, setCombinedError] = useState<Error | null>(null);

  // 1. Fetch fiscal years on mount
  useEffect(() => {
    fetchFiscalYears();
  }, []);

  // 2. When fiscal years are loaded, ensure a fiscal year is selected
  useEffect(() => {
    if (fiscalData && fiscalData.length > 0 && !selectedFiscalYear) {
      // Set the first year as selected (or find the "isCurrent" one)
      const defaultYear =
        fiscalData.find((y) => y.isCurrent)?.anneeFiscale ||
        fiscalData[0].anneeFiscale;
      dispatch(setSelectedFiscalYear(defaultYear));
    }
  }, [fiscalData, selectedFiscalYear, dispatch]);

  // 3. When a fiscal year is selected, fetch dependent data
  useEffect(() => {
    if (!selectedFiscalYear) return;

    // Build dynamic endpoints (adjust base URL as needed)
    const baseUrl = "/Public"; // or full URL if your useApi expects full path
    const ministriesEndpoint = `${baseUrl}/ministeres?annee=${selectedFiscalYear}`;
    const budgetEndpoint = `${baseUrl}/budget?annee=${selectedFiscalYear}`;
    const countEndpoint = `${baseUrl}/ministeres/count?annee=${selectedFiscalYear}`;

    // Trigger fetches
    fetchMinistries(ministriesEndpoint);
    fetchBudget(budgetEndpoint);
    fetchMinistriesCount(countEndpoint);
  }, [selectedFiscalYear]);

  // 4. Combine loading and error states (with error conversion)
  useEffect(() => {
    const dependentShouldLoad = !!selectedFiscalYear;
    const anyLoading =
      fiscalLoading ||
      (dependentShouldLoad &&
        (ministriesLoading || budgetLoading || ministriesCountLoading));

    const anyError =
      fiscalError || ministriesError || budgetError || ministriesCountError;

    if (anyError) {
      // Convert to Error object if needed
      setCombinedError(
        anyError instanceof Error ? anyError : new Error(String(anyError)),
      );
      setIsReady(false);
    } else if (!anyLoading) {
      setIsReady(true);
      setCombinedError(null);
      SplashScreen.hideAsync();
    } else {
      setIsReady(false);
    }
  }, [
    fiscalLoading,
    ministriesLoading,
    budgetLoading,
    ministriesCountLoading,
    fiscalError,
    ministriesError,
    budgetError,
    ministriesCountError,
    selectedFiscalYear,
  ]);

  // --- Retry function (unchanged) ---
  const handleRetry = useCallback(() => {
    setCombinedError(null);
    fetchFiscalYears();
    if (selectedFiscalYear) {
      const baseUrl = "/Public";
      fetchMinistries(`${baseUrl}/ministeres?annee=${selectedFiscalYear}`);
      fetchBudget(`${baseUrl}/budget?annee=${selectedFiscalYear}`);
      fetchMinistriesCount(
        `${baseUrl}/ministeres/count?annee=${selectedFiscalYear}`,
      );
    }
  }, [selectedFiscalYear]);

  if (combinedError) {
    return <ErrorScreen error={combinedError} onRetry={handleRetry} />;
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <SafeScreen>
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        </Stack>
      </SafeScreen>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
  retryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
