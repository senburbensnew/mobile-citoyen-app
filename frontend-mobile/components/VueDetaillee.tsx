import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "i18next";
import SectionsComponent from "./SectionsComponent";
import AlineasComponent from "./AlineasComponent";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

type ViewMode = "section" | "alinea";

type VueDetailleeProps = {
  user?: string;
  role?: string;
  ministereId?: string | number;
  ministereDesignation?: string;
};

type ToggleButtonProps = {
  isActive: boolean;
  onPress: () => void;
  label: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onPress,
  label,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
    accessibilityRole="button"
    accessibilityState={{ selected: isActive }}
    accessibilityLabel={`Switch to ${label} view`}
  >
    <Text
      style={[
        styles.toggleButtonText,
        isActive && styles.toggleButtonTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const VueDetaillee: React.FC<VueDetailleeProps> = ({
  user,
  role,
  ministereId,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("section");

  const toggleButtons: Array<{ mode: ViewMode; label: string }> = [
    { mode: "section", label: t("Sections") },
    { mode: "alinea", label: t("Alinéas") },
  ];

  return (
    <>
      <LinearGradient
        colors={["#003893", "#0284C7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            {/* File Icon */}
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
            >
              <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <Path d="M10 9H8" />
              <Path d="M16 13H8" />
              <Path d="M16 17H8" />
            </Svg>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Détails du Budget - Ministère {ministereId}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 13,
                marginTop: 2,
              }}
            >
              Vue détaillée par Sections et Alinéas
            </Text>
          </View>

          {/* Badge */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: "#003893", fontSize: 12, fontWeight: "600" }}>
              Grand Commis
            </Text>
          </View>
        </View>

        {/* Divider */}
        {/*         <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.2)",
            marginTop: 12,
            paddingTop: 12,
            flexDirection: "row",
            gap: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <Path d="M10 9H8" />
                <Path d="M16 13H8" />
                <Path d="M16 17H8" />
              </Svg>
            </View>
            <Text style={{ color: "white", fontSize: 14 }}>3 Sections</Text>
          </View>

          
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <Path d="M3 12h.01" />
                <Path d="M3 18h.01" />
                <Path d="M3 6h.01" />
                <Path d="M8 12h13" />
                <Path d="M8 18h13" />
                <Path d="M8 6h13" />
              </Svg>
            </View>
            <Text style={{ color: "white", fontSize: 14 }}>7 Alineas</Text>
          </View>
        </View> */}
      </LinearGradient>
      <View style={styles.containerWrapper}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {t("Vue par Section et Alinéas")}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t("Visualisez par sections ou alinéas")}
            </Text>
          </View>

          {/* Toggle Buttons */}
          <View style={styles.toggleContainer}>
            {toggleButtons.map(({ mode, label }) => (
              <ToggleButton
                key={mode}
                isActive={viewMode === mode}
                onPress={() => setViewMode(mode)}
                label={label}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {viewMode === "section" ? (
            <SectionsComponent
              user={user}
              role={role}
              ministereId={ministereId}
            />
          ) : (
            <AlineasComponent
              user={user}
              role={role}
              ministereId={ministereId}
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 16, // rounded-2xl
    padding: 12, // p-6
    borderWidth: 2,
    borderColor: "#003893",
  },
  containerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  headerRow: {
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  toggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#2563EB",
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  contentContainer: {
    width: "100%",
    flex: 1,
  },
});

export default VueDetaillee;
