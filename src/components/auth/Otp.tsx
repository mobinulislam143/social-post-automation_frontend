"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVerifyOtpMutation } from "@/store/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

type OtpValues = z.infer<typeof otpSchema>;

export default function Otp({ email }: { email?: string }) {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpValues) => {
    try {
      await verifyOtp({ email: email ?? "", otp: data.otp }).unwrap();
      router.push("/reset-password");
    } catch {
      toast.error("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-[13px] overflow-hidden">
      <h2 className="text-2xl text-center text-white bg-primary py-[18px] font-medium mb-6">
        Enter your OTP
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
            6-digit code
          </Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            placeholder="000000"
            className="mt-2 h-12 px-2 text-lg tracking-widest text-center border-gray-200 focus-visible:ring-brand/30"
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl gap-2 cursor-pointer"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </div>
  );
}
