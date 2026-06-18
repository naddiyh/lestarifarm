"use client";

import { useState, useEffect } from "react";
import { Check, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/hooks/useProfile";

interface Props {
  user: UserProfile;
  onSave: (fields: { name: string; phone: string }) => Promise<void>;
}

export function ProfileForm({ user, onSave }: Props) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ name: user.name || "", phone: user.phone || "" });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ name: form.name, phone: form.phone });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setForm({ name: user.name || "", phone: user.phone || "" });
  };

  return (
    <>
      <div className="mb-5">
        <h2 className="text-[13.5px] font-medium text-gray-800">
          Personal Information
        </h2>
        <p className="text-[11.5px] text-gray-400 mt-0.5">
          Update your profile details below
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-[12px] font-medium text-gray-600">
            Full Name
          </Label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-9 text-[13px] rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] font-medium text-gray-600">
            Email Address
          </Label>
          <Input
            type="email"
            value={user.email}
            disabled
            className="h-9 text-[13px] rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] font-medium text-gray-600">
            Phone Number
          </Label>
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="h-9 text-[13px] rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] font-medium text-gray-600">Role</Label>
          <div className="h-9 flex items-center px-3 rounded-lg bg-gray-100 border">
            <Shield className="w-3.5 h-3.5 text-[#4CAF50] mr-2" />
            <span className="text-[13px] text-gray-500">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-4" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          Last updated:{" "}
          {new Date(user.updated_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-[12px] text-gray-500 hover:text-gray-700 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className={`text-[12px] rounded-lg px-4 transition-all duration-300 ${
              saved
                ? "bg-green-500 text-white"
                : "bg-[#1A3A2A] hover:bg-[#2D5A27] text-white"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Saved!
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
