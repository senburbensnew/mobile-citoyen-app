import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedMinistry } from "@/store/selectedMinistrySlice";
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { setMinistries } from "@/store/ministriesSlice";

const FiltersSection = ({ showDropdownOnly = false }) => {
  const { t } = useTranslation();
  const ministriesState = useSelector((state: RootState) => state.ministries);
  const selectedMinistry = useSelector(
    (state: RootState) => state.selectedMinistry
  );
  const selectedFiscalYear = useSelector(
    (state: RootState) => state.fiscalYears.selectedFiscalYear
  );

  const {
    data: ministriesData,
    error: ministriesError,
    loading: ministriesLoading,
    fetchData: fetchMinistries,
  } = useApi<any[]>(null);

  const dispatch = useDispatch();

  const handleMinistryChange = (item: { id: string; designation: string }) => {
    dispatch(setSelectedMinistry(item));
  };

  useEffect(() => {
    if (selectedFiscalYear?.anneeFiscale) {
      fetchMinistries(`/Public/ministeres/${selectedFiscalYear.anneeFiscale}`);
    }
  }, [selectedFiscalYear]);

  useEffect(() => {
    if (ministriesData && ministriesData.length > 0) {
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

  return (
    <View className="w-full ">
      {showDropdownOnly ? (
        <View style={{ width: "100%" }}>
          <Dropdown
            style={styles.dropdown}
            data={ministriesState?.ministries || []}
            search
            searchPlaceholder={t("index_screen.filters_section.search_placeholder")}
            labelField="designation"
            renderItem={(item) => (
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 14, color: "#333" }}>
                  {item.designation}{" "}
                  {item.id && (
                    <Text style={{ color: "#888" }}>({item.id})</Text>
                  )}
                </Text>
              </View>
            )}
            valueField="id"
            placeholder={`🏛️ ${t("index_screen.filters_section.dropdown_placeholder")}`}
            value={selectedMinistry.selectedMinistry?.id}
            onChange={(item) => {
              handleMinistryChange(item);
            }}
            itemContainerStyle={{
              paddingVertical: 0,
              paddingHorizontal: 0,
            }} // reduces option padding
            itemTextStyle={{ fontSize: 14, paddingVertical: 0 }} // controls text padding
            selectedTextStyle={{ fontSize: 14 }}
          />
        </View>
      ) : (
        <View>
          <LinearGradient
            colors={["#ffffff", "#f8f0ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.filterContainer}
          >
            <View style={styles.filterHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#DBEAFE",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    stroke="#2563EB"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  >
                    <Path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                  </Svg>
                </View>

                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: "#1F2937" }}>
                    {t("index_screen.filters_section.title")}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#4B5563" }}>
                    {t("index_screen.filters_section.subtitle")}
                  </Text>
                </View>
              </View>
            </View>

            <Dropdown
              style={styles.dropdown}
                data={ministriesState?.ministries || []}
                search
                searchPlaceholder={t("index_screen.filters_section.search_placeholder")}
                labelField="designation"
                valueField="id"
                placeholder={`🏛️ ${t("index_screen.filters_section.dropdown_placeholder")}`}
                value={selectedMinistry.selectedMinistry?.id}
                onChange={(item) => {
                  handleMinistryChange(item);
                }}
                itemContainerStyle={{ paddingVertical: 0, paddingHorizontal: 0 }}
                itemTextStyle={{ fontSize: 14, paddingVertical: 0 }}
                selectedTextStyle={{ fontSize: 14 }}
            />
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default FiltersSection;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxContent: {
    marginLeft: 8,
    flex: 1,
  },
  boxTitle: {
    color: "#fff",
    fontSize: 14,
  },
  boxTitleBold: {
    fontWeight: "bold",
  },
  boxValue: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  smallBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  image: {
    width: width * 0.95,
    height: 200,
    borderRadius: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  overlayText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
  },
  filterContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 10,
    paddingVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#145efc",
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  filterHeaderText: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 12,
    color: "#4B5563",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButton: {
    marginLeft: 8,
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ministryContainer: {
    width: width * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: width * 0.025,
  },
  ministryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ministryHeaderText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1F2937",
  },
});
