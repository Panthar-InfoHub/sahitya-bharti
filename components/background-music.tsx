"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3) // 30% volume by default
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Attempt to play audio on mount
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          // Reset time to ensuring it starts from beginning
          audioRef.current.currentTime = 0
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.log("Auto-play blocked, waiting for user interaction")
          // If auto-play fails, add a one-time click listener to the document to start playback
          const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Play failed after interaction:", e))
            }
            // Remove listeners after first interaction
            document.removeEventListener("click", handleInteraction)
            document.removeEventListener("scroll", handleInteraction)
            document.removeEventListener("keydown", handleInteraction)
          }

          document.addEventListener("click", handleInteraction)
          document.addEventListener("scroll", handleInteraction)
          document.addEventListener("keydown", handleInteraction)
        }
      }
    }

    playAudio()
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        preload="auto"
      >
        <source src="/music/background.mp3" type="audio/mpeg" />
        <source src="/music/background.ogg" type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>

      {/* Floating Music Control */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-orange-200 p-4 flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>

          {/* Volume Controls */}
          <div className="flex items-center gap-2">
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-orange-600" />
              ) : (
                <Volume2 className="w-5 h-5 text-orange-600" />
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
              className="w-24 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              aria-label="Volume control"
            />
          </div>

          {/* Music Label */}
          <div className="hidden sm:block pl-2 border-l border-orange-200">
            <p className="text-xs font-semibold text-orange-600">संगीत</p>
            <p className="text-xs text-muted-foreground">
              {isPlaying ? "चल रहा है" : "रुका हुआ"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
