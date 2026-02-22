"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide preloader after page loads
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 5000) // Small delay for smooth transition
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(251,146,60,0.3),transparent_50%)] animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-10">
        {/* Logo with animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 -m-4">
            <div className="w-40 h-40 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>

          {/* Inner pulsing ring */}
          <div className="absolute inset-0 -m-2">
            <div className="w-36 h-36 border-2 border-amber-300 rounded-full animate-pulse" />
          </div>

          {/* Logo */}
          <div className="relative w-32 h-32 animate-scale-pulse">
            <Image
              src="/logo.jpg"
              alt="Sahitya Bharti"
              fill
              className="object-contain rounded-full shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-bold py-2 leading-relaxed bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent animate-fade-in">
            हिंदी साहित्य भारती
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-in-delay">
            &quot;मानव बन जाए जग सारा, यह पावन संकल्प हमारा।&quot;
          </p>

          {/* Loading dots */}
          <div className="flex justify-center gap-1 pt-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          50% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-pulse {
          animation: scale-pulse 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}