"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  name?: string;
  img?: string | null;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({ name, img, uploading, onFileChange }: Props) {
  return (
    <div className="flex items-center gap-5">
      <div className="relative group">
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />
        <Avatar className="w-16 h-16 ring-2 ring-white shadow-md">
          <AvatarImage
            key={img} 
            src={img || ""}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-[#1A3A2A] text-white text-lg font-medium">
            {name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor="photo-upload"
          className="absolute inset-0 rounded-full bg-black/40 opacity-0
                     group-hover:opacity-100 transition-opacity
                     flex items-center justify-center cursor-pointer"
        >
          {uploading ? (
            <span className="text-white text-[10px] animate-pulse">...</span>
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </label>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-xs text-gray-600 hover:bg-gray-50 rounded-lg"
        onClick={() => document.getElementById("photo-upload")?.click()}
        disabled={uploading}
      >
        <Camera className="w-3.5 h-3.5 mr-1.5" />
        {uploading ? "Uploading..." : "Change Photo"}
      </Button>
    </div>
  );
}
