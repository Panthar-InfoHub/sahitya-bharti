"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface HeroProps {
  directorImage?: string
}

export function Hero({ directorImage }: HeroProps) {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const taglines = ["मानव बन जाए जाग सारा, यही है संकल्प हमारा।"]

  const carouselImages = [
    "/images/director.jpg",
    "/hindi-literature-event.jpg",
    "/poetry-recitation-gathering.jpg",
    "/authors-meeting-conference.jpg",
    "/literary-conference-event.jpg",
    "/young-writers-workshop.jpg",
    "/book-exhibition-display.jpg",
    "/author-interview.jpg",
    "/literary-discussion-group.jpg",
    "/ancient-hindi-literature-manuscript.jpg",
  ]

  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 4000)
    return () => clearInterval(taglineInterval)
  }, [])

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(imageInterval)
  }, [])

  const finalDirectorImage = directorImage || "/images/director.jpg"

  return (
    <section className="min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-card to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Tagline and Content */}
          <div className="space-y-8">
            {/* Logo and Tagline */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 relative flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/logo.jpg"
                    alt="हिंदी साहित्य भारती"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">हिंदी साहित्य</h1>
                  <p className="text-lg text-secondary font-semibold">भारती</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-primary pl-6 space-y-2">
                <p className="text-2xl lg:text-3xl font-serif italic text-foreground leading-relaxed transition-all duration-500">
                  "मानव बन जाए जाग सारा, यही है संकल्प हमारा।"
                </p>
              </blockquote>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              हिंदी साहित्य भारती हिंदी भाषा और साहित्य के संरक्षण, प्रचार और विकास के लिए एक समर्पित संस्था है। हम भारतीय साहित्यिक
              परंपरा को आगे बढ़ाने का कार्य करते हैं।
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/membership"
                className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-1"
              >
                साहित्य से जुड़ें
              </Link>
            </div>
          </div>

          {/* Right Column - Image carousel with scroll animation */}
          <div className="relative h-screen lg:h-auto lg:aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
            <div className="relative w-full h-full">
              <Image
                src={carouselImages[currentImageIndex] || "/placeholder.svg"}
                alt="संस्थापक और निर्देशक"
                fill
                className="object-cover animate-scroll-right-to-left"
              />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>

            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <p className="text-white text-xs font-semibold">
                {currentImageIndex + 1}/{carouselImages.length}
              </p>
            </div>

            {/* Floating poetry element */}
            <div className="absolute bottom-8 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white text-sm font-serif italic text-center">"कलम वह शक्ति है जो दुनिया को बदल देती है।"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes scroll-right-to-left {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          10% {
            transform: translateX(0);
            opacity: 1;
          }
          85% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        .animate-scroll-right-to-left {
          animation: scroll-right-to-left 4s ease-in-out forwards;
        }
      `}</style>
    </section>
  )
}
