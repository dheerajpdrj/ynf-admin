import { createSlice } from "@reduxjs/toolkit";

interface BrandsState {
  allBrands: any;
}

const initialState: BrandsState = {
  allBrands: [],
};

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands: (state, action) => {   
      state.allBrands = action.payload;
    },
  },
});

export const { setBrands } = brandsSlice.actions;

export default brandsSlice.reducer;
