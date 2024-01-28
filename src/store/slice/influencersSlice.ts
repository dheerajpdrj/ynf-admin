import { createSlice } from "@reduxjs/toolkit";

interface InfluencersState {
  allInfluencers: any;
}

const initialState: InfluencersState = {
  allInfluencers: [],
};

const influencersSlice = createSlice({
  name: "influencers",
  initialState,
  reducers: {
    setInfluencers: (state, action) => {
      state.allInfluencers = action.payload;
    },
  },
});

export const { setInfluencers } = influencersSlice.actions;

export default influencersSlice.reducer;
