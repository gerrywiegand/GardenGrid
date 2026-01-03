import { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "./auth";
import { login as loginApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const isAuthed = !!token;

  async function login(username, password) {
    const data = await loginApi({ username, password });
    const newToken = data.access_token;
    setToken(newToken);
    setTokenState(newToken);
  }

  function logout() {
    clearToken();
    setTokenState("");
  }

  const value = useMemo(
    () => ({ token, isAuthed, login, logout }),
    [token, isAuthed]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
