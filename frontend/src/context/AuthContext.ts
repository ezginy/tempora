import { createContext } from "react";

export type User = {
  id: number;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);