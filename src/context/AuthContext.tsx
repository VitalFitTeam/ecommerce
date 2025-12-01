"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/sdk-config";
import { useRouter } from "@/i18n/routing";
import { User } from "@vitalfit/sdk";

interface JwtPayload {
  exp?: number;
  sub: string;
  role?: string | string[];
  roles?: string[];
}

type SetUserType = (
  value: User | null | ((prev: User | null) => User | null),
) => void;

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setUser: SetUserType;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setUser: SetUserType = (value) => {
    setUserState((prev) => {
      if (typeof value === "function") {
        return value(prev);
      }
      return value;
    });
  };

  const getUserProfile = useCallback(
    async (token: string): Promise<User | null> => {
      const decoded = decodeToken(token);
      if (!decoded) {
        return null;
      }

      try {
        const profileResponse = await api.user.WhoAmI(token);
        if (!profileResponse?.user) {
          console.error("Respuesta de WhoAmI inválida");
          return null;
        }

        const userData = profileResponse.user;

        return {
          // --- Identidad y Contacto ---
          user_id: userData.user_id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone: userData.phone,
          identity_document: userData.identity_document,
          birth_date: userData.birth_date,
          gender: userData.gender ?? "",
          profile_picture_url: userData.profile_picture_url ?? "",

          // --- Estatus y Seguridad ---
          status: userData.status,
          is_validated: userData.is_validated ?? false,
          block_justification: userData.block_justification ?? "", // Fallback a string vacío si viene null

          // --- Roles y Relaciones ---
          role_id: userData.role_id,
          role: userData.role,
          ClientProfile: userData.ClientProfile,

          // Opcional (puede ser undefined)
          client_membership: userData.client_membership,

          // --- Timestamps ---
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          deleted_at: userData.deleted_at ?? null,
        };
      } catch (error) {
        console.error("Error al obtener perfil del usuario:", error);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
          const userProfile = await getUserProfile(storedToken);
          if (userProfile) {
            setToken(storedToken);
            setUser(userProfile);
          } else {
            localStorage.removeItem("access_token");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("AuthContext: init error:", error);
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [getUserProfile]);

  const login = useCallback(
    async (newToken: string) => {
      setIsLoading(true);
      try {
        const userProfile = await getUserProfile(newToken);

        if (userProfile) {
          localStorage.setItem("access_token", newToken);
          setToken(newToken);
          setUser(userProfile);
        } else {
          localStorage.removeItem("access_token");
          setToken(null);
          setUser(null);
          throw new Error("Credenciales inválidas o sin permisos");
        }
      } catch (err) {
        console.error("Login error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getUserProfile],
  );

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

  const contextValue: AuthContextType = {
    token,
    user,
    loading: isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
