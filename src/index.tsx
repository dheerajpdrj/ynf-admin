import React from "react";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux"; // Import the Provider component
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import store from "./store"; // Import the Redux store

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
