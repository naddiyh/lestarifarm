"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/interface/userType";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error: sbError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (sbError) {
      setError("Gagal mengambil data users.");
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  };

  const addUser = async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    const { name, email, password, phone, role } = payload;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    const user_id = authData.user?.id ?? crypto.randomUUID();

    const { error: insertError } = await supabase.from("users").insert({
      user_id,
      name,
      email,
      phone,
      role,
      img: null,
    });

    if (insertError) throw new Error(insertError.message);

    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, addUser, deleteUser, refetch: fetchUsers };
}
