"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email:       z.string().email("Invalid email address"),
  country:     z.string().min(1, "Country is required"),
  city:        z.string().min(1, "City is required"),
  province:    z.string().min(1, "Province is required"),
  bio:         z.string().max(160, "Bio must be under 160 characters").optional(),
});

type Values = z.infer<typeof schema>;

export function BasicForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "Bryan Adams",
      email:       "bryanadams@gmail.com",
      country:     "India",
      city:        "Delhi",
      province:    "Street 01",
      bio:         "I specialise in HRM roles.",
    },
  });

  const onSubmit = (_data: Values) => {
    toast.success("Profile updated successfully.");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Profile information</h2>
        <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group cursor-pointer">
          <Avatar className="h-20 w-20 ring-2 ring-brand/20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Avatar" />
            <AvatarFallback className="bg-brand/10 text-brand text-xl font-semibold">
              BA
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Profile photo</p>
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or GIF · Max 2 MB</p>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-brand hover:text-brand-dark transition-colors cursor-pointer"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">Display name</Label>
          <Input
            id="displayName"
            placeholder="Bryan Adams"
            className="h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
            {...form.register("displayName")}
          />
          {form.formState.errors.displayName && (
            <p className="text-red-500 text-xs">{form.formState.errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Country / City / Province */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["country", "city", "province"] as const).map((field) => {
          const options: Record<typeof field, string[]> = {
            country:  ["India", "USA", "Canada"],
            city:     ["Delhi", "Mumbai", "Bangalore"],
            province: ["Street 01", "Street 02", "Street 03"],
          };
          return (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                {field}
              </Label>
              <Select
                onValueChange={(v) => form.setValue(field, v)}
                defaultValue={form.watch(field)}
              >
                <SelectTrigger
                  id={field}
                  className="h-11 border-gray-200 focus:ring-brand/30 cursor-pointer"
                >
                  <SelectValue placeholder={`Select ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  {options[field].map((o) => (
                    <SelectItem key={o} value={o} className="cursor-pointer">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
          <span className="text-xs text-gray-400">
            {form.watch("bio")?.length ?? 0}/160
          </span>
        </div>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself…"
          className="min-h-[90px] resize-none border-gray-200 focus-visible:ring-brand/30 focus-visible:border-brand transition-colors"
          {...form.register("bio")}
        />
        {form.formState.errors.bio && (
          <p className="text-red-500 text-xs">{form.formState.errors.bio.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-10 px-6 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-all duration-200 gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save changes
        </Button>
      </div>
    </form>
  );
}
