"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useLoginMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { loginSchema, type LoginFormValues } from "@/validations/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success("Welcome back!");
      router.push("/dashboard/monitoring");
    } catch (err) {
      // Surface the backend's reason (pending approval / blocked) when present.
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid email or password.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          New here?{" "}
          <Link
            href="/register"
            className="text-brand font-medium hover:text-brand-dark transition-colors"
          >
            Create an account
          </Link>{" "}
          — an admin approves it before first sign-in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-10 h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs text-brand hover:text-brand-dark font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              autoComplete="current-password"
              className="pl-10 pr-10 h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 animate-fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-all duration-200 gap-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            <>
              Sign in <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">
            Secure login powered by JWT
          </span>
        </div>
      </div>

      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
}
