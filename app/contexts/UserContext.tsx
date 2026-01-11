"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TUser } from "../types";

export interface TUserContext {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  logout: () => void;
}
export const userContext = createContext<TUserContext | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<TUser | null>(null);
  const setUser = (user: TUser | null) => {
    setUserState(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setUserState(null);
    sessionStorage.clear();
  };
  useEffect(() => {
    const userStorage = JSON.parse(sessionStorage.getItem("user") as string);
    if (userStorage) setUserState(userStorage);
  }, []);
  return (
    <userContext.Provider value={{ user, setUser, logout }}>
      {children}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
