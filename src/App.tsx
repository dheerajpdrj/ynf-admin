// App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";

function App() {
  const rootRoute = process.env.REACT_APP_ROOT_ROUTE;
  return (
    <BrowserRouter basename={`${rootRoute}`}>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
