import React from 'react';
export const AuthContext = React.createContext({});
export const useAuth = jest.fn();
export const AuthProvider = ({children}) => (<AuthContext.Provider value={{}}>{children}</AuthContext.Provider>);
