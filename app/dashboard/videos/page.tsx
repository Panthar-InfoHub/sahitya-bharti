"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Plus, Video, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function VideoManagerPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ url: "", title: "" })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("video_gallery")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Failed to load videos")
    } else {
        setVideos(data || [])
    }
    setLoading(false)
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.url) return

    const videoId = getYoutubeId(formData.url)
    if (!videoId) {
        toast.error("Invalid YouTube URL")
        return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("video_gallery")
        .insert({
            video_url: formData.url,
            title: formData.title
        })

      if (error) throw error

      toast.success("Video added successfully")
      setFormData({ url: "", title: "" })
      fetchVideos()
    } catch (error: any) {
      toast.error(error.message || "Failed to add video")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    const supabase = createClient()
    const { error } = await supabase.from("video_gallery").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete video")
    } else {
      toast.success("Video deleted")
      setVideos(videos.filter(v => v.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">वीडियो प्रबंधन (Video Manager)</h1>
           <p className="text-muted-foreground">Manage YouTube videos for the gallery section.</p>
        </div>
      </div>

      <Card>
          <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="url">YouTube URL</Label>
                    <Input 
                        id="url" 
                        value={formData.url} 
                        onChange={(e) => setFormData({...formData, url: e.target.value})} 
                        placeholder="e.g. https://youtube.com/watch?v=..." 
                        required
                        disabled={uploading}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input 
                        id="title" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        placeholder="Video Title" 
                        disabled={uploading}
                    />
                  </div>
                  <Button type="submit" disabled={uploading}>
                      {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Add Video
                  </Button>
              </form>
          </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
                const videoId = getYoutubeId(video.video_url)
                return (
                    <Card key={video.id} className="overflow-hidden group">
                        <div className="aspect-video relative bg-slate-100">
                           {videoId ? (
                               <Image
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={video.title || "Video thumbnail"}
                                fill
                                className="object-cover"
                                unoptimized
                               />
                           ) : (
                               <div className="flex items-center justify-center h-full">
                                   <Video className="h-10 w-10 text-muted-foreground" />
                               </div>
                           )}
                           
                            {/* Overlay actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <a 
                                    href={video.video_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 bg-white rounded-full hover:bg-slate-200 transition-colors"
                                    title="Open on YouTube"
                                >
                                    <ExternalLink className="h-4 w-4 text-black" />
                                </a>
                                <button 
                                    onClick={() => handleDelete(video.id)}
                                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="font-medium truncate" title={video.title || video.video_url}>
                                {video.title || "Untitled Video"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                                {video.video_url}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
            {videos.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed rounded-lg">
                    <Video className="h-12 w-12 opacity-20 mb-2" />
                    <p>No videos added yet</p>
                </div>
            )}
        </div>
      )}
    </div>
  )
}
