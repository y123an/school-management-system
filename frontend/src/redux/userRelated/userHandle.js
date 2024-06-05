import axios from "axios";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
} from "./userSlice";

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

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const result = await axiosInstance.post(`/${role}Login`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.user) {
      localStorage.setItem("token", result.data.token);
      dispatch(authSuccess(result.data.user));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axiosInstance.post(`/${role}Reg`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else if (result.data.school) {
      dispatch(stuffAdded());
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.delete(`/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDeleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.put(`/${address}/${id}`, fields, {
      headers: { "Content-Type": "application/json" },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axiosInstance.post(`/${address}Create`, fields, {
      headers: { "Content-Type": "application/json" },
    });

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};
