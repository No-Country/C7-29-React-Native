import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const langSlice = createSlice({
  name: "lang",
  initialState: { lang: "EN" },
  reducers: {
    switchLang: (state) => {
      state.lang = state.lang === "EN" ? "ES" : "EN";
      AsyncStorage.setItem("lang", state.lang);
    },
    localLang: (state, { payload }) => {
      state.lang = payload || "EN";
    },
  },
});

export const { switchLang, localLang } = langSlice.actions;
export default langSlice.reducer;
