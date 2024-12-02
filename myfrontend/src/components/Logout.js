import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token and redirect to the login page
    localStorage.removeItem("access_token");
    navigate("/login");
  }, [navigate]);

  return null; // Optionally, you can show a "Logging out..." message
};

export default Logout;
