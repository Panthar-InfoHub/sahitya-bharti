"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { videoGalleryMock } from "@/mock/galleryMock"

export default function VideosGalleryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wide">साहित्य की आवाज</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">वीडियो दीर्घा</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              प्रसिद्ध लेखकों और कवियों की प्रस्तुतियां और साहित्य कार्यक्रम
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-secondary">✦</span>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoGalleryMock.map((video) => (
              <div
                key={video.id}
                className="group rounded-lg overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Thumbnail Container */}
                <div className="aspect-video bg-black overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
