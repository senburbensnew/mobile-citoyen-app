import { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import "../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setSelectedFiscalYear } from "@/store/fiscalYearsSlice";
import { useRouter } from "expo-router";
import { changeAppLanguage } from "@/services/helpers";

// Enhanced responsive scaling
const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseWidthTablet = 768;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const scaleTablet = (size: number) => (width / guidelineBaseWidthTablet) * size;
const moderateScale = (size: number, factor = 0.5) => {
  const scaledSize = scale(size);
  return size + (scaledSize - size) * factor;
};
const moderateScaleTablet = (size: number, factor = 0.5) => {
  const scaledSize = scaleTablet(size);
  return size + (scaledSize - size) * factor;
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const langMap = {
    FR: "fr",
    HT: "ht",
  } as const;
  const currentLang = i18n.language;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isTablet = windowWidth >= 768;
  const isLargeTablet = windowWidth >= 1024;

  const dispatch = useDispatch<AppDispatch>();
  const { list, selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );

  function handleChange(anneeFiscale: string) {
    const year = list.find((y) => y.anneeFiscale === anneeFiscale);
    if (year) {
      dispatch(setSelectedFiscalYear(year));
    }
  }

  function handleBellPress() {
    router.replace("/notifications");
  }

  // Responsive font sizes
  const getResponsiveFontSize = (
    mobileSize: number,
    tabletSize: number,
    largeTabletSize?: number
  ) => {
    if (isLargeTablet && largeTabletSize) return largeTabletSize;
    if (isTablet) return tabletSize;
    return mobileSize;
  };

  // Responsive spacing
  const getResponsiveSpacing = (
    mobileSpacing: number,
    tabletSpacing: number,
    largeTabletSpacing?: number
  ) => {
    if (isLargeTablet && largeTabletSpacing) return largeTabletSpacing;
    if (isTablet) return tabletSpacing;
    return mobileSpacing;
  };

  return (
    <View>
      <LinearGradient
        colors={["#1A3C90", "#D7263D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          isTablet && styles.gradientTablet,
          isLargeTablet && styles.gradientLargeTablet,
        ]}
      >
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
            isLargeTablet && styles.containerLargeTablet,
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              isTablet && styles.headerRowTablet,
              isLargeTablet && styles.headerRowLargeTablet,
            ]}
          >
            {/* Left icon + text */}
            <View style={[styles.leftRow, isTablet && styles.leftRowTablet]}>
              <Image
                source={require("../assets/images/logo.png")}
                style={[
                  styles.logo,
                  isTablet && styles.logoTablet,
                  isLargeTablet && styles.logoLargeTablet,
                ]}
                resizeMode="contain"
              />
              <View
                style={[
                  styles.titleContainer,
                  isTablet && styles.titleContainerTablet,
                ]}
              >
                <Text
                  style={[
                    styles.titleText,
                    {
                      fontSize: getResponsiveFontSize(16, 22, 26),
                    },
                    isTablet && styles.titleTextTablet,
                  ]}
                >
                  {t("Portail Gouvernemental")}
                </Text>
                <View style={[styles.subRow, isTablet && styles.subRowTablet]}>
                  <View
                    style={[
                      styles.dot,
                      {
                        width: getResponsiveSpacing(16, 20, 24),
                        height: getResponsiveSpacing(8, 10, 12),
                        borderRadius: getResponsiveSpacing(4, 5, 6),
                      },
                      { backgroundColor: "#3B82F6" },
                    ]}
                  />
                  <View
                    style={[
                      styles.dot,
                      {
                        width: getResponsiveSpacing(16, 20, 24),
                        height: getResponsiveSpacing(8, 10, 12),
                        borderRadius: getResponsiveSpacing(4, 5, 6),
                      },
                      { backgroundColor: "#EF4444" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.subtitleText,
                      {
                        fontSize: getResponsiveFontSize(12, 16, 18),
                      },
                      isTablet && styles.subtitleTextTablet,
                    ]}
                  >
                    {t("République d'Haïti")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right section */}
            <View style={[styles.rightRow, isTablet && styles.rightRowTablet]}>
              {/* Language toggle */}
              <View
                style={[
                  styles.languageContainer,
                  isTablet && styles.languageContainerTablet,
                  isLargeTablet && styles.languageContainerLargeTablet,
                ]}
              >
                {/*                 <Ionicons
                  name="globe-outline"
                  size={getResponsiveFontSize(20, 24, 28)}
                  color="#fff"
                  style={{ marginRight: getResponsiveSpacing(5, 8, 10) }}
                /> */}
                {(["FR", "HT"] as const).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langButton,
                      {
                        paddingHorizontal: getResponsiveSpacing(8, 12, 16),
                        paddingVertical: getResponsiveSpacing(4, 6, 8),
                        borderRadius: getResponsiveSpacing(6, 8, 10),
                      },
                      currentLang === langMap[lang] && styles.langButtonActive,
                    ]}
                    onPress={() => {
                      // i18n.changeLanguage(langMap[lang]);
                      changeAppLanguage(langMap[lang]);
                    }}
                  >
                    <Text
                      style={[
                        styles.langText,
                        {
                          fontSize: getResponsiveFontSize(12, 16, 18),
                        },
                        currentLang === langMap[lang] && styles.langTextActive,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notification */}
              <TouchableOpacity
                style={styles.bellContainer}
                onPress={handleBellPress}
              >
                <Ionicons
                  name="notifications-outline"
                  size={getResponsiveFontSize(22, 26, 30)}
                  color="#fff"
                />
                <View
                  style={[
                    styles.bellDot,
                    {
                      width: getResponsiveSpacing(8, 12, 14),
                      height: getResponsiveSpacing(8, 12, 14),
                      borderRadius: getResponsiveSpacing(4, 6, 7),
                    },
                    isTablet && styles.bellDotTablet,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropdown for year selection */}
          <View
            style={[
              styles.dropdownContainer,
              isTablet && styles.dropdownContainerTablet,
            ]}
          >
            <Dropdown
              style={[
                styles.dropdown,
                {
                  width: isLargeTablet ? "50%" : isTablet ? "70%" : width * 0.6,
                  height: getResponsiveSpacing(40, 50, 55),
                  borderRadius: getResponsiveSpacing(10, 12, 14),
                },
              ]}
              placeholderStyle={[
                styles.dropdownPlaceholder,
                {
                  fontSize: getResponsiveFontSize(14, 16, 18),
                },
              ]}
              selectedTextStyle={[
                styles.dropdownSelected,
                {
                  fontSize: getResponsiveFontSize(14, 16, 18),
                },
              ]}
              containerStyle={[
                styles.dropdownWrapper,
                isTablet && styles.dropdownWrapperTablet,
              ]}
              inputSearchStyle={[
                styles.dropdownSearch,
                {
                  fontSize: getResponsiveFontSize(14, 16, 18),
                },
              ]}
              search
              data={list}
              labelField="anneeFiscale"
              valueField="anneeFiscale"
              value={selectedFiscalYear?.anneeFiscale}
              placeholder="Sélectionner une année fiscale"
              onChange={(item) => handleChange(item.anneeFiscale)}
              renderLeftIcon={() => (
                <Text
                  style={[
                    styles.dropdownLabel,
                    {
                      fontSize: getResponsiveFontSize(14, 16, 18),
                    },
                  ]}
                >
                  {t("Année fiscale")}
                </Text>
              )}
              renderItem={(item) => (
                <View
                  style={[
                    styles.dropdownItem,
                    {
                      paddingVertical: getResponsiveSpacing(8, 12, 14),
                      paddingHorizontal: getResponsiveSpacing(4, 8, 12),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownLabel,
                      {
                        fontSize: getResponsiveFontSize(14, 16, 18),
                      },
                    ]}
                  >
                    {t("Année fiscale")}
                  </Text>
                  <Text
                    style={[
                      styles.dropdownLabel,
                      {
                        fontSize: getResponsiveFontSize(14, 16, 18),
                      },
                    ]}
                  >
                    {item.anneeFiscale}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Date range */}
          <View
            style={[
              styles.periodContainer,
              isTablet && styles.periodContainerTablet,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                {
                  fontSize: getResponsiveFontSize(12, 16, 18),
                  padding: getResponsiveSpacing(6, 10, 12),
                },
              ]}
            >
              {i18n.language === "ht"
                ? selectedFiscalYear?.labelFiscale
                    ?.replace("Octobre", "Oktòb")
                    .replace("Septembre", "Septanm")
                : selectedFiscalYear?.labelFiscale}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Base styles (mobile first)
  gradient: {
    paddingVertical: 10,
  },
  gradientTablet: {
    paddingVertical: 15,
  },
  gradientLargeTablet: {
    paddingVertical: 20,
  },
  container: {
    padding: 12,
  },
  containerTablet: {
    padding: 20,
  },
  containerLargeTablet: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRowTablet: {
    marginBottom: 8,
  },
  headerRowLargeTablet: {
    marginBottom: 12,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  leftRowTablet: {
    flex: 1,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 8,
  },
  logoTablet: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  logoLargeTablet: {
    width: 90,
    height: 90,
    marginRight: 20,
  },
  titleContainer: {
    flexShrink: 1,
    maxWidth: "70%",
  },
  titleContainerTablet: {
    maxWidth: "80%",
  },
  titleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  titleTextTablet: {
    // Font size handled inline
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subRowTablet: {
    marginTop: 6,
  },
  dot: {
    marginRight: 4,
  },
  subtitleText: {
    color: "#D1D5DB",
  },
  subtitleTextTablet: {
    // Font size handled inline
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightRowTablet: {
    flex: 0.4,
    justifyContent: "flex-end",
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 4,
    marginRight: 8,
  },
  languageContainerTablet: {
    padding: 8,
    marginRight: 12,
    borderRadius: 16,
  },
  languageContainerLargeTablet: {
    padding: 10,
    borderRadius: 18,
  },
  langButton: {
    // Dimensions handled inline
  },
  langButtonActive: {
    backgroundColor: "#fff",
  },
  langText: {
    color: "#fff",
  },
  langTextActive: {
    color: "#1E40AF",
    fontWeight: "bold",
  },
  bellContainer: {
    position: "relative",
  },
  bellDot: {
    backgroundColor: "#FACC15",
    position: "absolute",
    top: -2,
    right: -2,
  },
  bellDotTablet: {
    top: -3,
    right: -3,
  },
  dropdownContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  dropdownContainerTablet: {
    marginTop: 20,
  },
  dropdown: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  dropdownPlaceholder: {
    color: "#fff",
  },
  dropdownSelected: {
    color: "#fff",
  },
  dropdownWrapper: {
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: "#1e293b",
  },
  dropdownWrapperTablet: {
    minWidth: 300,
  },
  dropdownSearch: {
    borderRadius: 8,
    color: "#fff",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  dropdownLabel: {
    color: "#fff",
    marginRight: 4,
  },
  periodContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  periodContainerTablet: {
    marginTop: 12,
  },
  periodText: {
    color: "#D1D5DB",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
});
