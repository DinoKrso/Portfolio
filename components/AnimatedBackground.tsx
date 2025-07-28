'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTransform } from 'framer-motion'

interface AnimatedBackgroundProps {
  scrollYProgress: any
}

export default function AnimatedBackground({ scrollYProgress }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, #FBAA84 0%, transparent 50%, #FBAA84 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#FBAA84]/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scroll-responsive wave effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #FBAA84 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          backgroundPosition: scrollYProgress ? useTransform(scrollYProgress, [0, 1], ['0% 0%', '100% 0%']) : '0% 0%',
        }}
      />

      {/* Radial gradient that moves with scroll */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at center, #FBAA84 0%, transparent 70%)',
          scale: scrollYProgress ? useTransform(scrollYProgress, [0, 1], [0.5, 2]) : 1,
          opacity: scrollYProgress ? useTransform(scrollYProgress, [0, 1], [0.1, 0.3]) : 0.1,
        }}
      />
    </div>
  )
} 