import React from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NBaF1cXmhPYVJyWmFZfVpgfF9GYFZUQGYuP1ZhSXxXdkNjXn9WcHRQQmdeVUE="
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
