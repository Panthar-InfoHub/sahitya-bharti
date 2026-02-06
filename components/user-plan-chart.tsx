"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  users: {
    label: "Users",
  },
  premium: {
    label: "Premium",
    color: "oklch(0.45 0.19 15)",
  },
  free: {
    label: "Free",
    color: "oklch(0.52 0.17 30)",
  },
} satisfies ChartConfig

export function UserPlanChart() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [percentageChange, setPercentageChange] = React.useState(0)

  React.useEffect(() => {
    fetchUserPlanData()
  }, [])

  const fetchUserPlanData = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Fetch all users
    const { data: users } = await supabase
      .from('users')
      .select('plan')

    if (users) {
      // Count premium and free users
      const premiumCount = users.filter(u => u.plan === 'premium').length
      const freeCount = users.filter(u => u.plan !== 'premium').length
      const total = users.length

      setChartData([
        { 
          plan: "premium", 
          users: premiumCount, 
          fill: "var(--color-premium)" 
        },
        { 
          plan: "free", 
          users: freeCount, 
          fill: "var(--color-free)" 
        },
      ])

      // Calculate percentage of premium users
      if (total > 0) {
        setPercentageChange(Math.round((premiumCount / total) * 100))
      }
    }
    
    setLoading(false)
  }

  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.users, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Plans Distribution</CardTitle>
        <CardDescription>Premium vs Free Users</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : totalUsers === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No users yet</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie 
                data={chartData} 
                dataKey="users" 
                label 
                nameKey="plan"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {percentageChange}% Premium Users <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total: {totalUsers.toLocaleString()} users
        </div>
      </CardFooter>
    </Card>
  )
}
