import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allChalenges: { expired: [], currents: [] },
};

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    putAllChallenges: (state, { payload }) => {
      payload.reverse();
      var expired = payload.filter((x) => new Date(Date.now()) > new Date(x.ends));
      var currents = payload.filter((x) => new Date(Date.now()) < new Date(x.ends));
      state.allChalenges.expired = expired;
      state.allChalenges.currents = currents;
    },
  },
});

export const { putAllChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
