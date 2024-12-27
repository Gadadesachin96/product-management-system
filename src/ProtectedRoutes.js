import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  

const ProtectedRoutes = ({ children }) => {
  const { user } = useAuth();  
  console.log("User in ProtectedRoutes:", user); 




  if (!user) {
    console.log("No user detected, redirecting to login"); 
    return <Navigate to="/login" />;
  }

  console.log("User authenticated, rendering children");
  return children;
};

export default ProtectedRoutes;
