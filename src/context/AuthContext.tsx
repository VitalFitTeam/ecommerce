"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/sdk-config";

interface JwtPayload {
  exp?: number;
  sub: string;
  iat?: number;
}

export interface User {
  user_id: string;
  first_name: string;
  email: string;
  last_name: string;
  is_validated: boolean;
  profile_picture_url?: string;
  phone?: string;
  identity_document?: string;
  birth_date?: string;
  [k: string]: any;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Verificar expiración con margen de 5 minutos
    if (decoded.exp && decoded.exp * 1000 < Date.now() - 300000) {
      return null;
    }

    return decoded;
  } catch (err) {
    console.warn("decodeToken error", err);
    return null;
  }
};

// Hook personalizado para acceso seguro al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initRef = useRef(false); // Para evitar doble inicialización

  const getUserProfile = useCallback(
    async (userToken: string): Promise<User | null> => {
      const decoded = decodeToken(userToken);
      if (!decoded) {
        return null;
      }

      try {
        const profileResponse = await api.user.WhoAmI(userToken);

        if (!profileResponse?.user) {
          console.error("Respuesta de WhoAmI inválida");
          return null;
        }

        const userData = profileResponse.user;

        return {
          user_id: userData.user_id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          is_validated: userData.is_validated ?? false,
          profile_picture_url: userData.profile_picture_url,
          phone: userData.phone,
          identity_document: userData.identity_document,
          birth_date: userData.birth_date,
        };
      } catch (error) {
        console.error("Error al obtener perfil del usuario:", error);
        return null;
      }
    },
    [],
  );

  const refreshUserProfile = useCallback(async () => {
    if (!token) {return;}

    try {
      const userProfile = await getUserProfile(token);
      if (userProfile) {
        setUser(userProfile);
      } else {
        await logout();
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  }, [token, getUserProfile]);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("access_token");
      setToken(null);
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, [router]);

  const login = useCallback(
    async (newToken: string) => {
      setLoading(true);
      try {
        const userProfile = await getUserProfile(newToken);

        if (userProfile) {
          localStorage.setItem("access_token", newToken);
          setToken(newToken);
          setUser(userProfile);
        } else {
          await logout();
          throw new Error("Credenciales inválidas");
        }
      } catch (err) {
        console.error("Login error:", err);
        await logout();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getUserProfile, logout],
  );

  // Efecto de inicialización mejorado
  useEffect(() => {
    if (initRef.current) {return;}
    initRef.current = true;

    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("access_token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        const userProfile = await getUserProfile(storedToken);

        if (userProfile) {
          setToken(storedToken);
          setUser(userProfile);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("AuthContext: init error:", error);
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getUserProfile]);

  // Verificación periódica del token (opcional)
  useEffect(() => {
    if (!token) {return;}

    const checkTokenValidity = () => {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken || storedToken !== token) {
        logout();
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        logout();
      }
    };

    // Verificar cada minuto
    const interval = setInterval(checkTokenValidity, 60000);
    return () => clearInterval(interval);
  }, [token, logout]);

  const value: AuthContextType = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
