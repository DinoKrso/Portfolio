'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'

interface ScrollWrapperProps {
  children: React.ReactNode
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const scrollHook = isHydrated ? useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  }) : null

  const heroOpacity = scrollHook?.scrollYProgress ? useTransform(scrollHook.scrollYProgress, [0, 0.3], [1, 0]) : null
  const heroScale = scrollHook?.scrollYProgress ? useTransform(scrollHook.scrollYProgress, [0, 0.3], [1, 0.8]) : null

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden font-chakra-petch relative">
      {children}
    </div>
  )
} 