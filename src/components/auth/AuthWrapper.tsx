"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Zap as ZapIcon, Users } from "lucide-react";

const features = [
  { icon: ZapIcon,     text: "Hourly automated checks on every client" },
  { icon: ShieldCheck, text: "Complete / Partial / Missing at a glance" },
  { icon: Users,       text: "Admin and Viewer roles" },
];

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-gray-950 flex-col">
        {/* Gradient orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-brand/10 blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">OMIRA Monitor</span>
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="animate-fade-up">
              <span className="text-brand text-sm font-semibold uppercase tracking-widest">
                Welcome back
              </span>
              <h2 className="mt-3 text-4xl xl:text-5xl font-bold text-white leading-tight">
                Who posted <span className="text-brand">today?</span>
              </h2>
              <p className="mt-5 text-gray-400 text-lg leading-relaxed max-w-md">
                One dashboard for every client&apos;s Instagram, YouTube, and
                TikTok — checked automatically every hour, so you only follow
                up with the ones who missed.
              </p>
            </div>

            {/* Feature list */}
            <ul className="mt-10 space-y-4 animate-fade-up delay-200">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom note */}
          <div className="border-t border-white/10 pt-8 animate-fade-up delay-300">
            <p className="text-gray-500 text-sm">
              OMIRA internal tool — monitoring the social presence of the
              entire ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">OMIRA Monitor</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px] animate-slide-right">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
