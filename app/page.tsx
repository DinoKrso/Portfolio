"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, Phone, Github, Linkedin, Code, Terminal, Database, Hand, Download, FileText } from "lucide-react"
import Spline from "@splinetool/react-spline";
import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import AnimatedBackground from "@/components/AnimatedBackground"

export default function Portfolio() {
  const [isMobile, setIsMobile] = useState(false)
  const [splineApp, setSplineApp] = useState<any>(null)
  const [isHolding, setIsHolding] = useState(false)
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null)
  const [hasCompletedHold, setHasCompletedHold] = useState(false)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Add scroll progress tracking
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  
  // Track scroll direction for animations
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const [lastScrollY, setLastScrollY] = useState(0)
  
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

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Handle CV download
  const handleCVDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/download-cv')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Dino_Krso_CV.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Fallback to direct link
        window.open('https://drive.google.com/file/d/10FGYKaOASoCKYoUyLE7sWnKS9NrlTAIR/view?usp=drive_link', '_blank')
      }
    } catch (error) {
      // Fallback to direct link
      window.open('https://drive.google.com/file/d/10FGYKaOASoCKYoUyLE7sWnKS9NrlTAIR/view?usp=drive_link', '_blank')
    }
    setIsDownloading(false)
  }

  // Handle click-and-hold functionality
  const handleMouseDown = () => {
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
  }

  const handleMouseUp = () => {
    if (isMobile) return // Disable on mobile
    
    setIsHolding(false)
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }

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
    },
    {
      title: "IT Support",
      company: "Lumitic Inc.",
      image: "/Lumitic.jpg",
      technologies: ["System Maintenance", "Networking", "Marketing"],
      description: "Provided technical support, network maintenance, and marketing assistance",
    },
    {
      title: "Web Programmer",
      company: "Modern Escape Europe",
      image: "/ModernEscapeEurope.png",
      technologies: ["Web Design", "Backend Development"],
      description: "Created a modern and user-friendly interface to enhance the user experience",
    },
    {
      title: "Web Programmer",
      company: "Xtream Networks",
      image: "/xtream.png",
      technologies: ["Frontend Development", "SEO", "Performance Optimization"],
      description: "Implemented front-end design and integrated dynamic features for improved functionality, optimized site for speed, performance, and SEO to enhance online presence",
      link: "https://xtream.ba/",
    },
    {
      title: "Personal Project",
      company: "Junior Job Platform",
      image: "/prviposao.png",
      technologies: ["Full Stack Development", "React", "Node.js"],
      description: "Developed a full-stack web application to help junior developers find job opportunities and kickstart their careers",
      link: "https://www.prviposao.site/",
    },
    {
      title: "Final Year Project",
      company: "Conference Web App",
      image: "/Conference.png",
      technologies: ["React", "MongoDB", "Node.js"],
      description: "Built a comprehensive conference management system",
      link: "https://conferencehub.onrender.com/",
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

      {/* Enhanced floating geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-[#FBAA84]/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-2 h-2 bg-[#FBAA84]/60 rounded-full blur-sm"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
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

          {/* Enhanced tech icons */}
          <div className="flex justify-center space-x-8 mb-10">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
              className="p-3 rounded-full bg-[#FBAA84]/10 border border-[#FBAA84]/30"
            >
              <Terminal className="w-7 h-7 text-[#FBAA84]" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              className="p-3 rounded-full bg-gray-800/50 border border-gray-600/30"
            >
              <Database className="w-7 h-7 text-gray-400" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="p-3 rounded-full bg-[#FBAA84]/10 border border-[#FBAA84]/30"
            >
              <Code className="w-7 h-7 text-[#FBAA84]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-gray-300 text-sm mb-4 whitespace-nowrap font-medium tracking-wide">
            Swipe to explore
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
            
            {/* Finger scroll icon */}
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
              <Hand className="w-6 h-6 text-[#FBAA84]" />
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
      {/* Animated Background */}
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
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={scrollDirection === 'down' ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          >
            Experience
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => {
              const isHovered = hoveredCardIndex === index
              const isOtherHovered = hoveredCardIndex !== null && hoveredCardIndex !== index
              
              return (
                <motion.div
                  key={index}
                  initial={{ y: 100, opacity: 0, rotateX: 45 }}
                  whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="group h-full relative"
                  onHoverStart={() => setHoveredCardIndex(index)}
                  onHoverEnd={() => setHoveredCardIndex(null)}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.2,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {exp.link ? (
                    <a 
                      href={exp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <motion.div
                        animate={{
                          scale: isHovered ? 1.05 : isOtherHovered ? 0.95 : 1,
                          zIndex: isHovered ? 10 : 1,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full"
                      >
                        <Card className={`bg-gray-900/80 border-gray-700 backdrop-blur-sm overflow-hidden hover:border-[#FBAA84]/50 transition-all duration-500 h-full flex flex-col ${isHovered ? 'shadow-2xl shadow-[#FBAA84]/30' : 'group-hover:shadow-2xl group-hover:shadow-[#FBAA84]/20'}`}>
                        <motion.div 
                          className="relative bg-gradient-to-br from-[#FBAA84]/25 to-gray-800/40 overflow-hidden flex-shrink-0"
                          animate={{
                            height: isHovered ? 280 : 192,
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <motion.img
                            src={exp.image}
                            alt={exp.company}
                            className="w-full h-full object-cover"
                            animate={{
                              opacity: isHovered ? 0.9 : 0.6,
                              scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                          <motion.div 
                            className="absolute bottom-4 left-4"
                            animate={{
                              y: isHovered ? -10 : 0,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          >
                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                            <p className="text-gray-300">{exp.company}</p>
                          </motion.div>
                        </motion.div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col"
                            viewport={{ once: false }}
                            animate={{
                              opacity: isOtherHovered ? 0.3 : 1,
                              scale: isOtherHovered ? 0.95 : 1,
                              y: isHovered ? -8 : 0,
                            }}
                            transition={{ 
                              delay: 0.7 + index * 0.1,
                              duration: 0.4, 
                              ease: "easeOut" 
                            }}
                          >
                            <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300 flex-1">
                              {exp.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {exp.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm group-hover:bg-[#FBAA84]/25 group-hover:text-[#FBAA84] transition-colors duration-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                      </motion.div>
                    </a>
                  ) : (
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.05 : isOtherHovered ? 0.95 : 1,
                        zIndex: isHovered ? 10 : 1,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-full"
                    >
                      <Card className={`bg-gray-900/80 border-gray-700 backdrop-blur-sm overflow-hidden hover:border-[#FBAA84]/50 transition-all duration-500 h-full flex flex-col ${isHovered ? 'shadow-2xl shadow-[#FBAA84]/30' : 'group-hover:shadow-2xl group-hover:shadow-[#FBAA84]/20'}`}>
                        <motion.div 
                          className="relative bg-gradient-to-br from-[#FBAA84]/25 to-gray-800/40 overflow-hidden flex-shrink-0"
                        animate={{
                          height: isHovered ? 280 : 192,
                          scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <motion.img
                          src={exp.image}
                          alt={exp.company}
                          className="w-full h-full object-cover"
                          animate={{
                            opacity: isHovered ? 0.9 : 0.6,
                            scale: isHovered ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                        <motion.div 
                          className="absolute bottom-4 left-4"
                          animate={{
                            y: isHovered ? -10 : 0,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                          <p className="text-gray-300">{exp.company}</p>
                        </motion.div>
                      </motion.div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="flex-1 flex flex-col"
                          viewport={{ once: false }}
                          animate={{
                            opacity: isOtherHovered ? 0.3 : 1,
                            y: isHovered ? -8 : 0,
                          }}
                          transition={{ 
                            delay: 0.7 + index * 0.1,
                            duration: 0.4, 
                            ease: "easeOut" 
                          }}
                        >
                          <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300 flex-1">
                            {exp.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm group-hover:bg-[#FBAA84]/25 group-hover:text-[#FBAA84] transition-colors duration-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        className="py-8 px-4 md:px-8 relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={scrollDirection === 'down' ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          >
            Tech Stack
          </motion.h2>

          <div className="relative min-h-[600px] flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto px-8">
              {techStack && techStack.length > 0 && techStack.map((tech, index) => {
                // Create unique floating patterns for each bubble
                const floatPatterns = [
                  { y: [-20, -35, -20], x: [-15, 15, -15], duration: 6 },
                  { y: [-25, -40, -25], x: [12, -12, 12], duration: 7 },
                  { y: [-18, -32, -18], x: [-18, 18, -18], duration: 5.5 },
                  { y: [-22, -37, -22], x: [15, -15, 15], duration: 6.5 },
                  { y: [-16, -30, -16], x: [-12, 12, -12], duration: 5 },
                  { y: [-24, -38, -24], x: [18, -18, 18], duration: 7.5 },
                  { y: [-19, -33, -19], x: [-10, 10, -10], duration: 6.2 },
                  { y: [-21, -36, -21], x: [14, -14, 14], duration: 6.8 },
                ];
                
                return (
                  <motion.div
                    key={index}
                    className="group cursor-pointer"
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    animate={{
                      y: scrollDirection === 'down' ? floatPatterns[index]?.y || [0, 0, 0] : 30,
                      opacity: scrollDirection === 'down' ? 1 : 0,
                      scale: scrollDirection === 'down' ? [1, 1.03, 1] : 0,
                      x: floatPatterns[index]?.x || [0, 0, 0],
                    }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      y: {
                        duration: floatPatterns[index]?.duration || 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.15,
                      },
                      x: {
                        duration: (floatPatterns[index]?.duration || 6) + 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.2,
                      },
                      scale: {
                        duration: 3 + (index * 0.3),
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.1,
                      },
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -15,
                      transition: { 
                        duration: 0.25,
                        ease: "easeOut"
                      }
                    }}
                  >
                    <div className="relative p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 bg-gradient-to-br from-gray-800/60 to-gray-900/60 group-hover:from-gray-700/70 group-hover:to-gray-800/70 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#FBAA84]/20 w-40 h-40 flex flex-col items-center justify-center">
                      {/* Bubble glow effects */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FBAA84]/10 to-transparent opacity-60 animate-pulse" />
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tl from-[#FBAA84]/5 to-transparent opacity-40" />
                      
                      {/* Tech logo */}
                      <div className="relative z-10 mb-3">
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
                      
                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FBAA84]/20 to-[#FBAA84]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
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
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={scrollDirection === 'down' ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          >
            Let's Connect
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              animate={scrollDirection === 'down' ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
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
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="flex flex-col space-y-4"
              animate={scrollDirection === 'down' ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            >
              <motion.a
                href="https://github.com/DinoKrso"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="group-hover:text-[#FBAA84] transition-colors" size={24} />
                <span className="text-lg font-medium">GitHub</span>
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/dino-kr%C5%A1o-5ba153200/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-[#FBAA84] hover:bg-[#FBAA84]/80 text-black p-4 rounded-lg transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="group-hover:text-black/80 transition-colors" size={24} />
                <span className="text-lg font-medium">LinkedIn</span>
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={scrollDirection === 'down' ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
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
        <motion.button
          onClick={handleCVDownload}
          disabled={isDownloading}
          className="relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing background */}
          <motion.div
            className="absolute inset-0 bg-[#FBAA84]/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Main button */}
          <div className="relative bg-gradient-to-br from-[#FBAA84] to-[#FBAA84]/80 rounded-full p-4 shadow-2xl shadow-[#FBAA84]/30 border border-[#FBAA84]/50 backdrop-blur-sm">
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
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}
