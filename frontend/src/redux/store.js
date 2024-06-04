import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userRelated/userSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { complainReducer } from "./complainRelated/complainSlice";
import { adminReducer } from "./adminRelated/adminSlice";
import { parentReducer } from "./parentRelated/parentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
    admin: adminReducer,
    parent: parentReducer,
  },
});

export default store;
