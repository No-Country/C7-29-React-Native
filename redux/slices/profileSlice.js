import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
};

const profileSLice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fillProfileData: (state, { payload }) => {
      state.userData = payload;
    },
    cleanProfileDetails: (state) => {
      state = initialState;
    },
  },
});

export const { fillProfileData, cleanProfileDetails } = profileSLice.actions;
export default profileSLice.reducer;
