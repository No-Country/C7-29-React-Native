import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: { loged: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LogIn: (state, { payload }) => {
      state.userData = { ...payload, loged: true };
    },
    LogOut: (state, { payload }) => {
      state.userData = { loged: false };
    },
  },
});

export const { LogIn, LogOut } = userSlice.actions;
export default userSlice.reducer;
