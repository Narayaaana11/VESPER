import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  provider: "local" | "google";
  isVerified?: boolean;
  tier?: "free" | "pro" | "enterprise";
  licenseKey?: string;
  licenseActive?: boolean;
  usageQuota?: {
    totalSeconds: number;
    usedSeconds: number;
    periodReset: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; simulatedPin?: string; message?: string }>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  verifyLicense: (licenseKey: string) => Promise<{ valid: boolean; tier?: string; quota?: any; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "vesper_auth_token";
const USER_KEY = "vesper_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore session from localStorage on mount & listen for #signup / #login triggers
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }

      if (typeof window !== "undefined") {
        const checkHash = () => {
          if (
            window.location.hash.includes("signup") ||
            window.location.hash.includes("login") ||
            window.location.search.includes("auth=true")
          ) {
            setIsAuthModalOpen(true);
          }
        };
        checkHash();
        window.addEventListener("hashchange", checkHash);
        return () => window.removeEventListener("hashchange", checkHash);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return false;
      }

      saveSession(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`, {
        description:
          data.user.role === "admin" ? "Logged in with Admin CRM privileges." : "Ready to rock.",
      });
      setIsAuthModalOpen(false);
      return true;
    } catch {
      toast.error("Network error during login. Check connection.");
      return false;
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return false;
      }

      saveSession(data.token, data.user);
      toast.success("Welcome to VESPER!", {
        description: "Your account and license are active. A welcome email has been sent.",
      });
      setIsAuthModalOpen(false);
      return true;
    } catch {
      toast.error("Network error during account registration.");
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    toast.info("Google Sign-In is currently in progress. Please use email authentication — we are working on that.", {
      duration: 5000,
    });
    return false;
  };

  const sendVerificationEmail = async (
    email: string,
  ): Promise<{ success: boolean; simulatedPin?: string; message?: string }> => {
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send verification email");
        return { success: false, message: data.error };
      }
      toast.success(data.message || "Verification code sent to your email!");
      return { success: true, simulatedPin: data.simulatedPin, message: data.message };
    } catch {
      toast.error("Network error sending verification code.");
      return { success: false };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Email verification failed");
        return false;
      }

      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        const updated = {
          ...user,
          isVerified: true,
          licenseActive: true,
          licenseKey: data.licenseKey || user.licenseKey,
        };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }

      toast.success("Email verified!", {
        description: `Software license activated: ${data.licenseKey || "Active"}`,
      });
      return true;
    } catch {
      toast.error("Network error verifying email.");
      return false;
    }
  };

  const verifyLicense = async (
    licenseKey: string,
  ): Promise<{ valid: boolean; tier?: string; quota?: any; error?: string }> => {
    try {
      const res = await fetch("/api/license/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });
      const data = await res.json();
      return data;
    } catch {
      return { valid: false, error: "Network error reaching license verification gateway." };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    toast.info("Signed out of VESPER.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === "admin",
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        signup,
        loginWithGoogle,
        sendVerificationEmail,
        verifyEmail,
        verifyLicense,
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
