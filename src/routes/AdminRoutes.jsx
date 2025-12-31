/* eslint-disable react/prop-types */
// AdminRoutes.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user?.authRole);
  // need to be change while role management goes production
  const isAdmin = user && user.authRole === "admin";
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AdminRoutes;
