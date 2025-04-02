import React, { createContext, useState, useEffect } from "react";
import { getUserFromStorage, saveUserToStorage, logoutUser } from "../services/authServise.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const login = (userData, token) => {
    const normalizedUser = userData.id ? userData : { ...userData, id: userData._id };
    saveUserToStorage(normalizedUser, token);
    setUser(normalizedUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setInitialized(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};
