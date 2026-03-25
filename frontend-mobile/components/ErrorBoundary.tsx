import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SafeScreen from "./SafeScreen";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeScreen>
          <LinearGradient
            colors={["#0A2472", "#1E3A8A", "#D7263D"]}
            style={styles.gradient}
          >
            <View style={styles.container}>
              <Text style={styles.title}>Something went wrong</Text>
              <Text style={styles.errorMessage}>
                {this.state.error?.message || "Unknown error"}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => this.setState({ hasError: false })}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeScreen>
      );
    }
    return this.props.children;
  }
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
