import React, { createContext, useState, useContext } from 'react';

interface SessionData {
  email: string;
  sessionId: string;
  // ... other properties
}


const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState({empty:''}); // Your session data

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = : { sessionData: SessionData; setSessionData: React.Dispatch<React.SetStateAction<SessionData>> } =>  {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
