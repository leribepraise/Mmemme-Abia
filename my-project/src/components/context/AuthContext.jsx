import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
