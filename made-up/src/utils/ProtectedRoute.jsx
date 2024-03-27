import React, { useEffect } from "react";
import {} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const logedin = localStorage.logedin;
  const navigate = () => {};

  useEffect(() => {
    if (!logedin) {
      navigate("/login");
    }
  }, [logedin]);
  return <>{logedin ? children : null}</>;
};

export default ProtectedRoute;
