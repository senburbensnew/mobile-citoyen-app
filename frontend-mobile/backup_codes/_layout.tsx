import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import SafeScreen from "../components/SafeScreen";
import { AuthProvider } from "../context/AuthContext";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "../store";
import {
  setFiscalYears,
  setCurrentFiscalYear,
  setSelectedFiscalYear,
} from "../store/fiscalYearsSlice";
import { setMinistries } from "../store/ministriesSlice";
import { setSelectedMinistry } from "@/store/selectedMinistrySlice";
import {
  setExpenses,
  setMinistriesCount,
  setTotalBudget,
} from "@/store/totalBudgetInfosSlice";
import { loadSavedLanguage } from "@/services/helpers";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApi } from "../hooks/useApi";
import "./globals.css";
import "../i18n/i18n";
import { useTranslation } from "react-i18next";
import { setInitialDataLoaded } from "@/store/initialDataLoaded";

// SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const { dataLoaded: initialDataLoadingFinished } = useSelector(
    (state: RootState) => state.initialDataLoaded
  );

  const SplashScreen = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const selectedFiscalYear = useSelector(
      (state: RootState) => state.fiscalYears.selectedFiscalYear
    );

    // Fiscal years API
    const {
      data: fiscalData,
      error: fiscalError,
      loading: fiscalLoading,
      fetchData: fetchFiscalYears,
    } = useApi<
      { anneeFiscale: string; labelFiscale: string; isCurrent: boolean }[]
    >("/Public/annees-fiscales");

    // Ministries API
    const {
      data: ministriesData,
      error: ministriesError,
      loading: ministriesLoading,
      fetchData: fetchMinistries,
    } = useApi<any[]>(null);

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

    // --- Fetch fiscal years first ---
    useEffect(() => {
      loadSavedLanguage();
      fetchFiscalYears();
    }, []);

    // --- Handle fiscal years ---
    useEffect(() => {
      if (fiscalData && fiscalData.length > 0) {
        const sortedFiscalData = [...fiscalData].sort((a, b) => {
          const yearA = parseInt(a.anneeFiscale.split("-")[0]);
          const yearB = parseInt(b.anneeFiscale.split("-")[0]);
          return yearA - yearB; // descending
        });

        dispatch(setFiscalYears(sortedFiscalData));

        const current =
          sortedFiscalData.find((y) => y.isCurrent) || sortedFiscalData[0];
        dispatch(setCurrentFiscalYear(current));
        dispatch(setSelectedFiscalYear(current));
      }
    }, [fiscalData, dispatch]);

    // --- Fetch ministries when fiscal year changes ---
    useEffect(() => {
      if (selectedFiscalYear?.anneeFiscale) {
        fetchMinistries(
          `/Public/ministeres/${selectedFiscalYear.anneeFiscale}`
        );
        fetchBudget(
          `/Public/depenses/total/${selectedFiscalYear.anneeFiscale}`
        );
        fetchMinistriesCount(
          `/Public/nombres/ministere${selectedFiscalYear.anneeFiscale}`
        );
      }
    }, [selectedFiscalYear]);

    // --- Dispatch total budget info ---
    useEffect(() => {
      if (budgetData && ministriesCountData) {
        dispatch(setTotalBudget(budgetData.montantAlloue));
        dispatch(setExpenses(budgetData.montantDepense));
        dispatch(setMinistriesCount(ministriesCountData.totalMinistere));
      }
    }, [budgetData, ministriesCountData, dispatch]);

    // --- Handle ministries data ---
    useEffect(() => {
      if (ministriesData && ministriesData.length > 0) {
        console.log(ministriesData);

        // Create a new array with designation field replaced by "id - designation"
        const modifiedData = ministriesData.map((ministry) => ({
          ...ministry,
          designation: `${ministry.id} - ${ministry.designation}`,
        }));

        const sorted = [...modifiedData].sort((a, b) =>
          a.designation.localeCompare(b.designation, undefined, {
            sensitivity: "base",
          })
        );
        dispatch(setMinistries(sorted));
        dispatch(setSelectedMinistry(sorted[0]));
      }
    }, [ministriesData, dispatch]);

    // --- Mark initial load complete once everything is ready ---
    useEffect(() => {
      if (
        fiscalData &&
        ministriesData &&
        budgetData &&
        ministriesCountData &&
        !fiscalLoading &&
        !ministriesLoading &&
        !budgetLoading &&
        !ministriesCountLoading
      ) {
        setInitialLoadComplete(true);
        dispatch(setInitialDataLoaded(true));
      }
    }, [
      fiscalData,
      ministriesData,
      budgetData,
      ministriesCountData,
      fiscalLoading,
      ministriesLoading,
      budgetLoading,
      ministriesCountLoading,
    ]);

    const isLoading =
      !initialLoadComplete &&
      (fiscalLoading ||
        ministriesLoading ||
        budgetLoading ||
        ministriesCountLoading ||
        !fiscalData ||
        !ministriesData);

    const hasError =
      fiscalError || ministriesError || budgetError || ministriesCountError;

    // --- Loading screen ---
    if (isLoading && !hasError) {
      const getLoadingMessage = () => {
        if (fiscalLoading || !fiscalData?.length)
          return t(
            "main_layout.loading_fiscal_years",
            "Chargement des années fiscales..."
          );
        if (ministriesLoading || !ministriesData?.length)
          return t(
            "main_layout.loading_ministries",
            "Chargement des ministères..."
          );
        return t(
          "main_layout.loading_initial_data",
          "Chargement des données initiales..."
        );
      };

      return (
        <SafeScreen>
          <LinearGradient
            colors={["#0A2472", "#1E3A8A", "#D7263D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <StatusBar hidden />
            <View>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appTitle}>{t("Portail Gouvernemental")}</Text>
            <View style={styles.centeredContent}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>{getLoadingMessage()}</Text>
            </View>
          </LinearGradient>
        </SafeScreen>
      );
    }

    // --- Error screen ---
    if (hasError) {
      return (
        <SafeScreen>
          <LinearGradient
            colors={["#0A2472", "#1E3A8A", "#D7263D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <StatusBar hidden />
            <View>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appTitle}>{t("Portail Gouvernemental")}</Text>
            <View style={styles.centeredContent}>
              <Text style={styles.errorText}>
                {fiscalError
                  ? `Erreur de chargement des années fiscales : ${fiscalError}`
                  : ministriesError
                  ? `Erreur de chargement des ministères : ${ministriesError}`
                  : budgetError
                  ? `Erreur de chargement des informations budgetaires : ${budgetError}`
                  : ministriesCountError
                  ? `Erreur de chargement du nombre de ministères : ${ministriesCountError}`
                  : "Une erreur inconnue s’est produite."}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  fetchFiscalYears();
                  if (selectedFiscalYear?.anneeFiscale) {
                    fetchMinistries(
                      `/Public/ministeres/${selectedFiscalYear.anneeFiscale}`
                    );
                    fetchBudget(
                      `/Public/depenses/total/${selectedFiscalYear.anneeFiscale}`
                    );
                    fetchMinistriesCount(
                      `/Public/nombres/ministere${selectedFiscalYear.anneeFiscale}`
                    );
                  }
                  setInitialLoadComplete(false);
                }}
              >
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeScreen>
      );
    }
  };

  // --- Main app ---
  return initialDataLoadingFinished ? (
    <AuthProvider>
      <SafeScreen>
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </SafeScreen>
    </AuthProvider>
  ) : (
    <SplashScreen />
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1,
  },
  centeredContent: { alignItems: "center" },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FCA5A5",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
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


/*
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          fetchUserSession(),
          loadCriticalData(),
          // fonts, configs, etc.
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!isReady) return null; // Splash screen is still visible
  return <Slot />;
}


================================================================================


import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const session = await getStoredSession(); // AsyncStorage, SecureStore, etc.
        setUser(session);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/login');
    }
  }, [isReady, user]);

  return <Slot />;
}


============================================================================================


// context/AppContext.tsx
export const AppProvider = ({ children }) => {
  const [state, setState] = useState({ user: null, config: null });

  useEffect(() => {
    async function init() {
      const [user, config] = await Promise.all([
        SecureStore.getItemAsync('user'),
        fetchRemoteConfig(),
      ]);
      setState({ user: JSON.parse(user), config });
    }
    init();
  }, []);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

// app/_layout.tsx
export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
*/