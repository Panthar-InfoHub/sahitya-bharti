"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrusteeFormModal, type Trustee } from "@/components/trustee-form-modal"
import { Plus, Pencil, Trash2, Loader2, Search, Download } from "lucide-react"
import { saveAs } from "file-saver"
import { toast } from "sonner"

export default function TrusteesPage() {
  const [trustees, setTrustees] = useState<Trustee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTrustee, setSelectedTrustee] = useState<Trustee | null>(null)

  useEffect(() => {
    fetchTrustees()
  }, [])

  const fetchTrustees = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('trustees')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setTrustees(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trustee?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from('trustees')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Failed to delete trustee")
    } else {
      toast.success("ट्रस्टी सफलतापूर्वक हटाया गया")
      fetchTrustees()
    }
  }

  const handleDownloadCSV = () => {
    if (trustees.length === 0) {
        toast.error("No trustees to download")
        return
    }

    const headers = ["Name", "Type", "Description", "Email", "Phone", "Address", "Display Order", "Is Active"]
    const csvData = trustees.map(t => {
        return [
            `"${t.name || ""}"`,
            `"${t.type || ""}"`,
            `"${t.description ? t.description.replace(/"/g, '""') : ""}"`,
            `"${t.email || ""}"`,
            `"${t.phone || ""}"`,
            `"${t.address ? t.address.replace(/"/g, '""') : ""}"`,
            `"${t.display_order}"`,
            `"${t.is_active}"`
        ].join(",")
    })

    const csvContent = "\uFEFF" + [headers.join(","), ...csvData].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `trustees_export_${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleEdit = (trustee: Trustee) => {
    setSelectedTrustee(trustee)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedTrustee(null)
    setModalOpen(true)
  }

  const filteredTrustees = trustees.filter((trustee) => {
    const matchesSearch =
      trustee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trustee.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || trustee.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ट्रस्टी प्रबंधन (Trustees)</h1>
          <p className="text-muted-foreground">राष्ट्रीय और अंतर्राष्ट्रीय ट्रस्टियों का प्रबंधन करें</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCSV} disabled={trustees.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              ट्रस्टी जोड़ें
            </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="नाम या विवरण से खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
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
                <TableHead>ईमेल / फोन</TableHead>
                <TableHead>श्रेणी</TableHead>
                <TableHead>क्रम</TableHead>
                <TableHead>स्थिति</TableHead>
                <TableHead className="text-right">कार्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrustees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    कोई ट्रस्टी नहीं मिला
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrustees.map((trustee) => (
                  <TableRow key={trustee.id}>
                    <TableCell>
                      {trustee.photo_url ? (
                        <img
                          src={trustee.photo_url}
                          alt={trustee.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {trustee.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{trustee.name}</p>
                        {trustee.address && <p className="text-xs text-muted-foreground">{trustee.address}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {trustee.email && <p>{trustee.email}</p>}
                        {trustee.phone && <p>{trustee.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trustee.type === 'national'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                        }`}>
                        {trustee.type === 'national' ? 'राष्ट्रीय' : 'अंतर्राष्ट्रीय'}
                      </span>
                    </TableCell>
                    <TableCell>{trustee.display_order}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trustee.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {trustee.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(trustee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(trustee.id!)}
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
      <TrusteeFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        trustee={selectedTrustee}
        onSuccess={fetchTrustees}
      />
    </div>
  )
}
