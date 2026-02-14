import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Mail, Phone, Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default async function ContactsPage(props: {
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch contacts with search and sort
  let query = supabase
    .from("contacts")
    .select("*")
  
  // Search filter
  if (searchParams.q) {
    const searchTerm = `%${searchParams.q}%`
    query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},subject.ilike.${searchTerm}`)
  }

  // Sort
  if (searchParams.sort === "oldest") {
    query = query.order("created_at", { ascending: true })
  } else {
    query = query.order("created_at", { ascending: false }) // Default: Latest
  }

  const { data: contacts, error } = await query

  if (error) {
    console.error("Error fetching contacts:", error)
    return <div>Failed to load contacts</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">संपर्क अनुरोध (Contact Requests)</h1>
          <p className="text-muted-foreground">
            Manage messages and inquiries from users.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>संदेश सूची (Message List)</CardTitle>
          <CardDescription>
            कुल {contacts?.length || 0} संपर्क अनुरोध
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <form>
                 <Input
                  name="q"
                  type="search"
                  placeholder="खोजें (Search by Name, Email, Subject)..."
                  className="pl-8"
                  defaultValue={searchParams.q}
                />
              </form>
            </div>
            <div className="w-full md:w-[200px]">
               <form>
                  <Select name="sort" defaultValue={searchParams.sort || "latest"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">नवीनतम (Latest)</SelectItem>
                      <SelectItem value="oldest">पुराना (Oldest)</SelectItem>
                    </SelectContent>
                  </Select>
               </form>
            </div>
          </div>

          <div className="space-y-4">
            {contacts?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    कोई संपर्क अनुरोध नहीं (No requests found)
                </div>
            ) : (
                contacts?.map((contact) => (
                <div
                    key={contact.id}
                    className="flex flex-col md:flex-row items-start justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-4"
                >
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                             <h4 className="font-semibold text-lg">{contact.name}</h4>
                             <Badge variant="outline" className="text-xs font-normal">
                                {new Date(contact.created_at).toLocaleDateString("hi-IN")}
                             </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {contact.email}
                            </span>
                        </div>
                        <h5 className="font-medium text-slate-800 mt-2">{contact.subject}</h5>
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
                            {contact.message}
                        </p>
                    </div>
                </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
