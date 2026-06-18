"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
  onSignOut,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onSignOut?: () => void;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuButton
        size="lg"
        onClick={onSignOut}
        className="hover:bg-transparent active:bg-transparent"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-accent text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        <LogOut className="ml-auto size-6 text-accent cursor-pointer" />
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
