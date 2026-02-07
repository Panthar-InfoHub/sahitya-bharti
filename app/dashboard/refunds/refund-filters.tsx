"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react" 
// Assuming a debounce hook exists, if not I'll implement a simple timeout or create the hook.
// I'll check for hooks first. For now I'll implement simple effect.

export function RefundFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "desc")

  // Update URL function
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  // Manual search update
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
        params.set("search", search)
    } else {
        params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        handleSearch()
    }
  }

  const handleSortChange = (value: string) => {
      setSort(value)
      router.push("?" + createQueryString("sort", value))
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
      <div className="flex flex-1 items-center gap-2 w-full max-w-sm">
        <Input 
            placeholder="Search by User Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
        />
        <Button size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-[180px]">
        <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger>
                <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="desc">Date: Newest First</SelectItem>
                <SelectItem value="asc">Date: Oldest First</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  )
}
