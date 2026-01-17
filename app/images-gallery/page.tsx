"use client"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { imageGalleryMock } from "@/mock/galleryMock"
import { X } from "lucide-react"

export default function ImagesGalleryPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof imageGalleryMock)[0] | null>(null)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी विरासत</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">चित्र दीर्घा</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              हमारे संगठन के महत्वपूर्ण क्षणों और आयोजनों की तस्वीरें
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-accent">✦</span>
          </div>

          {/* Masonry Gallery */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {imageGalleryMock.map((image) => (
              <div
                key={image.id}
                className="group relative break-inside-avoid rounded-lg overflow-hidden bg-muted cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(image)}
              >
                {/* Image */}
                <Image
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.title}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  <p className="text-white/80 text-sm mt-1">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] rounded-lg overflow-hidden bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.imageUrl || "/placeholder.svg"}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="w-auto h-auto max-h-[75vh] object-contain"
              />
            </div>

            {/* Caption */}
            <div className="bg-primary text-primary-foreground p-6 space-y-2">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-sm opacity-90">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
