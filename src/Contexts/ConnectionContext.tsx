import React, { createContext, useContext, useState } from 'react';

interface Connection {
  fromId: string;
  toId: string;
}

interface ConnectionContextType {
  connections: Connection[];
  addConnection: (fromId: string, toId: string) => void;
  removeConnection: (fromId: string, toId: string) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([]);

  const addConnection = (fromId: string, toId: string) => {
    setConnections(prev => [...prev, { fromId, toId }]);
  };

  const removeConnection = (fromId: string, toId: string) => {
    setConnections(prev => prev.filter(conn => !(conn.fromId === fromId && conn.toId === toId)));
  };

  return (
    <ConnectionContext.Provider value={{ connections, addConnection, removeConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnections must be used within a ConnectionProvider');
  return context;
};
