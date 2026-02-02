"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ImageGalleryPreview() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const visibleImages = images.slice(0, 6)

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी यादें</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">चित्र दीर्घा</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">हमारे साहित्य समारोहों और आयोजनों की सुंदर तस्वीरें</p>
        </div>

        {/* Ornamental Divider */}
        <div className="flex justify-center mb-12">
          <span className="text-2xl text-accent">✦</span>
        </div>

        {loading ? (
             <div className="flex justify-center p-12">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        ) : (
            <>
                {/* Grid Layout (2x3 style i.e. 3 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {visibleImages.map((item) => (
                    <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3]"
                    >
                    {/* Image */}
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
                             <p className="text-white font-medium text-lg line-clamp-2">{item.caption}</p>
                        )}
                    </div>
                    </div>
                ))}
                </div>

                {images.length === 0 && (
                    <p className="text-center text-muted-foreground pb-8">No images found.</p>
                )}

                {/* CTA Button */}
                {images.length > 6 && (
                    <div className="text-center">
                    <Link
                        href="/images-gallery"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
                    >
                        और देखें (Show All)
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
