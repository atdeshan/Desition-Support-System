import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SalesGraph from "./components/ProductSalesGraph";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";

// Check if the user is authenticated by looking for a token in localStorage
const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Protect the dashboard route */}
        <Route
          path="/"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        
        {/* Protect the sales graph route */}
        <Route
          path="/sales-graph"
          element={isAuthenticated() ? <SalesGraph /> : <Navigate to="/login" />}
        />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </Router>
  );
};

export default App;
