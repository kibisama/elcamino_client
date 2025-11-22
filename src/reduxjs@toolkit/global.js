import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    user: "",
    id: "",
    name: "",
    stationCodes: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserData: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.stationCodes = action.payload.stationCodes;
    },
  },
});

export default globalSlice.reducer;
export const { setUser, setUserData } = globalSlice.actions;
