import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [userID, setUserID] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [friends, setFriends] = useState();

  return (
    <GlobalContext.Provider value={{ userID, setUserID, username, setUsername, name, setName, friends, setFriends }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
