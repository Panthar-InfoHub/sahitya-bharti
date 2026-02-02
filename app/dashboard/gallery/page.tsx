"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Upload, Copy, Info, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState("")

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })

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
            caption: caption
        })

      if (dbError) throw dbError

      toast.success("Image added to gallery")
      setCaption("")
      // Reset file input by form reset
      e.currentTarget.reset()
      fetchImages()
    } catch (error: any) {
      toast.error(error.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return

    const supabase = createClient()
    const { error } = await supabase.from("gallery_images").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete")
    } else {
      toast.success("Deleted successfully")
      setImages(images.filter(img => img.id !== id))
    }
  }

  const copyToClipboard = (url: string) => {
      navigator.clipboard.writeText(url)
      toast.success("Link copied!")
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
              <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
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
                  <Button type="submit" disabled={uploading}>
                      {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Upload
                  </Button>
              </form>
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
                        <Image
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
                    {image.caption && (
                        <CardContent className="p-2 bg-white">
                            <p className="text-xs font-medium truncate" title={image.caption}>
                                {image.caption}
                            </p>
                        </CardContent>
                    )}
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
    </div>
  )
}
