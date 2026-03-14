import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import { AuthContext } from "./authContext.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const value = useMemo(() => {
    const login = async ({ email, password }) => {
      const response = await api.post("/users/login", { email, password });
      const loggedInUser = response?.data?.data || null;
      const newToken = response?.data?.token || "";

      setUser(loggedInUser);
      setToken(newToken);
      return loggedInUser;
    };

    const register = async ({
      firstName,
      lastName,
      email,
      password,
      mobileNo,
      imageFile,
      isAdmin,
      adminKey,
    }) => {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("mobileNo", mobileNo);
      if (imageFile) formData.append("image", imageFile);
      if (isAdmin) {
        formData.append("isAdmin", "true");
        if (adminKey) formData.append("adminKey", adminKey);
      }

      await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return login({ email, password });
    };

    const logout = () => {
      setUser(null);
      setToken("");
    };

    return {
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
      setToken,
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
export { AuthProvider };
