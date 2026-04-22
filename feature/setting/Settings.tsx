"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Shield, Bell, Lock, ChevronRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="">
      <div className=" pb-6">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your account information and preferences
        </p>
      </div>

      <div className="pb-8 flex gap-6 items-start">
        {/* left*/}
        <div className="w-52 shrink-0 bg-white rounded-2xl  overflow-hidden shadow-sm">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all  ${
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
          {activeTab === "profile" && (
            <>
              {/* Avatar card */}
              <Card className="  p-6 ">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <Avatar className="w-16 h-16 ring-2 ring-white shadow-md">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback className="bg-[#1A3A2A] text-white text-lg font-medium">
                        NA
                      </AvatarFallback>
                    </Avatar>
                    <button
                      className="
                      absolute inset-0 rounded-full
                      bg-black/40 opacity-0 group-hover:opacity-100
                      transition-opacity flex items-center justify-center
                    "
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-gray-900">
                      Nadiyah Amaliyah
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield className="w-3 h-3 text-[#4CAF50]" />
                      <span className="text-[11px] text-[#4CAF50] font-medium">
                        Super Admin
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs  text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    Change Photo
                  </Button>
                </div>
              </Card>

              {/* Form card */}
              <Card className=" p-6">
                <div className="mb-5">
                  <h2 className="text-[13.5px] font-medium text-gray-800">
                    Personal Information
                  </h2>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">
                    Update your profile details below
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Full Name",
                      type: "text",
                      placeholder: "Enter your full name",
                      disabled: false,
                    },
                    {
                      label: "Email Address",
                      type: "email",
                      placeholder: "Enter your email",
                      disabled: false,
                    },
                    {
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "Enter your phone number",
                      disabled: false,
                    },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1.5">
                      <Label className="text-[12px] font-medium text-gray-600">
                        {field.label}
                      </Label>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className="
                          h-9 text-[13px] rounded-lg
                          border-gray-200 bg-gray-50/50
                          focus:bg-white focus:border-[#4CAF50] focus:ring-[#4CAF50]/20
                          placeholder:text-gray-300
                          transition-all
                        "
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-medium text-gray-600">
                      Role
                    </Label>
                    <div className="h-9 flex items-center px-3 rounded-lg bg-gray-100 border border-gray-200">
                      <Shield className="w-3.5 h-3.5 text-[#4CAF50] mr-2 shrink-0" />
                      <span className="text-[13px] text-gray-500">
                        Super Admin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-2" />

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">
                    Last updated: 2 days ago
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[12px] text-gray-500 hover:text-gray-700 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className={`
                        text-[12px] rounded-lg px-4 transition-all duration-300
                        ${
                          saved
                            ? "bg-green-500 text-white"
                            : "bg-[#1A3A2A] hover:bg-[#2D5A27] text-white"
                        }
                      `}
                    >
                      {saved ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          Saved!
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Notification preferences
              </p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          )}

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
