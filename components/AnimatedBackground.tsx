'use client'

import { useMemo, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'

interface AnimatedBackgroundProps {
  scrollYProgress: any
}

export default function AnimatedBackground({ scrollYProgress }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlePositions = useMemo(
    () =>
      Array.from({ length: 4 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 8 + Math.random() * 2,
        delay: Math.random() * 4,
      })),
    [],
  )

  // Simplified transforms
  const backgroundPosition = scrollYProgress ? useTransform(scrollYProgress, [0, 1], ['0% 0%', '100% 0%']) : '0% 0%'

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }}
    >
      {/* Subtle animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          background: 'linear-gradient(45deg, #FBAA84 0%, transparent 50%, #FBAA84 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Minimal floating particles for better performance */}
      {particlePositions.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#FBAA84]/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scroll-responsive wave effect - very subtle */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #FBAA84 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          backgroundPosition: backgroundPosition,
        }}
      />
    </div>
  )
} 