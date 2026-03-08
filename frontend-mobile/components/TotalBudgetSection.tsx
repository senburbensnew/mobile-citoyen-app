import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  setExpenses,
  setMinistriesCount,
  setTotalBudget,
} from "@/store/totalBudgetInfosSlice";
import { toMillions } from "@/services/helpers";

const TotalBudgetSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedFiscalYear } = useSelector(
    (state: RootState) => state.fiscalYears
  );
  const totalBudgetState = useSelector((state: RootState) => state.budget);

  useEffect(() => {
    const fetchFiscalYearData = async () => {
      if (!selectedFiscalYear?.anneeFiscale) return;

      setLoading(true);
      try {
        const [budgetResp, ministriesResp] = await Promise.all([
          api.get(`/Public/depenses/total/${selectedFiscalYear.anneeFiscale}`),
          api.get(
            `/Public/nombres/ministere${selectedFiscalYear.anneeFiscale}`
          ),
        ]);

        const budgetData = budgetResp.data;
        const ministriesData = ministriesResp.data;

        console.log(budgetData, totalBudgetState);

        dispatch(setTotalBudget(budgetData.montantAlloue));
        dispatch(setExpenses(budgetData.montantDepense));
        dispatch(setMinistriesCount(ministriesData.totalMinistere));
      } catch (error) {
        console.error("Error fetching fiscal year data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiscalYearData();
  }, [selectedFiscalYear, dispatch]);

  // Helper function to format numbers consistently
  const formatBudgetValue = (value: number | undefined) => {
    if (!value) return "0";
    return value.toLocaleString();
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <LinearGradient
        colors={["#004AAD", "#B000B9"]}
        style={styles.transparenceBudgetaireContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Ionicons name="globe-outline" size={20} color="#FFD700" />
          <Text style={styles.headerText}>
            {t("index_screen.budget_section.Transparence Budgétaire")}
          </Text>
        </View>

        {/* Subheader */}
        <Text style={styles.subHeader}>
          {t("index_screen.budget_section.Transparence Budgétaire texte") + " "}
          <Text style={styles.subHeaderBold}>
            {selectedFiscalYear?.anneeFiscale}
          </Text>
        </Text>

        {/* Budget Total Card */}
        <View style={styles.cardBox}>
          <View style={styles.box}>
            <MaterialIcons name="attach-money" size={22} color="#FFD700" />
            <View style={styles.boxContent}>
              <Text style={styles.boxTitle} numberOfLines={1}>
                {t("index_screen.budget_section.Budget Total")}{" "}
                <Text style={styles.boxTitleBold}>
                  {selectedFiscalYear?.anneeFiscale}
                </Text>
              </Text>

              <View style={styles.valueWrapper}>
                <Text style={styles.boxValue} numberOfLines={1}>
                  {loading ? (
                    <Text style={styles.placeholderText}>...</Text>
                  ) : (
                    `${totalBudgetState.totalBudget} `
                  )}
                  <Text style={styles.unitText}>Md HTG</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {/* Dépensé */}
          <View style={styles.smallBox}>
            <FontAwesome5 name="chart-line" size={18} color="#4CAF50" />
            <View style={styles.boxContent}>
              <Text style={styles.boxTitle} numberOfLines={1}>
                {t("index_screen.budget_section.Dépensé")}
              </Text>
              <View style={styles.valueWrapper}>
                <Text style={styles.boxValue} numberOfLines={1}>
                  {loading ? (
                    <Text style={styles.placeholderText}>...</Text>
                  ) : (
                    `${totalBudgetState.expenses} `
                  )}
                  <Text style={styles.unitText}>Md HTG</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Ministères */}
          <View style={styles.smallBox}>
            <Ionicons name="calculator-outline" size={18} color="#BA68C8" />
            <View style={styles.boxContent}>
              <Text style={styles.boxTitle} numberOfLines={1}>
                {t("index_screen.budget_section.Ministères")}
              </Text>
              <View style={styles.valueWrapper}>
                <Text style={styles.boxValue} numberOfLines={1}>
                  {loading ? (
                    <Text style={styles.placeholderText}>...</Text>
                  ) : (
                    totalBudgetState.ministriesCount
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={"large"} color={"#004AAD"} />
        </View>
      )}
    </View>
  );
};

export default TotalBudgetSection;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  transparenceBudgetaireContainer: {
    padding: 16,
    borderRadius: 16,
    width: width * 0.95,
    minHeight: 250, // Fixed minimum height for the entire container
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    height: 24, // Fixed height for header row
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  subHeader: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 16,
    flexWrap: "wrap",
    lineHeight: 20,
    width: "100%", // ensures wrapping works
  },
  subHeaderBold: {
    fontWeight: "bold",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40, // Fixed minimum height for box
  },
  boxContent: {
    marginLeft: 8,
    flex: 1,
  },
  boxTitle: {
    color: "#fff",
    fontSize: 14,
    height: 20, // Fixed height for title
  },
  boxTitleBold: {
    fontWeight: "bold",
  },
  boxValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    height: 24, // Fixed height for value
  },
  unitText: {
    fontSize: 12,
  },
  valueWrapper: {
    height: 24, // Fixed height for value wrapper
    justifyContent: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    height: 60, // Fixed height for bottom row
  },
  smallBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    minHeight: 50, // Fixed minimum height for small boxes
  },
  cardBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    minHeight: 60, // Fixed minimum height for card box
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
  },
});
