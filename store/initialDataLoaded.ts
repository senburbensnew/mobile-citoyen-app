import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialDataLoadedState {
  dataLoaded: boolean;
}

const initialState: InitialDataLoadedState = {
  dataLoaded: false,
};

const initialDataLoadedSlice = createSlice({
  name: "initialDataLoaded",
  initialState,
  reducers: {
    setInitialDataLoaded: (state, action: PayloadAction<boolean>) => {
      state.dataLoaded = action.payload;
    },
  },
});

export const { setInitialDataLoaded } = initialDataLoadedSlice.actions;
export default initialDataLoadedSlice.reducer;
