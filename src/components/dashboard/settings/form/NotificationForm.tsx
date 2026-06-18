"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Bell, MessageSquare, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  productUpdates:  z.boolean().default(true),
  comments:        z.boolean().default(false),
  checkoutProduct: z.boolean().default(true),
}).partial();

type Values = z.infer<typeof schema>;

const items = [
  {
    key:  "productUpdates"  as const,
    icon: Bell,
    label: "Product updates",
    desc:  "Get notified when new features or updates are released.",
  },
  {
    key:  "comments" as const,
    icon: MessageSquare,
    label: "Comments",
    desc:  "Receive alerts when someone comments on your content.",
  },
  {
    key:  "checkoutProduct" as const,
    icon: ShoppingBag,
    label: "Checkout & orders",
    desc:  "Billing confirmations and order status updates.",
  },
];

export function NotificationForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { productUpdates: true, comments: false, checkoutProduct: true },
  });

  const onSubmit = (_data: Values) => {
    toast.success("Notification preferences saved.");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">Choose what you want to be notified about.</p>
      </div>

      <div className="space-y-2">
        {items.map(({ key, icon: Icon, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand" />
              </div>
              <div>
                <Label
                  htmlFor={key}
                  className="text-sm font-medium text-gray-800 cursor-pointer"
                >
                  {label}
                </Label>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </div>
            <Switch
              id={key}
              checked={form.watch(key) ?? false}
              onCheckedChange={(v) => form.setValue(key, v)}
              className="flex-shrink-0 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-10 px-6 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-all duration-200 gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save preferences
        </Button>
      </div>
    </form>
  );
}
