"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3) // 30% volume by default
  const audioRef = useRef<HTMLAudioElement>(null)

  const attemptPlay = async () => {
    if (!audioRef.current) return

    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.log("Playback failed or was interrupted:", error)
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    // Initial auto-play attempt
    const initAudio = async () => {
      if (!audioRef.current) return
      
      // Try to play immediately
      try {
        audioRef.current.volume = volume
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.log("Initial auto-play blocked, retrying with mute or waiting for interaction")
        
        // Fallback: Try muted autoplay
        try {
           audioRef.current.muted = true
           await audioRef.current.play()
           setIsPlaying(true)
           setIsMuted(true)
        } catch (mutedError) {
           console.log("Muted auto-play also blocked")
        }
      }
    }

    // Attempt to play on mount
    initAudio()

    // Also add a global listener to ensure it starts on first interaction if it hasn't already
    const handleInteraction = async () => {
      if (!audioRef.current) return

      // If already playing and unmuted, we are good
      if (!audioRef.current.paused && !audioRef.current.muted) {
         return
      }

      // If playing but muted, unmute
      if (!audioRef.current.paused && audioRef.current.muted) {
         audioRef.current.muted = false
         audioRef.current.volume = volume
         setIsMuted(false)
      } 
      // If paused, play
      else if (audioRef.current.paused) {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
          } catch (e) {
            console.error("Interaction play failed", e)
          }
      }
    }

    // Add listeners for common interactions
    window.addEventListener("click", handleInteraction)
    window.addEventListener("touchstart", handleInteraction)
    window.addEventListener("keydown", handleInteraction)
    window.addEventListener("scroll", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
      window.removeEventListener("scroll", handleInteraction)
    }
  }, [])

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await attemptPlay()
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted
      audioRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      audioRef.current.muted = false // Unmute if volume is adjusted
      setIsMuted(false)
    }
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/music/background.mp3" type="audio/mpeg" />
        <source src="/music/background.ogg" type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>

      {/* Floating Music Control */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-orange-200 p-2 flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>

          {/* Volume Controls */}
          <div className="flex items-center gap-2">
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-orange-600" />
              ) : (
                <Volume2 className="w-4 h-4 text-orange-600" />
              )}
            </button>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              aria-label="Volume control"
            />
          </div>

          {/* Music Label */}
          <div className="hidden sm:block pl-2 border-l border-orange-200">
            <p className="text-[10px] font-semibold text-orange-600">संगीत</p>
            <p className="text-[10px] text-muted-foreground">
              {isPlaying ? "चल रहा है" : "रुका हुआ"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
