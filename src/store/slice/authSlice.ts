// src/features/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  admin: null;
}

const initialState: AuthState = {
  admin: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.admin = action.payload;
    },
    logout: (state) => {
      state.admin = null;
    },
  },
});

export const { loggedIn, logout } = authSlice.actions;

export default authSlice.reducer;
