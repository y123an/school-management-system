import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
} from "./studentSlice";

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

export const getAllStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/Students/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateStudentFields =
  (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await axiosInstance.put(`/${address}/${id}`, fields, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(stuffDone());
      }
    } catch (error) {
      dispatch(getError(error));
    }
  };

export const removeStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.put(`/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
