import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import Svg, { Line, Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import VueEnsemble from "@/components/VueEnsemble";
import Documents from "@/components/Documents";
import { JSX, useEffect, useState } from "react";
import Projets from "@/components/Projets";
import React from "react";
import Roles from "../../enum/Roles";
import VueDetaillee from "@/components/VueDetaillee";
import { useIsFocused } from "@react-navigation/native";

const Dashboard = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { user, role, ministereId, ministereDesignation } = useAuth();
  const [selectedView, setSelectedView] = useState<
    "apercu-budgetaire" | "vue-detaillee" | "projets" | "documents"
  >("apercu-budgetaire");
  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );

  type TabView = "apercu-budgetaire" | "vue-detaillee" | "projets";
  // | "documents";

  const tabs: {
    id: TabView;
    labelKey: string;
    icon: JSX.Element;
  }[] = [
    {
      id: "apercu-budgetaire",
      labelKey: "index_screen.tabs.apercu_budgetaire",
      icon: (
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M18 17V9" />
          <Path d="M13 17V5" />
          <Path d="M8 17v-3" />
        </Svg>
      ),
    },
    {
      id: "vue-detaillee",
      labelKey: "index_screen.tabs.vue_detaillee",
      icon: (
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M18 17V9" />
          <Path d="M13 17V5" />
          <Path d="M8 17v-3" />
        </Svg>
      ),
    },
    {
      id: "projets",
      labelKey: "index_screen.tabs.projets",
      icon: (
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Line x1="12" y1="2" x2="12" y2="22" />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </Svg>
      ),
    },
    /*     {
      id: "documents",
      labelFR: "Documents",
      labelHT: "",
      icon: (
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <Path d="M10 9H8" />
          <Path d="M16 13H8" />
          <Path d="M16 17H8" />
        </Svg>
      ),
    }, */
  ];

  const HeaderComponent = () => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
          padding: 10,
        }}
        className="bg-white"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <Path d="M18 17V9" />
                <Path d="M13 17V5" />
                <Path d="M8 17v-3" />
              </Svg>
            </View>
            <View>
              <Text className="text-gray-800">
                {t("index_screen.dashboard_header.dashboard")} <Text className="font-bold">{user}</Text>
              </Text>
              <Text className="text-sm text-gray-600">
                {t("index_screen.dashboard_header.role")} : {role} {"\n"}{t("index_screen.dashboard_header.ministere")} {ministereId}
              </Text>
            </View>
          </View>
          <View>
            <View className="mt-2 flex-row items-center justify-center gap-1 rounded-md border px-2 py-0.5 w-fit bg-green-400 border-green-400/30">
              <Svg
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
                {t("common.online")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const TabsComponent = () => {
    return (
      <View
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
          padding: 1,
        }}
        className="bg-white border-b border-gray-300"
      >
        <ScrollView
          nestedScrollEnabled={true}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="p-2"
        >
          <View className="flex-row">
            {tabs.map((tab) => {
              const isSelected = tab.id === selectedView;
              const color = isSelected ? "#fff" : "#4B5563";
              const showTab =
                tab.id === "vue-detaillee"
                  ? user && role && role === Roles.GRAND_COMMIS
                  : true;

              // ✅ Return element correctly with conditional rendering
              if (!showTab) return null;

              return (
                <TouchableOpacity
                  key={tab.id}
                  className={`flex-row items-center space-x-2 px-3 py-2 rounded-lg ${
                    isSelected ? "bg-blue-600" : "bg-gray-100"
                  }`}
                  style={{ marginRight: 8 }}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  {/* Clone your SVG and override stroke color dynamically */}
                  {React.cloneElement(tab.icon, { stroke: color })}

                  <Text
                    style={{ marginLeft: 3 }}
                    className={`text-sm ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {t(tab.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const handleTabPress = (
    id: "apercu-budgetaire" | "vue-detaillee" | "projets"
    // | "documents"
  ) => {
    setSelectedView(id);
  };

  useEffect(() => {
    if (
      selectedView === "vue-detaillee" &&
      (!user || role !== Roles.GRAND_COMMIS)
    ) {
      setSelectedView("apercu-budgetaire");
    }
  }, [isFocused, user, role, selectedView]);

  return (
    <View className="flex-1">
      {user && <HeaderComponent />}
      <TabsComponent />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-[95%]">
          {selectedView === "apercu-budgetaire" && <VueEnsemble />}
          {user &&
            role === Roles.GRAND_COMMIS &&
            selectedView === "vue-detaillee" && (
              <VueDetaillee
                user={user}
                role={role}
                ministereId={ministereId}
                ministereDesignation={ministereDesignation}
              />
            )}
          {selectedView === "projets" && <Projets />}
          {/* {selectedView === "documents" && <Documents />} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
