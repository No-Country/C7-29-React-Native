import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snackHome: {
    visibility: false,
    action: null,
    message: "",
    inCart: false,
  },
};

const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    addSnack: (state, { payload }) => {
      state.snackHome = payload;
    },
    cleanSnack: (state, { payload }) => {
      state.snackHome = initialState.snackHome;
    },
  },
});

export const { addSnack, cleanSnack } = snackBarSlice.actions;
export default snackBarSlice.reducer;
