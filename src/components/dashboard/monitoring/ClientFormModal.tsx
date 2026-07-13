"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddMonitorClientMutation,
  useUpdateMonitorClientMutation,
} from "@/store/api/monitoringApi";
import {
  ClientInput,
  MonitoredClient,
  ProfileInput,
  SocialPlatform,
} from "@/types/monitoring.type";
import PlatformIcon from "./PlatformIcon";

// ─────────────────────────────────────────────────────────────────────────────
// Add / edit a monitored client with its social profiles.
// Pass `client` to edit; omit for create.
// ─────────────────────────────────────────────────────────────────────────────

const PLATFORMS: SocialPlatform[] = [
  "INSTAGRAM",
  "YOUTUBE",
  "TIKTOK",
  "FACEBOOK",
  "LINKEDIN",
  "X",
];

const EMPTY_PROFILE: ProfileInput = { platform: "INSTAGRAM", username: "" };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: MonitoredClient | null;
}

export default function ClientFormModal({ open, onOpenChange, client }: Props) {
  const isEdit = Boolean(client);
  const [addClient, { isLoading: adding }] = useAddMonitorClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateMonitorClientMutation();
  const saving = adding || updating;

  const [form, setForm] = useState<ClientInput>({ name: "" });
  const [profiles, setProfiles] = useState<ProfileInput[]>([{ ...EMPTY_PROFILE }]);

  // Sync form state whenever the modal opens for a different client.
  useEffect(() => {
    if (!open) return;
    if (client) {
      setForm({
        name: client.name,
        division: client.division,
        description: client.description,
        website: client.website ?? "",
        notes: client.notes,
      });
      setProfiles(
        client.profiles.length > 0
          ? client.profiles.map((p) => ({
              platform: p.platform,
              username: p.username,
              url: p.url,
              isActive: p.isActive,
            }))
          : [{ ...EMPTY_PROFILE }]
      );
    } else {
      setForm({ name: "" });
      setProfiles([{ ...EMPTY_PROFILE }]);
    }
  }, [open, client]);

  const setField = (key: keyof ClientInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setProfile = (index: number, patch: Partial<ProfileInput>) =>
    setProfiles((list) => list.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error("Client name is required");
      return;
    }
    const cleanProfiles = profiles.filter((p) => p.username.trim().length > 0);

    try {
      const payload: ClientInput = { ...form, profiles: cleanProfiles };
      if (isEdit && client) {
        await updateClient({ id: client.id, data: payload }).unwrap();
        toast.success(`${form.name} updated`);
      } else {
        await addClient(payload).unwrap();
        toast.success(`${form.name} added`);
      }
      onOpenChange(false);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${client?.name}` : "Add Client"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="client-name">Name *</Label>
              <Input
                id="client-name"
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. DIME Fitness"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-division">Division</Label>
              <Input
                id="client-division"
                value={form.division ?? ""}
                onChange={(e) => setField("division", e.target.value)}
                placeholder="Engine / Products / Tech / Estates / Ventures"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-website">Website</Label>
            <Input
              id="client-website"
              value={form.website ?? ""}
              onChange={(e) => setField("website", e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-description">Description</Label>
            <Textarea
              id="client-description"
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={2}
            />
          </div>

          <Separator />

          {/* ── Social profiles ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Social Profiles</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setProfiles((list) => [...list, { ...EMPTY_PROFILE }])}
              >
                <Plus className="w-4 h-4 mr-1" /> Add profile
              </Button>
            </div>

            {profiles.map((profile, i) => (
              <div key={i} className="flex items-center gap-2">
                <PlatformIcon platform={profile.platform} className="w-5 h-5 flex-shrink-0" />
                <Select
                  value={profile.platform}
                  onValueChange={(v) => setProfile(i, { platform: v as SocialPlatform })}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile(i, { username: e.target.value })}
                  placeholder="username (without @)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 flex-shrink-0"
                  onClick={() => setProfiles((list) => list.filter((_, j) => j !== i))}
                  disabled={profiles.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Profile URLs are generated automatically from the username. Instagram,
              YouTube, TikTok, LinkedIn, and X are checked hourly for today&apos;s posts
              and stories (Instagram/TikTok).
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
