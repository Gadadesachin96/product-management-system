import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(); 

export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      console.log("User loaded from localStorage:", storedUser);
      setUser(storedUser);
    } else {
      console.log("No user found in localStorage");
    }
  }, [navigate]);
  

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    console.log("User logged in, redirecting...");
    navigate('/productpage');
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};
