"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DirectorFormModal } from "@/components/director-form-modal"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"
import { toast } from "sonner"

interface Director {
  id: string
  name: string
  title: string
  category: 'national' | 'international'
  photo_url: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null)

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('directors')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setDirectors(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this director?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from('directors')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Failed to delete director")
    } else {
      toast.success("निदेशक सफलतापूर्वक हटाया गया")
      fetchDirectors()
    }
  }

  const handleEdit = (director: Director) => {
    setSelectedDirector(director)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedDirector(null)
    setModalOpen(true)
  }

  const filteredDirectors = directors.filter((director) => {
    const matchesSearch = 
      director.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      director.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || director.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">निदेशक प्रबंधन</h1>
          <p className="text-muted-foreground">राष्ट्रीय और अंतर्राष्ट्रीय निदेशकों का प्रबंधन करें</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          निदेशक जोड़ें
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="नाम या पद से खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सभी श्रेणियां</SelectItem>
            <SelectItem value="national">राष्ट्रीय</SelectItem>
            <SelectItem value="international">अंतर्राष्ट्रीय</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>फोटो</TableHead>
              <TableHead>नाम</TableHead>
              <TableHead>पद</TableHead>
              <TableHead>श्रेणी</TableHead>
              <TableHead>क्रम</TableHead>
              <TableHead>स्थिति</TableHead>
              <TableHead className="text-right">कार्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDirectors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    कोई निदेशक नहीं मिला
                  </TableCell>
                </TableRow>
              ) : (
                filteredDirectors.map((director) => (
                  <TableRow key={director.id}>
                    <TableCell>
                      {director.photo_url ? (
                        <img
                          src={director.photo_url}
                          alt={director.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-bold">
                            {director.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{director.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{director.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        director.category === 'national' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {director.category === 'national' ? 'राष्ट्रीय' : 'अंतर्राष्ट्रीय'}
                      </span>
                    </TableCell>
                    <TableCell>{director.display_order}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        director.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {director.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(director)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(director.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <DirectorFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        director={selectedDirector}
        onSuccess={fetchDirectors}
      />
    </div>
  )
}
