import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navbar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh w-full overflow-hidden">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <div className="px-4 pt-4">
            <SidebarTrigger />
          </div>

          <main className="px-6 pb-8 md:pb-10 flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
