"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  User,
  Activity,
  LayoutDashboard,
  Settings2,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "../ui/sidebar";

import { NavUser } from "./nav-user";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

const items = [
  {
    title: "Dashboard",
    desc: "Overview system",
    icon: <LayoutDashboard size={18} />,
    src: "/dashboard",
  },
  {
    title: "Monitoring",
    desc: "Visualisation data",
    icon: <Activity size={18} />,
    src: "/monitoring",
  },
  {
    title: "Users",
    desc: "Manage users",
    icon: <User size={18} />,
    src: "/user",
  },
  {
    title: "Settings",
    desc: "Preferences",
    icon: <Settings2 size={18} />,
    src: "/settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<SidebarUser>({
    name: "",
    email: "",
    avatar: "",
  });

  const getCurrentUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("name,email,img")
      .eq("user_id", authUser.id)
      .single();

    if (error || !data) {
      setUser({
        name: authUser.email?.split("@")[0] ?? "User",
        email: authUser.email ?? "",
        avatar: "",
      });
      return;
    }

    setUser({
      name: data.name,
      email: data.email,
      avatar: data.img ?? "",
    });
  };

  useEffect(() => {
    getCurrentUser();

    const channel = supabase
      .channel("sidebar-user")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        () => {
          getCurrentUser();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Sidebar>
      <SidebarContent
        className="
          bg-linear-to-b
          from-[#1F2D2E]
          via-[#264c43]
          to-[#325149]
          h-full flex flex-col
        "
      >
        <SidebarHeader>
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>

            <div>
              <p className="text-white text-sm font-semibold">Lestari Farm</p>
              <p className="text-xs text-white/70">Hydroponic Monitoring</p>
            </div>
          </div>
        </SidebarHeader>

        <div className="my-3 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.src);

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.src}>
                      <div
                        className={`
                          w-full flex items-center gap-3 px-4 py-3
                          border-l-2 transition-all cursor-pointer
                          ${
                            isActive
                              ? "bg-[#F0FAF0] border-l-[#4CAF50] rounded-md text-gray-900"
                              : "border-l-transparent text-white/70 hover:bg-white/10 rounded-md hover:text-white"
                          }
                        `}
                      >
                        <span>{item.icon}</span>

                        <div className="flex-1">
                          <p
                            className={`text-[13px] font-medium ${
                              isActive ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {item.title}
                          </p>

                          <p
                            className={`text-[10px] ${
                              isActive ? "text-gray-500" : "text-white/60"
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>

                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-[#4CAF50]" />
                        )}
                      </div>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto px-2 pb-3">
          <div className="mb-3 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

          <NavUser user={user} onSignOut={handleSignOut} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
