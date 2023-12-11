import React, { createContext, useState, useContext } from 'react';

interface SessionData {
  email: string;
  sessionId: string;
  // ... other properties
}

interface SessionContextProps {
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
}

const SessionContext = createContext<SessionContextProps | null>(null);

export const SessionProvider: React.FC = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData>({ email: '', sessionId: '' });

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): { sessionData: SessionData; setSessionData: React.Dispatch<React.SetStateAction<SessionData>> } =>  {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
