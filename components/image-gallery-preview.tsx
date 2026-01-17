"use client"

import Link from "next/link"
import Image from "next/image"
import { imageGalleryMock } from "@/mock/galleryMock"

export function ImageGalleryPreview() {
  // Create masonry layout with different heights
  const masonryItems = imageGalleryMock.slice(0, 6).map((item, index) => ({
    ...item,
    colSpan: index === 0 ? 2 : 1,
    rowSpan: index === 1 ? 2 : 1,
  }))

  return (
    <section className="py-16 sm:py-20">
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

        {/* Artistic Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 auto-rows-max">
          {imageGalleryMock.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-lg bg-muted cursor-pointer transition-all duration-300 hover:shadow-lg
                ${index === 0 ? "col-span-1 sm:col-span-2 row-span-2" : ""}
                ${index === 1 ? "row-span-2" : ""}
              `}
              style={{
                minHeight: index === 0 ? "400px" : index === 1 ? "400px" : "200px",
              }}
            >
              {/* Image */}
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-white/80 text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/images-gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
          >
            और देखें
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
