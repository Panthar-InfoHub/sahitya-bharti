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
  patron: {
    label: "Patron",
    color: "var(--chart-1)",
  },
  premium: {
    label: "Premium",
    color: "var(--chart-2)",
  },
  standard: {
    label: "Standard",
    color: "var(--chart-3)",
  },
  free: {
    label: "Free",
    color: "var(--chart-5)", // Using chart-5 for distinct color (chart-4 is muted brown)
  },
} satisfies ChartConfig

export function UserPlanChart() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [mainPlanPercentage, setMainPlanPercentage] = React.useState({ plan: 'Premium', percent: 0 })

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
      const patronCount = users.filter(u => u.plan?.toLowerCase() === 'patron').length
      const premiumCount = users.filter(u => u.plan?.toLowerCase() === 'premium').length
      const standardCount = users.filter(u => u.plan?.toLowerCase() === 'standard').length
      
      // Free is anyone not in the above (assuming nullable or empty or 'free')
      // Safe to say anyone NOT normalized to these 3 is free
      const freeCount = users.filter(u => !['patron', 'premium', 'standard'].includes(u.plan?.toLowerCase())).length
      
      const total = users.length

      setChartData([
        { plan: "patron", users: patronCount, fill: "var(--color-patron)" },
        { plan: "premium", users: premiumCount, fill: "var(--color-premium)" },
        { plan: "standard", users: standardCount, fill: "var(--color-standard)" },
        { plan: "free", users: freeCount, fill: "var(--color-free)" },
      ])

      // Calculate percentage of most popular paid plan or just display Total Paid vs Free?
      // Let's just show Premium % for consistency or Total Paid %
      const totalPaid = patronCount + premiumCount + standardCount
      if (total > 0) {
        setMainPlanPercentage({ 
            plan: 'Paid', 
            percent: Math.round((totalPaid / total) * 100) 
        })
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
        <CardDescription>Membership Tiers</CardDescription>
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
          {mainPlanPercentage.percent}% Paid Members <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total: {totalUsers.toLocaleString()} users
        </div>
      </CardFooter>
    </Card>
  )
}
