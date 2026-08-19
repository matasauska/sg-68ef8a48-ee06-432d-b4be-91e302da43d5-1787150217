import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
  breederVerified: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = useCallback(async (sessionUser: any): Promise<AuthUser | null> => {
    if (!sessionUser) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, first_name, last_name, breeder_verified, is_admin")
      .eq("id", sessionUser.id)
      .single();

    const { data: sessionData } = await supabase.auth.getSession();
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      role: profile?.role || "buyer",
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      token: sessionData.session?.access_token || "",
      breederVerified: profile?.breeder_verified || false,
      isAdmin: profile?.is_admin || false,
    };
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    if (sessionUser) {
      const u = await buildUser(sessionUser);
      setUser(u);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [buildUser]);

  useEffect(() => {
    refreshUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        buildUser(session.user).then(setUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, [refreshUser, buildUser]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await refreshUser();
  };

  const register = async (data: RegisterData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        },
      },
    });
    if (error) throw new Error(error.message);
    if (authData.user) {
      await supabase.from("profiles").insert({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      });
    }
    await refreshUser();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}