import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { logout as logoutService } from "../services/logout";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, csrfToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const csrfToken = localStorage.getItem("csrfToken");
    const savedUsername = localStorage.getItem("username");
    
    if (csrfToken && savedUsername) {
      setUser({ username: savedUsername });
    }
  }, []);

  const login = (username: string, csrfToken: string) => {
    
    setUser({ username });
    localStorage.setItem("username", username);
    
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    } else {
      console.error("No se recibió csrfToken en AuthContext.login");
    }
  };

  const logout = async () => {
    try {
      await logoutService();

    } catch (error) {
      console.error("Error al cerrar sesión:", error);

    } finally {
      setUser(null);
      localStorage.removeItem("username");
      localStorage.removeItem("csrfToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
