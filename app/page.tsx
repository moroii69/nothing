"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Maximize, RotateCcw } from "lucide-react"

const zenQuotes = [
  "doing nothing is sometimes the most productive thing.",
  "stillness speaks.",
  "in the silence between thoughts, wisdom emerges.",
  "the art of doing nothing is the art of being.",
  "sometimes the most important thing is to do nothing at all.",
]

export default function NothingGame() {
  const [gameState, setGameState] = useState<"landing" | "ready" | "playing" | "lost">("landing")
  const [time, setTime] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const [showCursor, setShowCursor] = useState(true)

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem("nothing-high-score")
    if (saved) {
      setHighScore(Number.parseInt(saved))
    }
  }, [])

  // Cycle through quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % zenQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Cursor management
  useEffect(() => {
    if (gameState === "playing") {
      setShowCursor(false)
      document.body.style.cursor = "none"
    } else {
      setShowCursor(true)
      document.body.style.cursor = "auto"
    }

    return () => {
      document.body.style.cursor = "auto"
    }
  }, [gameState])

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}m ${secs}s`
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours}h ${mins}m ${secs}s`
    } else {
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${days}d ${hours}h ${mins}m ${secs}s`
    }
  }

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
      setGameState("ready")
    } catch (error) {
      setIsFullscreen(true)
      setGameState("ready")
    }
  }

  const startGame = useCallback(() => {
    setGameState("playing")
    setTime(0)

    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)
  }, [])

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setGameState("lost")

    if (time > highScore) {
      setHighScore(time)
      localStorage.setItem("nothing-high-score", time.toString())
    }
  }, [time, highScore])

  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setTime(0)
    setGameState("ready")
  }

  // Game event listeners
  useEffect(() => {
    if (gameState !== "playing") return

    const handleMouseMove = () => endGame()
    const handleKeyPress = () => endGame()
    const handleClick = () => endGame()
    const handleScroll = () => endGame()
    const handleTouch = () => endGame()

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("keyup", handleKeyPress)
    document.addEventListener("click", handleClick)
    document.addEventListener("scroll", handleScroll)
    document.addEventListener("touchstart", handleTouch)
    document.addEventListener("touchmove", handleTouch)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("keyup", handleKeyPress)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("scroll", handleScroll)
      document.removeEventListener("touchstart", handleTouch)
      document.removeEventListener("touchmove", handleTouch)
    }
  }, [gameState, endGame])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Landing page layout
  if (!isFullscreen) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="text-center space-y-12 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h1
              className="text-8xl md:text-9xl font-light tracking-wider text-foreground/90"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              nothing
            </h1>
            <p className="text-muted-foreground/70 text-sm tracking-wide font-light">{zenQuotes[currentQuote]}</p>
          </div>

          <div className="space-y-6">
            <p className="text-muted-foreground/80 text-sm font-light">
              a meditation on stillness. do nothing. move nothing. think nothing.
            </p>
            <Button
              onClick={enterFullscreen}
              variant="outline"
              className="gap-2 bg-transparent border-muted-foreground/20 text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-all duration-300"
            >
              <Maximize className="w-3 h-3" />
              enter fullscreen
            </Button>
            {highScore > 0 && (
              <p className="text-xs text-muted-foreground/60 font-light">best: {formatTime(highScore)}</p>
            )}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-muted-foreground/40 font-light italic" style={{ fontFamily: "Crimson Text, serif" }}>
            contact developer: kurosen930@gmail.com
          </p>
        </div>
      </div>
    )
  }

  // Fullscreen minimal layout
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="text-center transition-all duration-500 ease-in-out">
        {gameState === "ready" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <p className="text-muted-foreground/60 text-sm font-light tracking-wide">
              click to begin. then do absolutely nothing.
            </p>
            <div className="relative flex items-center justify-center gap-4">
              <Button
                onClick={startGame}
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-300 font-light px-6 py-2"
              >
              <div>
                <img src="/arrow-light.svg" alt="Icon" className="block dark:hidden w-10 h-10" />
                <img src="/arrow-dark.svg" alt="Icon" className="hidden dark:block w-10 h-10" />
              </div>
                start doing nothing
              </Button>
            </div>
            {highScore > 0 && (
              <p className="text-xs text-muted-foreground/40 font-light">best: {formatTime(highScore)}</p>
            )}
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <p className="text-2xl font-light text-muted-foreground/80 tabular-nums">{formatTime(time)}</p>
            <p className="text-xs text-muted-foreground/40 font-light tracking-wider">doing nothing...</p>
          </div>
        )}

        {gameState === "lost" && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-3">
              <p className="text-muted-foreground/80 font-light">you did something.</p>
              <p className="text-muted-foreground/60 text-sm font-light">you lose.</p>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-light text-muted-foreground/90">you lasted: {formatTime(time)}</p>
              {time > highScore && (
                <p className="text-xs text-green-600/80 dark:text-green-400/80 font-light">new best time</p>
              )}
              {highScore > 0 && time !== highScore && (
                <p className="text-xs text-muted-foreground/40 font-light">best: {formatTime(highScore)}</p>
              )}
            </div>

            <Button
              onClick={resetGame}
              variant="ghost"
              className="gap-2 text-muted-foreground/60 hover:text-foreground transition-all duration-300 font-light"
            >
              <RotateCcw className="w-3 h-3" />
              try again
            </Button>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground/30 font-light" style={{ fontFamily: "Crimson Text, serif" }}>
          contact developer: kurosen930@gmail.com
        </p>
      </div>
    </div>
  )
}
