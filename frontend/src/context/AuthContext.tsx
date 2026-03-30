"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";

const baseUrl =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "https://amazon-clone-backend-5i8v.onrender.com";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("amz_user");
    const token = Cookie.get("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem("amz_user");
    }
    setLoading(false);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ FIXED SIGNUP
  const signup = async (name: string, email: string, password: string) => {
    if (!name || name.trim().length < 2)
      return { success: false, message: "Enter your full name." };

    if (!validateEmail(email))
      return { success: false, message: "Enter a valid email." };

    if (password.length < 6)
      return { success: false, message: "Password must be 6+ characters." };

    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      console.log("SIGNUP API RESPONSE:", data);

      if (res.ok && data.status === "success") {
        Cookie.set("token", data.token, { expires: 7 });
        localStorage.setItem("amz_user", JSON.stringify(data.user));
        setUser(data.user);

        return { success: true, status: "success" };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      return { success: false, message: "Server connection failed." };
    }
  };

  // ✅ FIXED LOGIN
  const login = async (email: string, password: string) => {
    if (!validateEmail(email))
      return { success: false, message: "Enter a valid email." };

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN API RESPONSE:", data);

      if (res.ok && data.status === "success") {
        Cookie.set("token", data.token, { expires: 7 });
        localStorage.setItem("amz_user", JSON.stringify(data.user));
        setUser(data.user);

        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return { success: false, message: "Login failed. Check your connection." };
    }
  };

  const logout = () => {
    Cookie.remove("token");
    localStorage.removeItem("amz_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);