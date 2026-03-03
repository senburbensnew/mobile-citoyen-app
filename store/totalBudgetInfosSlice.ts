import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BudgetState {
  totalBudget: number;
  expenses: number;
  ministriesCount: number;
}

const initialState: BudgetState = {
  totalBudget: 0,
  expenses: 0,
  ministriesCount: 0,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setTotalBudget: (state, action: PayloadAction<number>) => {
      state.totalBudget = action.payload;
    },
    setExpenses: (state, action: PayloadAction<number>) => {
      state.expenses = action.payload;
    },
    setMinistriesCount: (state, action: PayloadAction<number>) => {
      state.ministriesCount = action.payload;
    },
    setAll: (state, action: PayloadAction<BudgetState>) => {
      // to set all fields at once
      state.totalBudget = action.payload.totalBudget;
      state.expenses = action.payload.expenses;
      state.ministriesCount = action.payload.ministriesCount;
    },
  },
});

export const { setTotalBudget, setExpenses, setMinistriesCount, setAll } =
  budgetSlice.actions;

export default budgetSlice.reducer;
