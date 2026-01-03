import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    id: "",
    name: "",
    stationCodes: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.stationCodes = action.payload.stationCodes;
    },
  },
});

export default globalSlice.reducer;
export const { setUserData } = globalSlice.actions;
