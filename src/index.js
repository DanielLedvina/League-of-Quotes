// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AppProvider} from "./context/AppContext";
import "./index.css";
import Main from "./App/Main";
import Register from "./components/Register/Register";
import LogIn from "./components/LogIn/LogIn";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AppProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  </AppProvider>
);
