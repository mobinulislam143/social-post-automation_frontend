"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";

const pageTitles: Record<string, string> = {
  "/dashboard/overview": "Overview",
  "/dashboard/users": "Users",
  "/dashboard/providers": "Providers",
  "/dashboard/qualitylist": "Quality",
  "/dashboard/messages": "Messages",
  "/dashboard/settings": "Settings",
  "/dashboard/admin": "Admin",
};

export default function DashboardNav() {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const user = useAppSelector((state) => state.auth.user);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-4 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Left: toggle + title */}
      <SidebarTrigger className="-ml-1 text-gray-500 hover:text-gray-900" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>

      {/* Right: search + bell + avatar */}
      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search…"
            className="pl-8 h-8 w-48 text-sm bg-gray-50 border-gray-200 focus-visible:ring-brand/30"
          />
        </div>

        {/* Bell */}
        <button className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-xs font-semibold text-brand">{initials}</span>
        </div>
      </div>
    </header>
  );
}
