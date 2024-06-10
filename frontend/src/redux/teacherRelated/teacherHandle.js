import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
} from "./teacherSlice";

const REACT_APP_BASE_URL = "http://localhost:4000";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Intercept requests to add the authorization header dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/Teachers/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/Teacher/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateTeacherFields =
  (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await axiosInstance.put(`/${address}/${id}`, fields, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(getSuccess());
      }
    } catch (error) {
      dispatch(getError(error));
    }
  };

export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      await axiosInstance.put(
        `/TeacherSubject`,
        { teacherId, teachSubject },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(postDone());
    } catch (error) {
      dispatch(getError(error));
    }
  };
