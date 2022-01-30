import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

function AuthRoute({ children }) {
  // children will contain the component to be rendered
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
}

export default AuthRoute;
