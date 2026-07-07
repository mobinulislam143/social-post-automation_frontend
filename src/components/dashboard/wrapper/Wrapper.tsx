"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";
import DashboardNav from "../DashboardNavbar";
import { useAppSelector } from "@/store/hooks";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // Second line of defense behind the proxy cookie check: if the persisted
  // session is gone (or was force-logged-out on a failed refresh), leave.
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0 lets this flex child shrink instead of pushing a page-level
          horizontal scrollbar; wide tables scroll inside their own cards. */}
      <SidebarInset className="bg-gray-50 min-h-screen min-w-0">
        <DashboardNav />
        <main className="flex flex-col gap-6 p-4 sm:p-6 min-w-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Wrapper;
