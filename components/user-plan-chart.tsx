"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
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

export function UserPlanChart() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({ users: { label: "Users" } })
  const [loading, setLoading] = React.useState(true)
  const [mainPlanPercentage, setMainPlanPercentage] = React.useState({ plan: 'Paid', percent: 0 })

  React.useEffect(() => {
    fetchUserPlanData()
  }, [])

  const fetchUserPlanData = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Fetch all users and plans
    const { data: plans } = await supabase.from('membership_plans').select('*');
    const { data: users } = await supabase.from('users').select('plan');

    if (users) {
      const activePlans = plans || [];
      
      const newChartData: any[] = [];
      const newConfig: ChartConfig = { users: { label: "Users" } };
      
      let paidCount = 0;

      activePlans.forEach((plan, index) => {
        // Create an alphanumeric key for the chart config 
        const key = plan.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `plan${index}`;
        const count = users.filter(u => u.plan?.trim().toLowerCase() === plan.name.trim().toLowerCase()).length;
        
        // Add to data even if 0, or maybe filter out 0 later?
        // It's nice to see all plans
        newChartData.push({
          plan: key,
          users: count,
          fill: `var(--color-${key})`
        });
        
        newConfig[key] = {
          label: plan.name,
          color: `hsl(var(--chart-${(index % 5) + 1}))`
        };
        
        paidCount += count;
      });

      // Anyone whose plan doesn't directly match an active tier (or is null/free)
      const freeCount = users.filter(u => {
        const userPlan = u.plan?.trim().toLowerCase() || '';
        return !activePlans.some(p => p.name.trim().toLowerCase() === userPlan) || userPlan === 'free' || !userPlan;
      }).length;

      newChartData.push({
        plan: "free",
        users: freeCount,
        fill: "var(--color-free)"
      });
      
      newConfig["free"] = {
        label: "Free / No Plan",
        color: "hsl(var(--muted-foreground))" // fallback gray
      };

      // Only show non-zero in the chart for cleanliness
      const cleanData = newChartData.filter(d => d.users > 0);

      setChartData(cleanData);
      setChartConfig(newConfig);

      const total = users.length
      if (total > 0) {
        setMainPlanPercentage({ 
            plan: 'Paid', 
            percent: Math.round((paidCount / total) * 100) 
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
            <p className="text-muted-foreground animate-pulse">Loading Chart Data...</p>
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
                nameKey="plan" // Maps to the key in chartConfig
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-4">
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
