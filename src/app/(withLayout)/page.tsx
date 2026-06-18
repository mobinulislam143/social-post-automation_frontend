import Link from "next/link";
import {
  ArrowRight, Zap, Shield, BarChart3, Users,
  Globe, Lock, CheckCircle, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Next.js 15 + Turbopack gives you sub-second builds and instant hot reload out of the box.",
    color: "text-amber-500", bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Auth Ready",
    description: "Bearer token auth with automatic refresh, persistent sessions, and route protection — wired day one.",
    color: "text-blue-500", bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Admin Dashboard",
    description: "Stat cards, area charts, data tables, and RBAC gating — swap in your real endpoints and ship.",
    color: "text-purple-500", bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "RBAC Built In",
    description: "Single `can(role, action)` helper and a `<Can>` wrapper. No scattered if-statements.",
    color: "text-green-500", bg: "bg-green-50",
  },
  {
    icon: Globe,
    title: "RTK Query Layer",
    description: "Every API call goes through RTK Query. Change your backend URL — nothing else moves.",
    color: "text-cyan-500", bg: "bg-cyan-50",
  },
  {
    icon: Lock,
    title: "Type Safe",
    description: "Strict TypeScript throughout. Shared Zod schemas on client and server. No silent surprises.",
    color: "text-red-500", bg: "bg-red-50",
  },
];

const stats = [
  { value: "15+",  label: "Pre-built pages"       },
  { value: "0",    label: "Direct fetch() calls"   },
  { value: "100%", label: "TypeScript coverage"    },
  { value: "1 cmd",label: "To run locally"         },
];

const testimonials = [
  { name: "Ariana M.", role: "CTO at Launchpad",   quote: "Saved us two weeks of boilerplate. The RTK Query setup alone was worth it.",                            rating: 5 },
  { name: "James K.",  role: "Indie founder",       quote: "I forked this, swapped the API URL, and had a working MVP in a weekend.",                              rating: 5 },
  { name: "Priya L.",  role: "Lead Engineer, ScaleHQ", quote: "The RBAC pattern is exactly how we'd have built it ourselves — just already done.",                 rating: 5 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8 border border-green-100 animate-fade-up">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Next.js 15 · TypeScript · Tailwind v4 · RTK Query</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-5 sm:mb-6 animate-fade-up delay-100">
            Ship your SaaS{" "}
            <span className="text-brand">10× faster</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-up delay-200">
            A production-ready Next.js starter with auth, RBAC, RTK Query, and a
            professional admin dashboard — all wired and working.
          </p>

          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up delay-300">
            <Link href="/register" className="w-full xs:w-auto">
              <Button
                size="lg"
                className="w-full xs:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-brand hover:bg-brand-dark text-white rounded-xl gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-brand/20"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/overview" className="w-full xs:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full xs:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 cursor-pointer"
              >
                View demo dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard wireframe preview */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 px-0 sm:px-4 animate-fade-up delay-400">
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl sm:shadow-2xl shadow-gray-200/60 overflow-hidden bg-gray-50">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-gray-100">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-3 sm:mx-4">
                <div className="h-5 sm:h-6 bg-gray-100 rounded-md w-32 sm:w-48" />
              </div>
            </div>
            <div className="grid grid-cols-4 h-48 sm:h-72 md:h-[340px]">
              {/* Sidebar */}
              <div className="col-span-1 bg-gray-900 p-2 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-6 sm:h-8 bg-white/10 rounded-lg" />
                <div className="space-y-1 pt-2 sm:pt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-6 sm:h-8 rounded-lg ${i === 0 ? "bg-brand/80" : "bg-white/5"}`} />
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="col-span-3 p-2 sm:p-5 space-y-2 sm:space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 sm:h-20 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm" />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="col-span-2 h-24 sm:h-44 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm" />
                  <div className="h-24 sm:h-44 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 sm:py-16 bg-gray-950">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-brand font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3">
              Everything you need
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for speed, designed to scale
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              Every module is a decision already made — auth, state, RBAC, forms, charts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="p-5 sm:p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by builders
            </h2>
            <p className="text-base sm:text-lg text-gray-500">
              Teams that chose to spend time on product, not boilerplate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-5 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="pricing" className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center bg-gray-950 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 bg-brand/10 text-green-400 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-5 sm:mb-6">
              <CheckCircle className="w-3.5 h-3.5" />
              Free &amp; open source
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to build?
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Clone the repo, run one command, and have a working app in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-brand hover:bg-brand-dark text-white rounded-xl gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-brand/20"
                >
                  Start building <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
