import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  changePasswordRequest,
  loginRequest,
  meRequest,
  registerRequest,
  updateMeRequest,
} from "../services/authService.js";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "rusk_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    const loadMe = async () => {
      try {
        const data = await meRequest(token);
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadMe();
  }, [token]);

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    saveSession(data.token, data.user);
    return data;
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    saveSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const data = await updateMeRequest(token, payload);
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (payload) => {
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    return changePasswordRequest(token, payload);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthLoading,
      isAuthenticated: Boolean(user),
      userRole: user?.role || "guest",
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [token, user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
