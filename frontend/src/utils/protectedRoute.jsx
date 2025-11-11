import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, authed } = useAuth();
  if (loading) return <div>Loading</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
