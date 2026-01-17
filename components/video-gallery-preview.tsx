"use client"

import Link from "next/link"
import { videoGalleryMock } from "@/mock/galleryMock"

export function VideoGalleryPreview() {
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {videoGalleryMock.map((video) => (
            <div
              key={video.id}
              className="group rounded-lg overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* YouTube Embed */}
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
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/videos-gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
          >
            और वीडियो देखें
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
