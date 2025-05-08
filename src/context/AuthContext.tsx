"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../api-services/api-services";
import axios from "axios";
import Loading from "@/components/ui/loading";
import PinUpdateModal from "@/components/PinUpdateModal";

const PUBLIC_ROUTES = ["/login"];

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const token = localStorage.getItem("access_token");

    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.username) {
        setUsername(decoded.username);
      }
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_BACKEND_API_URL}/test-token`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then(async () => {
        if (PUBLIC_ROUTES.includes(pathname)) {
          window.location.href = "/dashboard";
        } else {
          setLoading(false);
          setIsAuthenticated(true);

          // Check if user has updated PIN
          // try {
          //   const pinStatus = await api.get("/users/me/has-updated-pin");
          //   console.log("PIN Update Status:", pinStatus.data);
          //   if (!pinStatus.data.hasUpdatedPin) {
          //     setShowPinModal(true);
          //   }
          // } catch (error) {
          //   console.error("Error checking PIN status:", error);
          // }
        }
      })
      .catch(async (_) => {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_BACKEND_API_URL}/refresh-token`,
              {
                refresh_token: refreshToken,
              }
            );

            // Update tokens in localStorage
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);

            // Decode and set username from new token
            const decoded = decodeJWT(response.data.access_token);
            if (decoded?.username) {
              setUsername(decoded.username);
            }

            // Retry the original request with new token
            const token = response.data.access_token;
            await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_BACKEND_API_URL}/test-token`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (PUBLIC_ROUTES.includes(pathname)) {
              window.location.href = "/dashboard";
            } else {
              setLoading(false);
              setIsAuthenticated(true);
            }
          } else {
            handleAuthFailure();
          }
        } catch (_) {
          handleAuthFailure();
        }
      });
  }, []);

  // Helper function to handle authentication failure
  const handleAuthFailure = () => {
    if (PUBLIC_ROUTES.includes(window.location.pathname)) {
      setLoading(false);
    } else {
      setUsername(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  };

  const login = async (username: string, password: string) => {
    if (username && password) {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      // Decode and set username from token
      const decoded = decodeJWT(response.data.access_token);
      if (decoded?.username) {
        setUsername(decoded.username);
      }

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid credentials");
      }
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-screen bg-white">
        <Loading
          containerClassName="h-screen"
          spinnerClassName="h-12 w-12"
          text="Authenticating..."
          textClassName="text-green-600 text-2xl"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
      <PinUpdateModal isOpen={showPinModal} />
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
