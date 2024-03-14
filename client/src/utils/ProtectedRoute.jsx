import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const logedin = localStorage.logedin;
  const navigate = useNavigate();

  useEffect(() => {
    if (!logedin) {
      navigate("/login");
    }
  }, [logedin]);
  return <>{logedin ? children : null}</>;
};

export default ProtectedRoute;
