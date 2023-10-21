import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { isUserValid } from "../../lib/pocketbase";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  let location = useLocation();
  console.log(isUserValid)
  if (location.pathname !== "/login" && !isUserValid) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/login" && isUserValid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
