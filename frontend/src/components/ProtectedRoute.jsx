import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.auth);

  // still checking auth
  if (user === undefined) return null;

  // not logged in
  if (!user) return <Navigate to="/login" />;

  // role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;