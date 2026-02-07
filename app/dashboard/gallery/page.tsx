"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Upload, Copy, Info, Image as ImageIcon, Filter } from "lucide-react"
import { toast } from "sonner"
import NextImage from "next/image"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Available tags for categorizing images
const AVAILABLE_TAGS = [
  { value: 'carousel', label: 'Carousel (Home Page)' },
  { value: 'gallery', label: 'Gallery Page' },
  { value: 'featured', label: 'Featured' },
]

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>(['gallery'])
  const [filterTag, setFilterTag] = useState<string>('all')
  const [showDimensionWarning, setShowDimensionWarning] = useState(false)
  const [dimensionWarningMessage, setDimensionWarningMessage] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async (tag?: string) => {
    const supabase = createClient()
    let query = supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })
    
    // Filter by tag if specified
    if (tag && tag !== 'all') {
      query = query.contains('tags', [tag])
    }

    const { data, error } = await query

    if (error) {
      toast.error("Failed to load gallery")
    } else {
        setImages(data || [])
    }
    setLoading(false)
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("file") as File
    
    if (!file || file.size === 0) return

    setUploading(true)
    try {
      // Validate image dimensions based on tags
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      
      const dimensionCheck = await new Promise<{proceed: boolean, message: string | null}>((resolve) => {
        img.onload = () => {
          const width = img.width
          const height = img.height
          
          // Check dimensions based on selected tags
          const hasCarousel = selectedTags.includes('carousel')
          const hasGallery = selectedTags.includes('gallery')
          
          let warningMessage = null
          
          if (hasCarousel && !hasGallery) {
            // Carousel images should be around 5317x3543 (portrait, ~1.5:1 ratio)
            const expectedRatio = 5317 / 3543
            const actualRatio = height / width
            const tolerance = 0.2 // 20% tolerance
            
            if (Math.abs(actualRatio - expectedRatio) > tolerance) {
              warningMessage = `कैरोसेल छवियां लगभग 5317x3543px (पोर्ट्रेट) होनी चाहिए। आपकी छवि ${width}x${height}px है।`
            }
          } else if (hasGallery && !hasCarousel) {
            // Gallery images should be around 1736x3528 (landscape, ~1:2 ratio)
            const expectedRatio = 1736 / 3528
            const actualRatio = height / width
            const tolerance = 0.2 // 20% tolerance
            
            if (Math.abs(actualRatio - expectedRatio) > tolerance) {
              warningMessage = `गैलरी छवियां लगभग 1736x3528px (लैंडस्केप) होनी चाहिए। आपकी छवि ${width}x${height}px है।`
            }
          }
          
          URL.revokeObjectURL(imageUrl)
          resolve({ proceed: !warningMessage, message: warningMessage })
        }
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl)
          toast.error("छवि लोड करने में विफल")
          resolve({ proceed: false, message: null })
        }
        
        img.src = imageUrl
      })

      if (!dimensionCheck.proceed && dimensionCheck.message) {
        // Show warning modal
        setPendingFile(file)
        setDimensionWarningMessage(dimensionCheck.message)
        setShowDimensionWarning(true)
        setUploading(false)
        return
      }

      // Proceed with upload
      await performUpload(file)
    } catch (error: any) {
      toast.error(error.message || "Upload failed")
      setUploading(false)
    }
  }

  const performUpload = async (file: File) => {
    try {
      setUploading(true)
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `gallery-${Date.now()}.${fileExt}`

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Get URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)

      // 3. Save to DB
      const { error: dbError } = await supabase
        .from("gallery_images")
        .insert({
            image_url: publicUrl,
            caption: caption,
            tags: selectedTags
        })

      if (dbError) throw dbError

      toast.success("Image added to gallery")
      setCaption("")
      setSelectedTags(['gallery'])
      fetchImages(filterTag)
    } catch (error: any) {
      toast.error(error.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleConfirmUpload = async () => {
    if (pendingFile) {
      setShowDimensionWarning(false)
      await performUpload(pendingFile)
      setPendingFile(null)
    }
  }

  const handleCancelUpload = () => {
    setShowDimensionWarning(false)
    setPendingFile(null)
    setUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return

    const supabase = createClient()
    const { error } = await supabase.from("gallery_images").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete")
    } else {
      toast.success("Deleted successfully")
      fetchImages(filterTag)
    }
  }

  const copyToClipboard = (url: string) => {
      navigator.clipboard.writeText(url)
      toast.success("Link copied!")
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleFilterChange = (value: string) => {
    setFilterTag(value)
    setLoading(true)
    fetchImages(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">गैलरी प्रबंधन (Gallery Manager)</h1>
           <p className="text-muted-foreground">Add images with captions for the website gallery.</p>
        </div>
      </div>

      <Card>
          <CardContent className="p-4">
              <form onSubmit={handleUpload} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Image</Label>
                        <Input id="picture" name="file" type="file" accept="image/*" required disabled={uploading} />
                      </div>
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="caption">Caption</Label>
                        <Input 
                            id="caption" 
                            value={caption} 
                            onChange={(e) => setCaption(e.target.value)} 
                            placeholder="Enter image caption..." 
                            disabled={uploading}
                        />
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags (Select where to display this image)</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map(tag => (
                        <div key={tag.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={tag.value}
                            checked={selectedTags.includes(tag.value)}
                            onCheckedChange={() => toggleTag(tag.value)}
                            disabled={uploading}
                          />
                          <label
                            htmlFor={tag.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {tag.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedTags.length === 0 && (
                      <p className="text-sm text-red-500">Please select at least one tag</p>
                    )}
                  </div>

                  <Button type="submit" disabled={uploading || selectedTags.length === 0}>
                      {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Upload
                  </Button>
              </form>
          </CardContent>
      </Card>

      {/* Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label>Filter by Tag:</Label>
            <Select value={filterTag} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                {AVAILABLE_TAGS.map(tag => (
                  <SelectItem key={tag.value} value={tag.value}>{tag.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group relative">
                    <div className="aspect-square relative bg-slate-100">
                        <NextImage
                            src={image.image_url}
                            alt={image.caption || "Gallery Image"}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                         {/* Overlay actions */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-white hover:bg-white/20"
                                onClick={() => copyToClipboard(image.image_url)}
                                title="Copy URL"
                                type="button"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-400 hover:bg-white/20 hover:text-red-500"
                                onClick={() => handleDelete(image.id)}
                                title="Delete"
                                type="button"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardContent className="p-2 bg-white space-y-1">
                        {image.caption && (
                            <p className="text-xs font-medium truncate" title={image.caption}>
                                {image.caption}
                            </p>
                        )}
                        {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {image.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {AVAILABLE_TAGS.find(t => t.value === tag)?.label || tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            {images.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 opacity-20 mb-2" />
                    <p>No gallery images yet</p>
                </div>
            )}
        </div>
      )}

      {/* Dimension Warning Modal */}
      <AlertDialog open={showDimensionWarning} onOpenChange={setShowDimensionWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-600">⚠️ चेतावनी (Warning)</AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-2">
              <p>{dimensionWarningMessage}</p>
              <p className="text-sm text-muted-foreground mt-4">
                क्या आप फिर भी अपलोड करना चाहते हैं?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpload}>
              रद्द करें (Cancel)
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpload} className="bg-orange-600 hover:bg-orange-700">
              हाँ, अपलोड करें (Yes, Upload)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
