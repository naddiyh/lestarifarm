"use client";

import { useState } from "react";
import { Bell, Lock, ChevronRight, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { ProfileForm } from "./components/ProfileForm";

const navTabs = [
  { id: "profile", label: "Profile", icon: "👤", desc: "Personal information" },
  {
    id: "notifications",
    label: "Notifications",
    icon: "🔔",
    desc: "Alert preferences",
  },
  { id: "security", label: "Security", icon: "🔒", desc: "Password & access" },
];

export const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading, uploading, updateProfile, uploadPhoto } = useProfile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  return (
    <div>
      {/* Header */}
      <div className="pb-6">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your account information and preferences
        </p>
      </div>

      <div className="pb-8 flex gap-6 items-start">
        {/* Sidebar nav */}
        <div className="w-52 shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                activeTab === tab.id
                  ? "bg-[#F0FAF0] border-l-[#4CAF50] text-gray-900"
                  : "border-l-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <div>
                <p
                  className={`text-[13px] font-medium leading-tight ${
                    activeTab === tab.id ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </p>
                <p className="text-[10.5px] text-gray-400 mt-0.5">{tab.desc}</p>
              </div>
              {activeTab === tab.id && (
                <ChevronRight className="w-3.5 h-3.5 text-[#4CAF50] ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 space-y-4">
          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <>
              {/* Avatar card */}
              <Card className="p-6">
                {loading || !user ? (
                  <div className="flex items-center gap-5 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <ProfileAvatar
                      name={user.name}
                      img={user.img}
                      uploading={uploading}
                      onFileChange={handleFileChange}
                    />
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-gray-900">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Shield className="w-3 h-3 text-[#4CAF50]" />
                        <span className="text-[11px] text-[#4CAF50] font-medium">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Form card */}
              <Card className="p-6">
                {loading || !user ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-9 bg-gray-100 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <ProfileForm user={user} onSave={updateProfile} />
                )}
              </Card>
            </>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Notification preferences
              </p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Security settings
              </p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
