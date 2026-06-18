"use client";

import { BasicForm }        from "./form/BasicForm";
import { NotificationForm } from "./form/NotificationForm";
import { PasswordForm }     from "./form/PasswordForm";

type Section = "basic" | "account" | "notifications";

export function SettingsContent({ activeSection }: { activeSection: Section }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-fade-up">
      {activeSection === "basic"         && <BasicForm />}
      {activeSection === "account"       && <PasswordForm />}
      {activeSection === "notifications" && <NotificationForm />}
    </div>
  );
}
