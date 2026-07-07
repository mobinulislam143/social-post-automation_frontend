"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/store/api/authApi";

// ─────────────────────────────────────────────────────────────────────────────
// Self-registration. The account is created in "pending" state — a super
// admin must approve it before the first sign-in works.
// ─────────────────────────────────────────────────────────────────────────────

export default function Register() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || form.password.length < 8) {
      toast.error("Fill in your name, email, and a password of at least 8 characters.");
      return;
    }
    try {
      await register({ ...form, lastName: form.lastName || "-" }).unwrap();
      toast.success("Account created! You can sign in once an admin approves it.", {
        duration: 8000,
      });
      router.push("/login");
    } catch (err) {
      const data =
        (err as { data?: { message?: string; errors?: Record<string, string> } })?.data;
      toast.error(
        data?.errors ? Object.values(data.errors)[0] : data?.message ?? "Registration failed"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Already approved?{" "}
          <Link href="/login" className="text-brand font-medium hover:text-brand-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                id="firstName"
                placeholder="Jane"
                className="pl-10 h-11 border-gray-200"
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              className="h-11 border-gray-200"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-10 h-11 border-gray-200"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars with upper, lower, number & symbol"
              autoComplete="new-password"
              className="pl-10 pr-10 h-11 border-gray-200"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl gap-2 cursor-pointer mt-2"
        >
          {isLoading ? "Creating account…" : (<>Create account <ArrowRight className="w-4 h-4" /></>)}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          New accounts need admin approval before the first sign-in.
        </p>
      </form>
    </div>
  );
}
