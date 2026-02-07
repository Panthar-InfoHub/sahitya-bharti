"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function VideoGalleryPreview() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("video_gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
      
      if (data) setVideos(data)
      setLoading(false)
    }
    fetchVideos()
  }, [])

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <section className="py-16 sm:py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-sm font-semibold text-secondary uppercase tracking-wide">साहित्य का संसार</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">वीडियो दीर्घा</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">प्रसिद्ध लेखकों और कवियों के साहित्यिक प्रस्तुतियां</p>
        </div>

        {/* Ornamental Divider */}
        <div className="flex justify-center mb-12">
          <span className="text-2xl text-secondary">✦</span>
        </div>

        {loading ? (
             <div className="flex justify-center p-12">
                 <Loader2 className="h-8 w-8 animate-spin text-secondary" />
             </div>
        ) : (
            <>
                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {videos.map((video) => {
                    const videoId = getYoutubeId(video.video_url)
                    return (
                        <div
                        key={video.id}
                        className="group rounded-lg overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all duration-300"
                        >
                        {/* YouTube Embed */}
                        <div className="aspect-video bg-black overflow-hidden relative">
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
                                <div className="flex items-center justify-center h-full text-white">Invalid URL</div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{video.title || "Untitled Video"}</h3>
                        </div>
                        </div>
                    )
                })}
                </div>

                 {videos.length === 0 && (
                    <p className="text-center text-muted-foreground pb-8">No videos available.</p>
                )}

                {/* CTA Button */}
                {videos.length >= 3 && (
                    <div className="text-center">
                    <Link
                        href="/videos-gallery"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
                    >
                        और वीडियो देखें
                        <span>→</span>
                    </Link>
                    </div>
                )}
            </>
        )}
      </div>
    </section>
  )
}
