import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: { loged: false, favorites: [], liked: [] },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LogIn: (state, { payload }) => {
      if (!payload.message) {
        state.userData = {
          ...payload.userLoged,
          loged: true,
          jwt: payload.token,
        };
      }
    },
    LogOut: (state, { payload }) => {
      state.userData = { loged: false };
    },
  },
});

export const { LogIn, LogOut } = userSlice.actions;
export default userSlice.reducer;
