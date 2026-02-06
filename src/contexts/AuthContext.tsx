import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "founder" | "dcol";

interface User {
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: Record<UserRole, User> = {
  founder: {
    name: "Manish",
    role: "founder",
    email: "manish@argosinfotech.com",
  },
  dcol: {
    name: "Sarah Chen",
    role: "dcol",
    email: "sarah@argosinfotech.com",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const savedRole = localStorage.getItem("argos_user_role") as UserRole | null;
    if (savedRole && USERS[savedRole]) {
      setUser(USERS[savedRole]);
    }
  }, []);

  const login = (role: UserRole) => {
    const selectedUser = USERS[role];
    setUser(selectedUser);
    localStorage.setItem("argos_user_role", role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("argos_user_role");
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
