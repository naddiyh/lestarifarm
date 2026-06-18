"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  img: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData.user;
      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (error) {
        console.error("ERROR FETCH USER:", error.message);
      } else {
        setUser(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const updateProfile = async (fields: { name?: string; phone?: string }) => {
    if (!user) return;
    const { error } = await supabase
      .from("users")
      .update(fields)
      .eq("user_id", user.user_id);

    if (error) {
      toast.error(error.message);
    } else {
      setUser((prev) => (prev ? { ...prev, ...fields } : prev));
      toast.success("Profile saved!");
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Max file size is 1MB");
      return;
    }
    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `${user.user_id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photo profile")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("photo profile")
        .getPublicUrl(fileName);

      // bust cache supaya avatar langsung berubah
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("users")
        .update({ img: publicUrl })
        .eq("user_id", user.user_id);

      if (updateError) throw new Error(updateError.message);

      setUser((prev) => (prev ? { ...prev, img: publicUrl } : prev));
      toast.success("Photo updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return { user, loading, uploading, updateProfile, uploadPhoto };
}
