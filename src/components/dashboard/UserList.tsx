"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Phone, Mail, Briefcase, MapPin, Calendar,
  Search, Eye, Trash2, UserCheck, UserX,
} from "lucide-react";
import { toast } from "sonner";
import CustomPaginations from "../common/CustomPaginations";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profession: string;
  avatar: string;
  address: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

const NAMES = [
  "John Doe","Alex Carter","Mia Johnson","Liam Evans","Sarah Wilson",
  "David Brown","Emma Davis","Michael Miller","Olivia Garcia","James Rodriguez",
  "Sophia Martinez","Benjamin Anderson","Isabella Taylor","Lucas Thomas","Charlotte Jackson",
];
const PROFESSIONS = [
  "Student","Businessman","Job Holder","Teacher","Doctor",
  "Marketer","Professor","Engineer","Designer","Developer",
];

const generateUsers = (): User[] =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `user${i + 1}@example.com`,
    phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    profession: PROFESSIONS[i % PROFESSIONS.length],
    avatar: `/placeholder.svg?height=40&width=40`,
    address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    status: Math.random() > 0.2 ? "Active" : "Inactive",
  }));

const ITEMS_PER_PAGE = 10;

export default function UserList() {
  const [allUsers]       = useState<User[]>(generateUsers);
  const [search,  setSearch]        = useState("");
  const [page,    setPage]          = useState(1);
  const [selected, setSelected]     = useState<User | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);

  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex  = (page - 1) * ITEMS_PER_PAGE;
  const currentRows = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleView = (u: User) => { setSelected(u); setModalOpen(true); };
  const handleDelete = (u: User) => {
    toast.error(`${u.name} deleted.`, { description: "This action cannot be undone." });
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} total users</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm border-gray-200 focus-visible:ring-brand/30"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Profession</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/70 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-brand/10 text-brand text-xs font-semibold">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{user.email}</TableCell>
                <TableCell className="text-gray-500 text-sm hidden lg:table-cell">{user.phone}</TableCell>
                <TableCell className="text-gray-500 text-sm hidden xl:table-cell">{user.profession}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-100 text-xs"
                        : "bg-gray-100 text-gray-500 border-gray-200 text-xs"
                    }
                  >
                    {user.status === "Active"
                      ? <UserCheck className="w-3 h-3 mr-1 inline" />
                      : <UserX    className="w-3 h-3 mr-1 inline" />}
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(user)}
                      className="h-8 px-3 text-xs border-gray-200 text-gray-600 hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 cursor-pointer gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user)}
                      className="h-8 px-3 text-xs border-gray-200 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 cursor-pointer gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentRows.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No users match your search</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {currentRows.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-11 w-11 flex-shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-brand/10 text-brand text-sm font-semibold">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Badge
                variant="outline"
                className={
                  user.status === "Active"
                    ? "bg-green-50 text-green-700 border-green-100 text-xs flex-shrink-0"
                    : "bg-gray-100 text-gray-500 border-gray-200 text-xs flex-shrink-0"
                }
              >
                {user.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-400 space-y-1 mb-3">
              <p>{user.phone}</p>
              <p>{user.profession}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleView(user)}
                className="flex-1 h-8 text-xs border-gray-200 text-gray-600 hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 cursor-pointer gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(user)}
                className="flex-1 h-8 text-xs border-gray-200 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 cursor-pointer gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPaginations
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
          startIndex={startIndex}
          onPageChange={setPage}
        />
      )}

      {/* User Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">User details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-brand/20">
                  <AvatarImage src={selected.avatar} alt={selected.name} />
                  <AvatarFallback className="bg-brand/10 text-brand text-xl font-bold">
                    {initials(selected.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-gray-900">{selected.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      selected.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-100 mt-1 text-xs"
                        : "bg-gray-100 text-gray-500 border-gray-200 mt-1 text-xs"
                    }
                  >
                    {selected.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  { icon: Mail,      label: "Email",      value: selected.email      },
                  { icon: Phone,     label: "Phone",      value: selected.phone      },
                  { icon: Briefcase, label: "Profession", value: selected.profession },
                  { icon: MapPin,    label: "Address",    value: selected.address    },
                  { icon: Calendar,  label: "Joined",     value: selected.joinDate   },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">{label}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
