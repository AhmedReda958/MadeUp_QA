import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { logedin } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!logedin) {
      navigate("/login");
    }
  }, [logedin]);
  return <>{logedin ? children : null}</>;
};

export default ProtectedRoute;
