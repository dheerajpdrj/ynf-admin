// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import brandsSlice from "./slice/brandsSlice";
import influencersSlice from "./slice/influencersSlice";
import projectSlice from "./slice/projectSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    brands: brandsSlice,
    influencers: influencersSlice,
    projects: projectSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
