"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const schema = z
  .object({
    oldPassword:     z.string().min(1, "Current password is required"),
    newPassword:     z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Must contain letters")
      .regex(/[0-9]/,    "Must contain numbers"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type Values = z.infer<typeof schema>;

function PasswordInput({
  id,
  placeholder,
  reg,
  error,
}: {
  id: string;
  placeholder: string;
  reg: ReturnType<ReturnType<typeof useForm<Values>>["register"]>;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10 h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
          {...reg}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label={show ? "Hide" : "Show"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs animate-fade-in">{error}</p>}
    </div>
  );
}

export function PasswordForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = (_data: Values) => {
    toast.success("Password updated successfully.");
    form.reset();
  };

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Use a strong password you don&apos;t use anywhere else.
        </p>
      </div>

      {/* Security hint */}
      <div className="flex items-start gap-3 bg-brand/5 border border-brand/10 rounded-xl p-4">
        <ShieldCheck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          Min 8 characters with a mix of letters and numbers.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
            Current password
          </Label>
          <PasswordInput
            id="oldPassword"
            placeholder="Your current password"
            reg={form.register("oldPassword")}
            error={errors.oldPassword?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            New password
          </Label>
          <PasswordInput
            id="newPassword"
            placeholder="At least 8 characters"
            reg={form.register("newPassword")}
            error={errors.newPassword?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
            Confirm new password
          </Label>
          <PasswordInput
            id="confirmNewPassword"
            placeholder="Repeat new password"
            reg={form.register("confirmNewPassword")}
            error={errors.confirmNewPassword?.message}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-10 px-6 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-all duration-200 gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Update password
        </Button>
      </div>
    </form>
  );
}
