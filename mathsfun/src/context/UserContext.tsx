'use client';

import { createContext, useState, useContext } from 'react';

type User = {
  name: string;
  isLoggedIn: boolean;
};

type UserContextType = {
  user: User;
  login: (name: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: { name: '', isLoggedIn: false },
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : { name: '', isLoggedIn: false };
    }
    return { name: '', isLoggedIn: false };
  });

  const login = (name: string) => {
    const newUser = { name, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ name: '', isLoggedIn: false });
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 