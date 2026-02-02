"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Loader2, X, Copy } from "lucide-react"

export default function PublicGalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<any | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setImages(data)
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी यादें</p>
                <h1 className="text-4xl font-bold text-slate-900">सम्पूर्ण चित्र दीर्घा (Full Gallery)</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    साहित्य भारती के सभी यादगार पलों का संग्रह।
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 aspect-square cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <Image
                                src={item.image_url}
                                alt={item.caption || "Gallery Image"}
                                fill
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                             {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                {item.caption && (
                                     <p className="text-white font-medium text-sm md:text-base line-clamp-3">{item.caption}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            No images found.
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col rounded-lg overflow-hidden bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 z-50 p-2 m-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative flex-1 min-h-[50vh] flex items-center justify-center">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.caption || "Full Screen Image"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Caption */}
            {selectedImage.caption && (
                <div className="bg-white/10 backdrop-blur-md text-white p-6 mt-4 rounded-xl">
                  <p className="text-center font-medium text-lg">{selectedImage.caption}</p>
                </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
