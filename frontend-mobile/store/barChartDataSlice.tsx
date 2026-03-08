import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BarChartData {
  mois: number;
  montantAlloue: number;
  montantEngage: number;
  montantDepense: number;
  anneeFiscale: string;
  moisNom: string;
}

interface BarChartState {
  data: BarChartData[];
}

const initialState: BarChartState = {
  data: [],
};

const barChartSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBarChartData: (state, action: PayloadAction<BarChartData[]>) => {
      state.data = action.payload;
    },
    addToBarChartData: (state, action: PayloadAction<BarChartData>) => {
      state.data.push(action.payload);
    },
    updateBarChartData: (state, action: PayloadAction<BarChartData>) => {
      const index = state.data.findIndex(
        (item) => item.mois === action.payload.mois
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    clearBarChartData: (state) => {
      state.data = [];
    },
  },
});

export const {
  setBarChartData,
  addToBarChartData,
  updateBarChartData,
  clearBarChartData,
} = barChartSlice.actions;

export default barChartSlice.reducer;
