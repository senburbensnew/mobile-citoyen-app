import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Ministry {
  id: number;
  name: string;
  // add other fields as needed
}

interface MinistriesState {
  ministries: Ministry[];
}

const initialState: MinistriesState = {
  ministries: [],
};

const ministriesSlice = createSlice({
  name: "ministries",
  initialState,
  reducers: {
    setMinistries: (state, action: PayloadAction<Ministry[]>) => {
      state.ministries = action.payload;
    },
  },
});

export const { setMinistries } = ministriesSlice.actions;
export default ministriesSlice.reducer;
