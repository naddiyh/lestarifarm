import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAutehnticated, setIsAuthenticated] = useState(false);

  return useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsAuthenticated(!!data.user);
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
