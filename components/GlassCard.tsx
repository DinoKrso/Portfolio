"use client"

import React, { useState, useRef, useCallback, type ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "button" | "card" | "panel" | "floating"
  intensity?: "subtle" | "medium" | "strong"
  onClick?: () => void
}

export function GlassCard({
  children,
  className = "",
  style,
  variant = "card",
  intensity = "medium",
  onClick,
}: GlassCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const getVariantClasses = () => {
    const baseClasses = "glass-card relative overflow-hidden transition-all duration-500"

    switch (variant) {
      case "button":
        return `${baseClasses} px-6 py-3 rounded-2xl cursor-pointer select-none`
      case "card":
        return `${baseClasses} p-6 rounded-3xl`
      case "panel":
        return `${baseClasses} p-8 rounded-2xl`
      case "floating":
        return `${baseClasses} p-4 rounded-full shadow-2xl`
      default:
        return baseClasses
    }
  }

  const getIntensityClasses = () => {
    switch (intensity) {
      case "subtle":
        return "backdrop-blur-sm bg-black/5 border-[#FBAA84]/10"
      case "strong":
        return "backdrop-blur-3xl bg-black/20 border-[#FBAA84]/30"
      default:
        return "backdrop-blur-xl bg-black/10 border-[#FBAA84]/20"
    }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={elementRef}
      className={`
        ${getVariantClasses()}
        ${getIntensityClasses()}
        ${isHovering ? "glass-hover" : ""}
        ${className}
      `}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      {isHovering && (
        <div
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: "80px",
            height: "80px",
            background:
              "radial-gradient(circle, rgba(251, 170, 132, 0.15) 0%, rgba(251, 170, 132, 0.05) 50%, transparent 100%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(10px)",
            zIndex: 2,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#FBAA84]/10 via-transparent to-transparent pointer-events-none z-5" />
    </div>
  )
} 