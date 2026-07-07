"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/store/api/authApi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Users, LogOut, Zap, Activity, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Monitoring", icon: Activity, href: "/dashboard/monitoring" },
  { title: "Metrics", icon: LineChart, href: "/dashboard/metrics" },
  { title: "Users", icon: Users, href: "/dashboard/users" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [revokeSession] = useLogoutMutation();

  const handleLogout = () => {
    // Revoke the refresh token server-side (fire-and-forget), then clear
    // local state + cookies.
    revokeSession({ refreshToken }).unwrap().catch(() => {});
    dispatch(logout());
    toast.success("Logged out");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sidebar-foreground text-base truncate">
            OMIRA Monitor
          </span>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-2">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "h-9 rounded-lg transition-all duration-150",
                        isActive
                          ? "bg-brand text-white hover:bg-brand hover:text-white"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: user + logout */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          {/* User info */}
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-brand">{initials}</span>
              </div>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
