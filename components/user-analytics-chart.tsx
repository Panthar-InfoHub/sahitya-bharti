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

const chartConfig = {
  users: {
    label: "Users",
    color: "oklch(0.45 0.19 15)",
  },
} satisfies ChartConfig

type TimeRange = "day" | "week" | "month"

export function UserAnalyticsChart() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("week")
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [totalUsers, setTotalUsers] = React.useState(0)

  React.useEffect(() => {
    fetchUserData()
  }, [timeRange])

  const fetchUserData = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Calculate date range based on selected time range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 7) // Last 7 days
        break
      case "week":
        startDate.setDate(now.getDate() - 30) // Last 30 days (4 weeks)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 6) // Last 6 months
        break
    }

    // Fetch users created within the date range
    const { data: users } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (users) {
      // Group users by time period
      const grouped = groupUsersByTimePeriod(users, timeRange)
      setChartData(grouped)
      setTotalUsers(users.length)
    }
    
    setLoading(false)
  }

  const groupUsersByTimePeriod = (users: any[], range: TimeRange) => {
    const grouped: Record<string, number> = {}
    
    users.forEach(user => {
      const date = new Date(user.created_at)
      let key: string
      
      switch (range) {
        case "day":
          // Group by day
          key = date.toISOString().split('T')[0]
          break
        case "week":
          // Group by week (start of week)
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split('T')[0]
          break
        case "month":
          // Group by month
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
          break
        default:
          key = date.toISOString().split('T')[0]
      }
      
      grouped[key] = (grouped[key] || 0) + 1
    })

    // Convert to array and sort
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, users: count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const formatXAxisTick = (value: string) => {
    const date = new Date(value)
    switch (timeRange) {
      case "day":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "week":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "month":
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      default:
        return value
    }
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>User Growth</CardTitle>
          <CardDescription>
            New user registrations over time
          </CardDescription>
        </div>
        <div className="flex">
          {[
            { key: "day", label: "Daily" },
            { key: "week", label: "Weekly" },
            { key: "month", label: "Monthly" }
          ].map((option) => (
            <button
              key={option.key}
              data-active={timeRange === option.key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setTimeRange(option.key as TimeRange)}
            >
              <span className="text-muted-foreground text-xs">
                {option.label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {loading ? "..." : totalUsers.toLocaleString()}
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
