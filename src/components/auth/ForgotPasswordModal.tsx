"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/validations/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const [sendReset, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendReset(data).unwrap();
      toast.success("Reset link sent — check your inbox.");
      reset();
      onClose();
    } catch {
      toast.error("Could not send reset link. Please try again.");
    }
  };

  const handleClose = () => { reset(); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 animate-scale-in">
        {/* Icon */}
        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center mb-5">
          <Mail className="w-6 h-6 text-brand" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="pl-10 h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs animate-fade-in">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-all duration-200 gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send reset link
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </button>
        </form>
      </div>
    </div>
  );
}
