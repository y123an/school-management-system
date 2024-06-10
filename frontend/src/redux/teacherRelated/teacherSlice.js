import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachersList: [],
  teacherDetails: [],
  loading: false,
  error: null,
  response: null,
  status: "idle",
  stateStatus: "idle",
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.teacherDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
      state.status = "added";
    },
    getSuccess: (state, action) => {
      state.teachersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
      state.stateStatus = "added";
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
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    underTeacherControl: (state) => {
      state.loading = false;
      state.response = null;
      state.error = null;
      state.status = "idle";
      state.stateStatus = "idle";
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  underTeacherControl,
  postDone,
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;
