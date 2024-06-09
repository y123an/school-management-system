import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  detailsSuccess,
  getFailedTwo,
  getSubjectsSuccess,
  getSubDetailsSuccess,
  getSubDetailsRequest,
  stuffDone,
  getClassTeacherSuccess,
} from "./sclassSlice";

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

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`${address}List/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const addSubject = (fields, id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.post(
      `/Teacher/addSubject/${id}`,
      fields
    );

    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getFailed("error while adding"));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/Sclass/Students/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getStudentsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateSubjectFields =
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

export const updateHomeRoom = (fields, classID) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.post(
      `/Sclass/homeroom/${classID}`,
      fields
    );
    if (result.data.added) {
      dispatch(stuffDone());
    } else {
      dispatch(getFailed());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeachersByClassID = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/Teacher/class/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getClassTeacherSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axiosInstance.get(`/FreeSubjectList/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteClassFromTeacher =
  (teacherID, classID) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await axiosInstance.delete(
        `/Teacher/class/${teacherID}/${classID}`
      );
      if (!result.data.removed) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(stuffDone());
      }
    } catch (error) {
      dispatch(getError(error));
    }
  };

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());

  try {
    const result = await axiosInstance.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
