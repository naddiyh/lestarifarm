import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navbar/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans w-full min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <div className=" w-full">
            <div className="px-4 pt-4">
              <SidebarTrigger />
            </div>
            <main className="px-6 pb-8 md:pb-10">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
