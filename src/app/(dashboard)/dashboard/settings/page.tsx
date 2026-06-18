"use client";

import { useState } from "react";
import { SettingsContent } from "@/components/dashboard/settings/SettingsContent";
import { SettingsSidebar } from "@/components/dashboard/settings/SettingsSidebar";

type Section = "basic" | "account" | "notifications";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("basic");

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Mobile: horizontal tabs on top — Desktop: sidebar left */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 min-w-0">
          <SettingsContent activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
}
