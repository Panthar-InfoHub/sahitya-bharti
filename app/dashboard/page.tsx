"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, Calendar, ShoppingCart, ArrowRight, TrendingUp, IndianRupee, CheckCircle2, XCircle } from "lucide-react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { UserAnalyticsChart } from "@/components/user-analytics-chart"
import { UserPlanChart } from "@/components/user-plan-chart"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { format, subDays, subMonths, subYears, parseISO, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from "date-fns"

type TrendPeriod = "weekly" | "monthly" | "yearly"

interface RawTx {
  amount: number
  status: string
  type: string
  plan: string | null
  created_at: string
}

interface TransactionSummary {
  totalRevenue: number
  successCount: number
  failedCount: number
  pendingCount: number
  membershipRevenue: number
  donationRevenue: number
  eventRevenue: number
  allTransactions: RawTx[]
  byType: { name: string; value: number; color: string }[]
}

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("monthly")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalEvents: 0,
    totalTransactions: 0,
  })
  const [txSummary, setTxSummary] = useState<TransactionSummary>({
    totalRevenue: 0,
    successCount: 0,
    failedCount: 0,
    pendingCount: 0,
    membershipRevenue: 0,
    donationRevenue: 0,
    eventRevenue: 0,
    allTransactions: [],
    byType: [],
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()

    const [
      { count: userCount },
      { count: memberCount },
      { count: eventCount },
      { data: transactions },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("amount, status, type, plan, created_at").order("created_at", { ascending: true }),
    ])

    setStats({
      totalUsers: userCount || 0,
      totalMembers: memberCount || 0,
      totalEvents: eventCount || 0,
      totalTransactions: transactions?.length || 0,
    })

    if (transactions && transactions.length > 0) {
      const successTx = transactions.filter((t: any) => t.status === "success")
      const totalRevenue = successTx.reduce((s: number, t: any) => s + Number(t.amount), 0)
      const membershipRevenue = successTx.filter((t: any) => t.plan !== "donation" && t.type === "membership").reduce((s: number, t: any) => s + Number(t.amount), 0)
      const donationRevenue = successTx.filter((t: any) => t.plan === "donation").reduce((s: number, t: any) => s + Number(t.amount), 0)
      const eventRevenue = successTx.filter((t: any) => t.type === "event").reduce((s: number, t: any) => s + Number(t.amount), 0)

      const byType = [
        { name: "Membership", value: successTx.filter((t: any) => t.plan !== "donation" && t.type === "membership").length, color: "#6366f1" },
        { name: "Donation", value: successTx.filter((t: any) => t.plan === "donation").length, color: "#f59e0b" },
        { name: "Event", value: successTx.filter((t: any) => t.type === "event").length, color: "#10b981" },
      ]

      setTxSummary({
        totalRevenue,
        successCount: transactions.filter((t: any) => t.status === "success").length,
        failedCount: transactions.filter((t: any) => t.status === "failed").length,
        pendingCount: transactions.filter((t: any) => t.status === "pending").length,
        membershipRevenue,
        donationRevenue,
        eventRevenue,
        allTransactions: transactions as RawTx[],
        byType,
      })
    }

    setLoading(false)
  }

  // Build chart data dynamically based on trendPeriod
  const trendData = useMemo(() => {
    const txs = txSummary.allTransactions
    const now = new Date()

    if (trendPeriod === "weekly") {
      // Last 7 days, grouped by day
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(now, 6 - i)
        return { date: format(d, "EEE d"), key: format(d, "MMM d"), revenue: 0, count: 0 }
      })
      txs.forEach((t) => {
        const key = format(parseISO(t.created_at), "MMM d")
        const entry = days.find(d => d.key === key)
        if (entry && t.status === "success") {
          entry.revenue += Number(t.amount)
          entry.count += 1
        }
      })
      return days

    } else if (trendPeriod === "monthly") {
      // Last 30 days, grouped by day but labelled every 5 days
      const days = Array.from({ length: 30 }, (_, i) => {
        const d = subDays(now, 29 - i)
        return { date: format(d, "d MMM"), key: format(d, "MMM d"), revenue: 0, count: 0 }
      })
      txs.forEach((t) => {
        const key = format(parseISO(t.created_at), "MMM d")
        const entry = days.find(d => d.key === key)
        if (entry && t.status === "success") {
          entry.revenue += Number(t.amount)
          entry.count += 1
        }
      })
      // Only label every 5th item to avoid crowding
      return days.map((d, i) => ({ ...d, date: i % 5 === 0 ? d.date : "" }))

    } else {
      // yearly — group by month (last 12 months)
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = subMonths(now, 11 - i)
        return { date: format(d, "MMM yy"), key: format(d, "yyyy-MM"), revenue: 0, count: 0 }
      })
      txs.forEach((t) => {
        const key = format(parseISO(t.created_at), "yyyy-MM")
        const entry = months.find(d => d.key === key)
        if (entry && t.status === "success") {
          entry.revenue += Number(t.amount)
          entry.count += 1
        }
      })
      return months
    }
  }, [trendPeriod, txSummary.allTransactions])

  const periodLabel: Record<TrendPeriod, string> = {
    weekly: "last 7 days (daily)",
    monthly: "last 30 days (daily)",
    yearly: "last 12 months (monthly)",
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { label: "कुल उपयोगकर्ता", sub: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "कुल सदस्य", sub: "Total Members", value: stats.totalMembers, icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "सक्रिय कार्यक्रम", sub: "Events", value: stats.totalEvents, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "कुल लेन-देन", sub: "Transactions", value: stats.totalTransactions, icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "कुल राजस्व", sub: "Total Revenue", value: `₹${txSummary.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
  ]

  const PERIOD_BTNS: { key: TrendPeriod; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">अवलोकन</h1>
          <p className="text-muted-foreground mt-1">Dashboard Overview</p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
        >
          Transactions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {statCards.map((s) => (
          <Card key={s.label} className="border-none shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {s.label} <span className="opacity-60">· {s.sub}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction status pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> {txSummary.successCount} Successful
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <TrendingUp className="h-3.5 w-3.5" /> {txSummary.pendingCount} Pending
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
          <XCircle className="h-3.5 w-3.5" /> {txSummary.failedCount} Failed
        </div>
      </div>

      {/* Revenue Area Chart with period filter */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>राजस्व प्रवाह (Revenue Trend)</CardTitle>
              <CardDescription className="mt-1">
                Successful payments — <span className="font-medium text-foreground">{periodLabel[trendPeriod]}</span>
              </CardDescription>
            </div>
            {/* Period filter buttons */}
            <div className="flex rounded-lg border overflow-hidden text-xs font-semibold">
              {PERIOD_BTNS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTrendPeriod(key)}
                  className={`px-4 py-2 transition-colors cursor-pointer ${
                    trendPeriod === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v === 0 ? "0" : `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" dot={trendPeriod === "weekly"} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Transaction Count Bar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>लेन-देन संख्या (Daily Transactions)</CardTitle>
            <CardDescription>Number of successful transactions — {periodLabel[trendPeriod]}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v: any) => [v, "Transactions"]} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction by Type Pie */}
        <Card>
          <CardHeader>
            <CardTitle>प्रकार अनुसार</CardTitle>
            <CardDescription>By transaction type</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={txSummary.byType} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {txSummary.byType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any, name: any) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 w-full mt-2">
              {txSummary.byType.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                  </span>
                  <span className="font-semibold">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue breakdown + User Charts row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>राजस्व विभाजन</CardTitle>
            <CardDescription>Revenue by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {[
              { label: "Membership", value: txSummary.membershipRevenue, color: "bg-indigo-500", pct: txSummary.totalRevenue ? (txSummary.membershipRevenue / txSummary.totalRevenue) * 100 : 0 },
              { label: "Donations", value: txSummary.donationRevenue, color: "bg-amber-500", pct: txSummary.totalRevenue ? (txSummary.donationRevenue / txSummary.totalRevenue) * 100 : 0 },
              { label: "Events", value: txSummary.eventRevenue, color: "bg-emerald-500", pct: txSummary.totalRevenue ? (txSummary.eventRevenue / txSummary.totalRevenue) * 100 : 0 },
            ].map(({ label, value, color, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{label}</span>
                  <span className="font-bold">₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% of total</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Analytics */}
        <div className="md:col-span-2">
          <UserAnalyticsChart />
        </div>
      </div>

      {/* User Plan Chart + CTA row */}
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <UserPlanChart />
        </div>
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">विस्तृत रिपोर्ट</p>
              <h3 className="text-xl font-bold">सम्पूर्ण लेन-देन देखें</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Filter by date, status, plan type, search by user or payment ID, and export to CSV.
              </p>
            </div>
            <Link
              href="/dashboard/transactions"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
            >
              Transactions Page <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
