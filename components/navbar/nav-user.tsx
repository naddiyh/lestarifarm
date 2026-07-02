"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

type Props = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onSignOut?: () => void;
};

export function NavUser({ user, onSignOut }: Props) {
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <SidebarMenu>
      <SidebarMenuButton
        size="lg"
        onClick={onSignOut}
        className="hover:bg-white/10 cursor-pointer"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user.avatar} alt={user.name} />

          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate text-sm font-medium text-white">
            {user.name}
          </span>

          <span className="truncate text-xs text-white/70">{user.email}</span>
        </div>

        <LogOut className="size-5 text-white/80" />
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
