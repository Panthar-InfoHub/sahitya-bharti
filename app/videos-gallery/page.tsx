"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader2, Video } from "lucide-react"

export default function PublicVideoGalleryPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("video_gallery")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setVideos(data)
    }
    setLoading(false)
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">साहित्य का संसार</p>
                <h1 className="text-4xl font-bold text-slate-900">वीडियो दीर्घा (Video Gallery)</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                   प्रसिद्ध लेखकों और कवियों के साहित्यिक प्रस्तुतियां एवं अन्य वीडियो।
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => {
                        const videoId = getYoutubeId(video.video_url)
                        return (
                            <div
                                key={video.id}
                                className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-video bg-black relative">
                                    {videoId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={video.title || "Video"}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/50 flex-col gap-2">
                                            <Video className="h-8 w-8 opacity-50" />
                                            <span>Invalid Channel/URL</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                     <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                        {video.title || "Untitled Video"}
                                     </h3>
                                </div>
                            </div>
                        )
                    })}
                    {videos.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                            <Video className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No videos available yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  )
}
