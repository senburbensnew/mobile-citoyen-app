import { configureStore } from "@reduxjs/toolkit";
import fiscalYearsReducer from "./fiscalYearsSlice";
import languageReducer from "./languageSlice";
import ministriesReducer from "./ministriesSlice";
import budgetReducer from "./totalBudgetInfosSlice";
import selectedMinistryReducer from "./selectedMinistrySlice";
import barChartReducer from "./barChartDataSlice";
import initialDataLoadedReducer from "./initialDataLoaded";

export const store = configureStore({
  reducer: {
    fiscalYears: fiscalYearsReducer,
    language: languageReducer,
    ministries: ministriesReducer,
    selectedMinistry: selectedMinistryReducer,
    budget: budgetReducer,
    initialDataLoaded: initialDataLoadedReducer,
    // barChartData: barChartReducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
