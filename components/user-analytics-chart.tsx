"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { format, subDays, startOfDay } from "date-fns"

const chartConfig = {
  users: {
    label: "Users",
    color: "oklch(0.45 0.19 15)",
  },
} satisfies ChartConfig

type TimeRange = "day" | "week" | "month" | "year"

export function UserAnalyticsChart() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("week")
  const [allUsers, setAllUsers] = React.useState<any[]>([])
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({ day: 0, week: 0, month: 0, year: 0 })

  React.useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const supabase = createClient()
      
      const now = new Date()
      const oneYearAgo = subDays(now, 365)

      const { data: users } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', oneYearAgo.toISOString())
        .order('created_at', { ascending: true })

      if (users) {
        setAllUsers(users)
        
        // Calculate standard counts
        const dayAgo = subDays(now, 1)
        const weekAgo = subDays(now, 7)
        const monthAgo = subDays(now, 30)
        const yearAgo = subDays(now, 365)

        const dayCount = users.filter(u => new Date(u.created_at) >= dayAgo).length
        const weekCount = users.filter(u => new Date(u.created_at) >= weekAgo).length
        const monthCount = users.filter(u => new Date(u.created_at) >= monthAgo).length
        const yearCount = users.filter(u => new Date(u.created_at) >= yearAgo).length

        setStats({
          day: dayCount,
          week: weekCount,
          month: monthCount,
          year: yearCount
        })
      }
      setLoading(false)
    }

    fetchUserData()
  }, [])

  React.useEffect(() => {
    if (allUsers.length > 0) {
      const now = new Date()
      let startDate: Date
      
      switch (timeRange) {
        case "day":
          startDate = subDays(now, 7)
          break
        case "week":
          startDate = subDays(now, 30)
          break
        case "month":
          startDate = subDays(now, 180)
          break
        case "year":
          startDate = subDays(now, 365)
          break
        default:
          startDate = subDays(now, 30)
      }

      const filteredUsers = allUsers.filter(u => new Date(u.created_at) >= startDate)
      
      const grouped: Record<string, number> = {}
      filteredUsers.forEach(user => {
        const d = new Date(user.created_at)
        let key: string
        
        switch (timeRange) {
          case "day":
            key = d.toISOString().split('T')[0]
            break
          case "week":
            const weekStart = new Date(d)
            weekStart.setDate(d.getDate() - d.getDay())
            key = weekStart.toISOString().split('T')[0]
            break
          case "month":
          case "year":
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
            break
          default:
            key = d.toISOString().split('T')[0]
        }
        
        grouped[key] = (grouped[key] || 0) + 1
      })

      const formattedData = Object.entries(grouped)
        .map(([date, count]) => ({ date, users: count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        
      setChartData(formattedData)
    }
  }, [allUsers, timeRange])

  const formatXAxisTick = (value: string) => {
    const d = new Date(value)
    switch (timeRange) {
      case "day":
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "week":
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "month":
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      case "year":
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      default:
        return value
    }
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New user registrations over time</CardDescription>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { key: "day", label: "Daily" },
            { key: "week", label: "Weekly" },
            { key: "month", label: "Monthly" },
            { key: "year", label: "Yearly" }
          ].map((option) => (
            <button
              key={option.key}
              data-active={timeRange === option.key}
              className="data-[active=true]:bg-muted/50 flex flex-1 min-w-[110px] flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setTimeRange(option.key as TimeRange)}
            >
              <span className="text-muted-foreground text-xs">{option.label}</span>
              <span className="text-lg leading-none font-bold sm:text-2xl whitespace-nowrap">
                {loading ? "..." : (stats as any)[option.key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatXAxisTick}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="users"
                    labelFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Line
                dataKey="users"
                type="monotone"
                stroke="var(--color-users)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
