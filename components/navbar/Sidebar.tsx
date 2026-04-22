"use client";

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
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "bubu.rab",
    email: "super-admin",
    avatar: "/avatars/shadcn.jpg",
  },
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
                        <span className="text-base">{item.icon}</span>

                        <div className="flex-1">
                          <p
                            className={`text-[13px] font-medium leading-tight ${
                              isActive ? "text-gray-900" : "text-white/80"
                            }`}
                          >
                            {item.title}
                          </p>

                          <p
                            className={`text-[10.5px] ${
                              isActive ? "text-gray-500" : "text-white/50"
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

        {/* FOOTER */}
        <SidebarFooter className="mt-auto px-2 pb-3">
          <div className="mb-3 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

          <NavUser user={data.user} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
