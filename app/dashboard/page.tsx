"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Calendar, Bell } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Loader2 } from "lucide-react"

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalEvents: 0
  })
  const [graphData, setGraphData] = useState<any[]>([])
  
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()
    
    // Fetch counts
    const { count: userCount, data: users } = await supabase.from("users").select("created_at", { count: 'exact' })
    const { count: memberCount } = await supabase.from("members").select("*", { count: 'exact', head: true })
    const { count: eventCount } = await supabase.from("events").select("*", { count: 'exact', head: true })

    setStats({
      totalUsers: userCount || 0,
      totalMembers: memberCount || 0,
      totalEvents: eventCount || 0
    })

    // Process graph data (group users by date)
    if (users) {
        const grouped = users.reduce((acc: any, user: any) => {
            const date = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {})
        
        // Convert to array and accumulate for "growth" line
        let runningTotal = 0
        const data = Object.keys(grouped).map(date => {
            runningTotal += grouped[date]
            return {
                date,
                users: runningTotal, // Cumulative
                new: grouped[date]   // Daily new
            }
        })
        
        // Take last 7-14 data points if too many, or show all
        setGraphData(data.slice(-30)) 
    }

    setLoading(false)
  }

  if (loading) {
     return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">अवलोकन (Overview)</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता (Total Users)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+ from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल सदस्य (Total Members)</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Verified profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय कार्यक्रम (Active Events)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>उपयोगकर्ता वृद्धि (User Growth)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }} // Hide date in tooltip list header, or keep it.
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                    name="Total Users"
                    animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
