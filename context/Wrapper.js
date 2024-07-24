import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <StoreContext.Provider value={{ data, setData }}>
      {children}
    </StoreContext.Provider>
  );
};
