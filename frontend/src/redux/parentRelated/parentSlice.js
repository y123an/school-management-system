import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parentsList: [],
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
};

const parentSlice = createSlice({
  name: "parent",
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
      state.parentsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
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
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  underAdminControl,
  stuffDone,
} = parentSlice.actions;

export const parentReducer = parentSlice.reducer;
