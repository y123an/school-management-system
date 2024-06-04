import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sclassesList: [],
  sclassStudents: [],
  sclassDetails: [],
  subjectsList: [],
  subjectDetails: [],
  loading: false,
  subloading: false,
  error: null,
  response: null,
  getresponse: null,
};

const sclassSlice = createSlice({
  name: "sclass",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSubDetailsRequest: (state) => {
      state.subloading = true;
    },
    stuffDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.statestatus = "added";
    },
    getSuccess: (state, action) => {
      state.sclassesList = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getStudentsSuccess: (state, action) => {
      const newStudents = action.payload;
      const existingStudentIDs = new Set(
        state.sclassStudents.map((student) => student._id)
      );
      const uniqueNewStudents = newStudents.filter(
        (student) => !existingStudentIDs.has(student._id)
      );
      state.sclassStudents = [...state.sclassStudents, ...uniqueNewStudents];
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getSubjectsSuccess: (state, action) => {
      const newSubjects = action.payload;
      const existingSubjectIDs = new Set(
        state.subjectsList.map((subject) => subject._id)
      );
      const uniqueNewSubjects = newSubjects.filter(
        (subject) => !existingSubjectIDs.has(subject._id)
      );
      state.subjectsList = [...state.subjectsList, ...uniqueNewSubjects];
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.subjectsList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFailedTwo: (state, action) => {
      state.sclassesList = [];
      state.sclassStudents = [];
      state.getresponse = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.sclassDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSubDetailsSuccess: (state, action) => {
      const newDetails = [action.payload];
      const existingDetailIDs = new Set(
        state.subjectDetails.map((detail) => detail._id)
      );
      const uniqueNewDetails = newDetails.filter(
        (detail) => !existingDetailIDs.has(detail._id)
      );
      state.subjectDetails = [...state.subjectDetails, ...uniqueNewDetails];
      state.subloading = false;
      state.error = null;
    },
    resetSubjects: (state) => {
      state.subjectsList = [];
      state.sclassesList = [];
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  getSubjectsSuccess,
  detailsSuccess,
  getFailedTwo,
  resetSubjects,
  getSubDetailsSuccess,
  getSubDetailsRequest,
  stuffDone,
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;
