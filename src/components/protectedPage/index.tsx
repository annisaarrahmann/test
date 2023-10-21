import { Navigate } from "react-router-dom";
import { isUserValid } from "../../lib/pocketbase";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isUserValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
