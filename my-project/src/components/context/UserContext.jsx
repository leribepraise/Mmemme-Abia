import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

const defaultUser = {
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  lga: "",
  address: "",
  dateOfBirth: "",
  gender: "",
  bio: "",
  profilePicture: "",
  plan: "",
};

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? { ...defaultUser, ...JSON.parse(stored) } : defaultUser;
  });

  const updateUser = (updates) => {
    setUserState((prev) => {
      const next = { ...prev, ...updates };
      sessionStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
