import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
} from "./adminSlice";

const REACT_APP_BASE_URL = "http://localhost:4000";

export const getAllAdmins = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/Admins/`);
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
      const result = await axios.put(
        `${REACT_APP_BASE_URL}/${address}/${id}`,
        fields,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
    const result = await axios.put(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
