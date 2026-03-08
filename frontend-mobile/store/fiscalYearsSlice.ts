import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiscalYear {
  anneeFiscale: string;
  labelFiscale: string;
  isCurrent: boolean;
}

interface FiscalYearsState {
  list: FiscalYear[];
  current?: FiscalYear; // the one marked as "current" in backend
  selectedFiscalYear?: FiscalYear; // the one chosen in dropdown
}

const initialState: FiscalYearsState = {
  list: [],
  current: undefined,
  selectedFiscalYear: undefined,
};

const fiscalYearsSlice = createSlice({
  name: "fiscalYears",
  initialState,
  reducers: {
    setFiscalYears: (state, action: PayloadAction<FiscalYear[]>) => {
      state.list = action.payload;
    },
    setCurrentFiscalYear: (state, action: PayloadAction<FiscalYear>) => {
      state.current = action.payload;
    },
    setSelectedFiscalYear: (state, action: PayloadAction<FiscalYear>) => {
      state.selectedFiscalYear = action.payload;
    },
  },
});

export const { setFiscalYears, setCurrentFiscalYear, setSelectedFiscalYear } =
  fiscalYearsSlice.actions;

export default fiscalYearsSlice.reducer;
