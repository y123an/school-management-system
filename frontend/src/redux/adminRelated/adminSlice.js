import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminsList: [],
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    stuffDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.statestatus = "added";
    },
    getSuccess: (state, action) => {
      state.adminsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
      state.adminsList = [];
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    underAdminControl: (state) => {
      state.loading = false;
      state.response = null;
      state.error = null;
      state.statestatus = "idle";
    },
    doneSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.status = "added";
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  underAdminControl,
  doneSuccess,
  stuffDone,
} = adminSlice.actions;

export const adminReducer = adminSlice.reducer;
