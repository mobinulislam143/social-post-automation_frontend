"use client";

import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { ChartBarDefault } from "@/components/dashboard/ChartBarDefault";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Static demo data ─────────────────────────────────────────────────────────

const stats = [
  {
    title: "Total Revenue",
    value: "$48,295",
    icon: DollarSign,
    change: 12.5,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Active Users",
    value: "5,056",
    icon: Users,
    change: 8.2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Transactions",
    value: "1,284",
    icon: Activity,
    change: -3.1,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Growth Rate",
    value: "24.8%",
    icon: TrendingUp,
    change: 5.7,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const transactions = [
  { id: "TXN-1001", user: "Ariana M.", amount: 1500, status: "Completed", date: "Jul 12, 2025" },
  { id: "TXN-1002", user: "James K.", amount: -49.99, status: "Completed", date: "Jul 11, 2025" },
  { id: "TXN-1003", user: "Priya L.", amount: 250, status: "Pending", date: "Jul 11, 2025" },
  { id: "TXN-1004", user: "Daniel R.", amount: -150, status: "Refunded", date: "Jul 10, 2025" },
  { id: "TXN-1005", user: "Sofia T.", amount: 1100, status: "Completed", date: "Jul 09, 2025" },
  { id: "TXN-1006", user: "Marcus W.", amount: -99.99, status: "Failed", date: "Jul 08, 2025" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  Completed: { label: "Completed", class: "bg-green-50 text-green-700 border-green-100" },
  Pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-100" },
  Failed: { label: "Failed", class: "bg-red-50 text-red-600 border-red-100" },
  Refunded: { label: "Refunded", class: "bg-gray-100 text-gray-600 border-gray-200" },
};

const topUsers = [
  { name: "Ariana M.", email: "ariana@example.com", revenue: "$4,200", trend: "+18%" },
  { name: "James K.", email: "james@example.com", revenue: "$3,840", trend: "+12%" },
  { name: "Priya L.", email: "priya@example.com", revenue: "$3,120", trend: "+9%" },
  { name: "Daniel R.", email: "daniel@example.com", revenue: "$2,760", trend: "+6%" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <DashboardStatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Chart + Top Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartBarDefault />
        </div>

        {/* Top Users */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Top Users
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 gap-1 hover:text-brand">
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {topUsers.map((u, i) => (
              <div
                key={u.email}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-brand">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{u.revenue}</p>
                  <p className="text-xs text-green-600">{u.trend}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Recent Transactions
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">
                    Transaction
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 px-6 py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const cfg = statusConfig[tx.status];
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                        {tx.id}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-gray-800">
                        {tx.user}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{tx.date}</td>
                      <td className="px-6 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-medium border", cfg.class)}
                        >
                          {cfg.label}
                        </Badge>
                      </td>
                      <td
                        className={cn(
                          "px-6 py-3.5 text-right font-semibold",
                          tx.amount >= 0 ? "text-gray-900" : "text-red-500"
                        )}
                      >
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
