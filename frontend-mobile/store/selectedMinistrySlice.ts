import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Ministry {
  id: string;
  designation: string;
}

interface SelectedMinistryState {
  selectedMinistry: Ministry | null;
}

const initialState: SelectedMinistryState = {
  selectedMinistry: null,
};

const selectedMinistrySlice = createSlice({
  name: "selectedMinistry",
  initialState,
  reducers: {
    setSelectedMinistry: (state, action: PayloadAction<Ministry | null>) => {
      state.selectedMinistry = action.payload;
    },
    clearSelectedMinistry: (state) => {
      state.selectedMinistry = null;
    },
  },
});

export const { setSelectedMinistry, clearSelectedMinistry } =
  selectedMinistrySlice.actions;
export default selectedMinistrySlice.reducer;
