
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAutehnticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setIsAuthenticated(!!data.session);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAutehnticated };
};
