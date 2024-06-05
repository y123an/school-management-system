import axios from "axios";
import { getRequest, getSuccess, getFailed, getError } from "./noticeSlice";

const REACT_APP_BASE_URL = "http://localhost:4000";

export const getAllNotices = (id, address, role) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios({
      method: "get",
      url: `${REACT_APP_BASE_URL}/NoticeList/${role}`,
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
