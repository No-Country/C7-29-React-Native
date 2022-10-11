import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: { followers: [] },
  loading: true,
};

const profileSLice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fillProfileData: (state, { payload }) => {
      state.userData = payload;
      state.userData.publications.reverse();
      state.loading = false;
    },
    cleanProfileDetails: (state, { payload }) => {
      state.userData = { followers: [] };
      state.loading = true;
    },
  },
});

export const { fillProfileData, cleanProfileDetails } = profileSLice.actions;
export default profileSLice.reducer;
