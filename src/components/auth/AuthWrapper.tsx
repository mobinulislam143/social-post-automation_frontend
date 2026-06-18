"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Zap as ZapIcon, Users } from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "Secure authentication with JWT" },
  { icon: ZapIcon,     text: "Role-based access control built in" },
  { icon: Users,       text: "Multi-tenant workspace management" },
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
            <span className="font-bold text-white text-xl">StarterKit</span>
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="animate-fade-up">
              <span className="text-brand text-sm font-semibold uppercase tracking-widest">
                Welcome back
              </span>
              <h2 className="mt-3 text-4xl xl:text-5xl font-bold text-white leading-tight">
                Build your SaaS{" "}
                <span className="text-brand">10× faster</span>
              </h2>
              <p className="mt-5 text-gray-400 text-lg leading-relaxed max-w-md">
                A production-ready Next.js starter with auth, RBAC, RTK Query,
                and a professional admin dashboard — all wired and ready.
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

          {/* Bottom quote */}
          <div className="border-t border-white/10 pt-8 animate-fade-up delay-300">
            <p className="text-gray-500 text-sm italic">
              &ldquo;Saved us two weeks of boilerplate. The RTK Query setup alone
              was worth it.&rdquo;
            </p>
            <p className="text-gray-600 text-xs mt-2">— Ariana M., CTO at Launchpad</p>
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
            <span className="font-bold text-gray-900 text-lg">StarterKit</span>
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
