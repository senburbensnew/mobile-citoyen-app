// app/_layout.tsx
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/LoadingScreen";
import SafeScreen from "@/components/SafeScreen";
import { useAuth } from "@/hooks/useAuth";
import { useAppStartup } from "@/hooks/useAppStartup";
import { loadSavedLanguage } from "@/services/helpers";
import { store } from "@/store";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

// -------------------------------
// Auth Guard — must be inside AuthProvider
// -------------------------------
// Screens inside (root) that require authentication
const PROTECTED_SCREENS = ["profile", "notifications"];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inRootGroup = segments[0] === "(root)";
    const currentScreen = segments[1] as string | undefined;

    if (!user && inRootGroup && PROTECTED_SCREENS.includes(currentScreen ?? "")) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(root)");
    }
  }, [user, loading, segments]);

  if (loading) return <LoadingScreen />;

  return <>{children}</>;
}

// -------------------------------
// Main App Content
// -------------------------------
function AppContent() {
  const { isReady, error, retry } = useAppStartup();

  if (error) {
    SplashScreen.hideAsync().catch(() => {});
    return <ErrorScreen error={error} onRetry={retry} />;
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <SafeScreen>
        <StatusBar hidden />
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(root)" />
          </Stack>
        </AuthGuard>
      </SafeScreen>
    </AuthProvider>
  );
}

// -------------------------------
// Root Layout
// -------------------------------
export default function RootLayout() {
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}
