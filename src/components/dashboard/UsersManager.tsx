"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Trash2,
  ShieldCheck,
  Eye,
  UserCheck,
  Ban,
  Clock,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useApproveUserMutation,
  useSetUserActiveMutation,
  ManagedUser,
} from "@/store/api/usersApi";

// ─────────────────────────────────────────────────────────────────────────────
// Account management.
// Self-registered accounts arrive as PENDING — the super admin approves,
// blocks, or removes them. Approved viewers get read-only dashboard access.
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "" };

function accountState(user: ManagedUser): "Pending" | "Blocked" | "Active" {
  if (!user.isApproved) return "Pending";
  if (!user.isActive) return "Blocked";
  return "Active";
}

function StateBadge({ user }: { user: ManagedUser }) {
  const state = accountState(user);
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Blocked: "bg-red-100 text-red-700 border-red-200",
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }[state];
  const Icon = { Pending: Clock, Blocked: Ban, Active: UserCheck }[state];
  return (
    <Badge variant="outline" className={`gap-1 ${styles}`}>
      <Icon className="w-3 h-3" />
      {state}
    </Badge>
  );
}

export default function UsersManager() {
  const myId = useAppSelector((s) => s.auth.user?.id);

  const { data, isLoading } = useGetUsersQuery({});
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [approveUser] = useApproveUserMutation();
  const [setUserActive] = useSetUserActiveMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [removing, setRemoving] = useState<ManagedUser | null>(null);

  const users = data?.data ?? [];
  const pendingCount = users.filter((u) => !u.isApproved).length;

  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    if (!form.firstName || !form.email || !form.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    try {
      await createUser({ ...form, lastName: form.lastName || "-" }).unwrap();
      toast.success(`${form.firstName} added as Viewer`);
      setForm(EMPTY_FORM);
      setFormOpen(false);
    } catch (err) {
      const data =
        (err as { data?: { message?: string; errors?: Record<string, string> } })?.data;
      toast.error(
        data?.errors ? Object.values(data.errors)[0] : data?.message ?? "Could not create user"
      );
    }
  };

  const handleApprove = async (user: ManagedUser) => {
    try {
      await approveUser(user.id).unwrap();
      toast.success(`${user.firstName} approved — they can sign in now`);
    } catch {
      toast.error("Approve failed");
    }
  };

  const handleToggleBlock = async (user: ManagedUser) => {
    try {
      await setUserActive({ id: user.id, isActive: !user.isActive }).unwrap();
      toast.success(user.isActive ? `${user.firstName} blocked` : `${user.firstName} unblocked`);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!removing) return;
    try {
      await deleteUser(removing.id).unwrap();
      toast.success("User removed");
      setRemoving(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0
              ? `${pendingCount} account${pendingCount > 1 ? "s" : ""} waiting for approval`
              : "Approve, block, or remove dashboard accounts."}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add viewer
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : (
              users.map((user) => {
                const isAdmin = user.roles.some((r) => r.name === "admin");
                return (
                  <TableRow key={user.id} className="hover:bg-gray-50/70">
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                        {user.id === myId && (
                          <span className="ml-2 text-xs text-gray-400">(you)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 sm:hidden">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isAdmin
                            ? "gap-1 bg-blue-50 text-blue-700 border-blue-200"
                            : "gap-1 bg-gray-100 text-gray-600 border-gray-200"
                        }
                      >
                        {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {isAdmin ? "Admin" : "Viewer"}
                      </Badge>
                    </TableCell>
                    <TableCell><StateBadge user={user} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!user.isApproved && (
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleApprove(user)}
                          >
                            <UserCheck className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        )}
                        {user.isApproved && user.id !== myId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={user.isActive ? "Block" : "Unblock"}
                            className={user.isActive ? "text-orange-500 hover:text-orange-600" : "text-emerald-600 hover:text-emerald-700"}
                            onClick={() => handleToggleBlock(user)}
                          >
                            {user.isActive ? <Ban className="w-4 h-4" /> : <Undo2 className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Remove user"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => setRemoving(user)}
                          disabled={user.id === myId}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Add viewer modal ── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add viewer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="u-first">First name *</Label>
                <Input id="u-first" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-last">Last name</Label>
                <Input id="u-last" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-email">Email *</Label>
              <Input id="u-email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-pass">Password *</Label>
              <Input
                id="u-pass"
                type="text"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Min 8 chars, upper/lower/number/special"
              />
            </div>
            <p className="text-xs text-gray-500">
              Accounts you add here are approved immediately and get read-only
              (Viewer) access. People can also self-register at /register — those
              accounts wait for your approval.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Adding…" : "Add viewer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={removing !== null} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {removing?.firstName} {removing?.lastName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to the dashboard immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
