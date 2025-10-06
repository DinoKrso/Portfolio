"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, Phone, Github, Linkedin, Code, Terminal, Database, Hand, Download, FileText } from "lucide-react"
import Spline from "@splinetool/react-spline";
import { useState, useRef, useEffect, useCallback } from "react"
import AnimatedBackground from "@/components/AnimatedBackground"
import { GlassCard } from "@/components/GlassCard"

export default function Portfolio() {
  const [isMobile, setIsMobile] = useState(false)
  const [splineApp, setSplineApp] = useState<any>(null)
  const [isHolding, setIsHolding] = useState(false)
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null)
  const [hasCompletedHold, setHasCompletedHold] = useState(false)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Simplified scroll progress tracking
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])
  
  // Check mobile and set initial states
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle CV download with useCallback for performance
  const handleCVDownload = useCallback(async () => {
    setIsDownloading(true)
    try {
      // For mobile devices, directly open the Google Drive link
      if (isMobile) {
        window.open('https://drive.google.com/file/d/1jgJMpm1XTVGWZrxIrdeO_SesqrKKiyt5/view?usp=sharing', '_blank')
        setIsDownloading(false)
        return
      }

      // For desktop, try the API route first
      const response = await fetch('/api/download-cv')
      if (response.ok) {
        // If it's a redirect response, follow it
        if (response.redirected) {
          window.open(response.url, '_blank')
        } else {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'Dino_Krso_CV.pdf'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      } else {
        // Fallback to direct link
        window.open('https://drive.google.com/file/d/1jgJMpm1XTVGWZrxIrdeO_SesqrKKiyt5/view?usp=sharing', '_blank')
      }
    } catch (error) {
      console.error('CV download error:', error)
      // Fallback to direct link
      window.open('https://drive.google.com/file/d/1jgJMpm1XTVGWZrxIrdeO_SesqrKKiyt5/view?usp=sharing', '_blank')
    }
    setIsDownloading(false)
  }, [isMobile])

  // Handle click-and-hold functionality with useCallback
  const handleMouseDown = useCallback(() => {
    if (isMobile) return // Disable on mobile
    
    setIsHolding(true)
    
    const timer = setTimeout(() => {
      setHasCompletedHold(true)
      const experienceSection = document.getElementById("experience")
      if (experienceSection) {
        experienceSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 2000) // 2 seconds
    
    setHoldTimer(timer)
  }, [isMobile])

  const handleMouseUp = useCallback(() => {
    if (isMobile) return // Disable on mobile
    
    setIsHolding(false)
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }, [isMobile, holdTimer])

  // Prevent scrolling until hold is completed (desktop only)
  useEffect(() => {
    if (!hasCompletedHold && !isMobile) {
      const preventScroll = (e: Event) => {
        e.preventDefault()
      }
      
      const preventKeys = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === ' ') {
          e.preventDefault()
        }
      }
      
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('keydown', preventKeys)
      
      return () => {
        document.removeEventListener('wheel', preventScroll)
        document.removeEventListener('keydown', preventKeys)
      }
    }
  }, [hasCompletedHold, isMobile])

  // Handle Spline state change events
  useEffect(() => {
    if (!splineApp) return

    const handleStateChange = (event: any) => {
      // Check if the event is for "ok" object transitioning to "State"
      if (event.target?.name === "ok" && event.stateName === "State") {
        const experienceSection = document.getElementById("experience")
        if (experienceSection) {
          experienceSection.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    // Add event listeners
    try {
      splineApp.addEventListener("stateChange", handleStateChange)
      splineApp.addEventListener("event", (event: any) => {
        if (event.target?.name === "ok" || event.target?.name?.includes("ok")) {
          const experienceSection = document.getElementById("experience")
          if (experienceSection) {
            experienceSection.scrollIntoView({ behavior: "smooth" })
          }
        }
      })
    } catch (error) {
      // Silent error handling
    }

    // Cleanup event listeners on unmount
    return () => {
      try {
        splineApp.removeEventListener("stateChange", handleStateChange)
      } catch (error) {
        // Silent error handling
      }
    }
  }, [splineApp])

  const experiences = [
    {
      title: "Intern",
      company: "Codecta",
      image: "/Codecta.jpg",
      technologies: ["AWS Lambda", "React", "MongoDB", "Node.js"],
      description: "Developed serverless applications and full-stack web solutions",
      category: "Work"
    },
    {
      title: "IT Support",
      company: "Lumitic Inc.",
      image: "/Lumitic.jpg",
      technologies: ["System Maintenance", "Networking", "Marketing"],
      description: "Provided technical support, network maintenance, and marketing assistance",
      category: "Work"
    },
    {
      title: "Web Programmer",
      company: "Modern Escape Europe",
      image: "/ModernEscapeEurope.png",
      technologies: ["Web Design", "Backend Development"],
      description: "Created a modern and user-friendly interface to enhance the user experience",
      category: "Work"
    },
    {
      title: "Web Programmer",
      company: "Xtream Networks",
      image: "/xtream.png",
      technologies: ["Frontend Development", "SEO", "Performance Optimization"],
      description: "Implemented front-end design and integrated dynamic features for improved functionality and optimized site performance.",
      link: "https://xtream.ba/",
      category: "Work"
    },
    {
      title: "Web Developer",
      company: "Si-Team Ug",
      image: "/siteam.png",
      technologies: ["Web Development", "Cleaning Services", "Business Solutions"],
      description: "Developed a professional website for cleaning services company, showcasing their services and improving online presence",
      category: "Work"
    },
    {
      title: "Personal Project",
      company: "Junior Job Platform",
      image: "/prviposao.png",
      technologies: ["Full Stack Development", "React", "Node.js"],
      description: "Developed a full-stack web application to help junior developers find job opportunities and kickstart their careers",
      link: "https://www.prviposao.site/",
      category: "Projects"
    },
    {
      title: "Final Year Project",
      company: "Conference Web App",
      image: "/Conference.png",
      technologies: ["React", "MongoDB", "Node.js"],
      description: "Built a comprehensive conference management system",
      link: "https://conferencehub.onrender.com/",
      category: "Projects"
    },
  ]

  const techStack = [
    { 
      name: "React", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      color: "text-[#61DAFB]"
    },
    { 
      name: "Node.js", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      color: "text-[#339933]"
    },
    { 
      name: "MongoDB", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      color: "text-[#47A248]"
    },
    { 
      name: "JavaScript", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      color: "text-[#F7DF1E]"
    },
    { 
      name: "TypeScript", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      color: "text-[#3178C6]"
    },
    { 
      name: "Tailwind CSS", 
      logo: "https://img.icons8.com/?size=100&id=FnnFuAIw4e8j&format=png&color=000000",
      color: "text-[#06B6D4]"
    },
    { 
      name: "AWS", 
      logo: "https://img.icons8.com/?size=100&id=33039&format=png&color=000000",
      color: "text-[#FF9900]"
    },
    { 
      name: "WordPress", 
      logo: "https://img.icons8.com/?size=100&id=v9uZbuVoWleB&format=png&color=000000",
      color: "text-[#21759B]"
    },
  ]



  // Experience card component
  const ExperienceCard = ({ exp, index }: { exp: any, index: number }) => {
    const isHovered = hoveredCardIndex === index
    
    return (
      <motion.div
        key={index}
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="group h-full relative"
        onHoverStart={() => setHoveredCardIndex(index)}
        onHoverEnd={() => setHoveredCardIndex(null)}
        transition={{
          delay: index * 0.1,
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        {exp.link ? (
          <a 
            href={exp.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div className="h-full">
              <GlassCard 
                variant="card" 
                intensity="medium"
                className="h-full flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="relative bg-gradient-to-br from-[#FBAA84]/25 to-gray-800/40 overflow-hidden flex-shrink-0 h-48">
                  <img
                    src={exp.image}
                    alt={exp.company}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-gray-300">{exp.company}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-4 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300 flex-1">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {exp.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm group-hover:bg-[#FBAA84]/25 group-hover:text-[#FBAA84] transition-colors duration-300 backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </a>
        ) : (
          <div className="h-full">
            <GlassCard 
              variant="card" 
              intensity="medium"
              className="h-full flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <div className="relative bg-gradient-to-br from-[#FBAA84]/25 to-gray-800/40 overflow-hidden flex-shrink-0 h-48">
                <img
                  src={exp.image}
                  alt={exp.company}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                  <p className="text-gray-300">{exp.company}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                  <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300 flex-1">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {exp.technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm group-hover:bg-[#FBAA84]/25 group-hover:text-[#FBAA84] transition-colors duration-300 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    )
  }

  const MobileHero = () => (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(251, 170, 132, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 170, 132, 0.15) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Simplified floating geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-[#FBAA84]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Simplified glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-2 h-2 bg-[#FBAA84]/40 rounded-full blur-sm"
            style={{
              left: `${25 + (i * 25)}%`,
              top: `${40 + (i * 15)}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content with enhanced styling */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Enhanced logo container */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#FBAA84]/60 mb-8 relative"
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-[#FBAA84]/20 blur-md animate-pulse" />
            <Code className="w-10 h-10 text-[#FBAA84] relative z-10" />
          </motion.div>

          {/* Enhanced title with better typography */}
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#FBAA84] to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Dino Kršo
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-400 mb-8 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Full-Stack Developer
          </motion.p>

          {/* Simplified tech icons */}
          <div className="flex justify-center space-x-8 mb-10">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            >
              <GlassCard
                variant="floating"
                intensity="medium"
                className="p-3"
              >
                <Terminal className="w-7 h-7 text-[#FBAA84]" />
              </GlassCard>
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.7 }}
            >
              <GlassCard
                variant="floating"
                intensity="subtle"
                className="p-3"
              >
                <Database className="w-7 h-7 text-gray-400" />
              </GlassCard>
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.4 }}
            >
              <GlassCard
                variant="floating"
                intensity="medium"
                className="p-3"
              >
                <Code className="w-7 h-7 text-[#FBAA84]" />
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={() => {
            const experienceSection = document.getElementById("experience")
            if (experienceSection) {
              experienceSection.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          <p className="text-gray-300 text-sm mb-4 whitespace-nowrap font-medium tracking-wide">
            Tap to explore
          </p>
          
          {/* Mobile finger scroll indicator */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FBAA84]/10 border border-[#FBAA84]/40 relative"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1],
              y: [0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-[#FBAA84]/20 blur-sm" />
            
            {/* Arrow down icon */}
            <motion.div
              className="relative z-10"
              animate={{ 
                y: [0, 8, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
            >
              <svg className="w-6 h-6 text-[#FBAA84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  )



  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden font-chakra-petch relative">
      {/* Animated Background - Optimized for mobile */}
      <AnimatedBackground scrollYProgress={scrollYProgress} />
      
      {/* Error boundary wrapper */}
      <div className="relative z-10">
      
      {/* Hero Section */}
      <motion.section
        className="h-screen relative flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
                    {isMobile ? (
              <MobileHero />
            ) : (
              <>
                <div 
                  className="absolute inset-0 z-0"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Spline
                    scene="https://prod.spline.design/3lhUXCArBteKULm5/scene.splinecode"
                    onLoad={(app) => {
                      setSplineApp(app)
                    }}
                    onError={(error) => {
                      console.error("Spline loading error:", error)
                    }}
                  />
                  
                  {/* Black overlay to cover Spline watermark */}
                  <div className="absolute bottom-0 right-0 w-40 h-16 bg-black z-10"></div>
                </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full">

                
                {/* Click and hold indicator - only show on desktop */}
                {!hasCompletedHold && !isMobile && (
                  <motion.div
                    className="absolute bottom-10 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <p className="text-gray-300 text-sm mb-4 whitespace-nowrap font-medium tracking-wide">
                      Click and hold on the card
                    </p>
                    <motion.div
                      className="w-12 h-12 border-2 border-[#FBAA84]/60 rounded-full flex items-center justify-center relative"
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#FBAA84]/20 blur-sm" />
                      <motion.div
                        className="w-6 h-6 bg-[#FBAA84] rounded-full relative z-10 flex items-center justify-center"
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    </motion.div>
                    <motion.p
                      className="text-[#FBAA84] text-xs mt-2 font-medium"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Hold for 2 seconds
                    </motion.p>
                    <motion.p
                      className="text-gray-400 text-xs mt-1 font-medium"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Scroll locked until completed
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.section>

      {/* Experience Section */}
      <motion.section
        id="experience"
        className="min-h-screen py-8 px-4 md:px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            Experience
          </motion.h2>

          {/* Experience Grid - Same for both mobile and desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        className="py-8 px-4 md:px-8 relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Tech Stack
          </motion.h2>

          <div className="relative min-h-[600px] flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto px-8">
              {techStack && techStack.length > 0 && techStack.map((tech, index) => {
                return (
                  <motion.div
                    key={index}
                    className="group cursor-pointer"
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -10,
                      transition: { 
                        duration: 0.25,
                        ease: "easeOut"
                      }
                    }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      y: {
                        duration: 3 + index * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.1,
                      }
                    }}
                  >
                    <GlassCard 
                      variant="floating" 
                      intensity="medium"
                      className="w-40 h-40"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {/* Tech logo */}
                        <div className="mb-3">
                          <img 
                            src={tech?.logo || ''} 
                            alt={tech?.name || 'Tech'}
                            className="w-16 h-16 group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                        
                        {/* Tech name */}
                        <p className="text-base font-medium text-gray-300 group-hover:text-white transition-colors duration-300 text-center">
                          {tech?.name || 'Tech'}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>



      {/* Contact Section */}
      <motion.section
        className="min-h-screen py-8 px-4 md:px-8 flex items-center relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Let's Connect
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-white">Get In Touch</h3>
              <div className="space-y-6">
                <motion.a
                  href="mailto:dino.krso02@gmail.com"
                  className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 10 }}
                >
                  <Mail className="group-hover:text-[#FBAA84] transition-colors" size={24} />
                  <span className="text-lg">dino.krso02@gmail.com</span>
                </motion.a>

                <motion.a
                  href="tel:+387603400423"
                  className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 10 }}
                >
                  <Phone className="group-hover:text-[#FBAA84] transition-colors" size={24} />
                  <span className="text-lg">+387 60 340 0423</span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <GlassCard
                  variant="button"
                  intensity="medium"
                  onClick={() => window.open('https://github.com/DinoKrso', '_blank')}
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Github className="text-white transition-colors" size={24} />
                    <span className="text-lg font-medium text-white">GitHub</span>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <GlassCard
                  variant="button"
                  intensity="strong"
                  onClick={() => window.open('https://www.linkedin.com/in/dino-kr%C5%A1o-5ba153200/', '_blank')}
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Linkedin className="text-white transition-colors" size={24} />
                    <span className="text-lg font-medium text-white">LinkedIn</span>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-gray-400 text-lg">
              Ready to bring your ideas to life? Let's build something amazing together.
            </p>
          </motion.div>
        </div>
      </motion.section>
      </div>

      {/* Floating CV Download Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <GlassCard
            variant="floating"
            intensity="strong"
            onClick={handleCVDownload}
            className="relative group touch-manipulation"
          >
            {/* Download icon */}
            <motion.div
              animate={{
                y: isDownloading ? [0, -2, 0] : 0,
                rotate: isDownloading ? [0, 5, -5, 0] : 0,
              }}
              transition={{
                duration: 0.6,
                repeat: isDownloading ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center"
            >
              {isDownloading ? (
                <FileText className="w-6 h-6 text-white mb-1" />
              ) : (
                <Download className="w-6 h-6 text-white mb-1" />
              )}
              <span className="text-white text-xs font-bold tracking-wider">CV</span>
            </motion.div>
            
            {/* Hover tooltip */}
            <motion.div
              className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none"
              animate={{
                opacity: 0,
                x: 10,
              }}
              whileHover={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Download CV
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </motion.div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
