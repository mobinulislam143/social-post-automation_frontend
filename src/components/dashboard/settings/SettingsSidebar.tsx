"use client";

import { cn } from "@/lib/utils";
import { User, Lock, Bell } from "lucide-react";

type Section = "basic" | "account" | "notifications";

const items: { id: Section; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "basic",         label: "Profile",       icon: User, desc: "Name, photo, bio"      },
  { id: "account",       label: "Password",      icon: Lock, desc: "Change your password"  },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email & push alerts"   },
];

interface Props {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
}

export function SettingsSidebar({ activeSection, setActiveSection }: Props) {
  return (
    <>
      {/* Mobile: horizontal pill tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0",
              activeSection === id
                ? "bg-brand text-white shadow-sm shadow-brand/30"
                : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Desktop: vertical sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <nav className="space-y-1">
          {items.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group",
                activeSection === id
                  ? "bg-brand text-white shadow-sm shadow-brand/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                activeSection === id
                  ? "bg-white/20"
                  : "bg-gray-100 group-hover:bg-gray-200"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{label}</p>
                <p className={cn(
                  "text-xs truncate",
                  activeSection === id ? "text-white/70" : "text-gray-400"
                )}>
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
