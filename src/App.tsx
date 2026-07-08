/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import CinematicVideoBg from "./components/CinematicVideoBg.tsx";
import { 
  ArrowRight, 
  X, 
  Sparkles, 
  Check, 
  Flame, 
  Compass, 
  Palette, 
  Linkedin, 
  Mail, 
  Cpu, 
  Layers, 
  Zap, 
  Wind, 
  Code2, 
  Tv, 
  ExternalLink,
  Copy
} from "lucide-react";

// List of navigation items for the creative collective
const NAV_ITEMS = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"];

// Standard prism lighting configurations
interface ThemeSpectrum {
  id: "cream" | "copper" | "emerald" | "prism";
  name: string;
  glowClass: string;
  accentColor: string;
}

const SPECTRUNS: ThemeSpectrum[] = [
  {
    id: "cream",
    name: "Warm Cream",
    glowClass: "from-amber-200/5 via-amber-100/[0.01] to-transparent",
    accentColor: "#E1E0CC",
  },
  {
    id: "copper",
    name: "Ethereal Copper",
    glowClass: "from-orange-500/5 via-orange-400/[0.01] to-transparent",
    accentColor: "#f97316",
  },
  {
    id: "emerald",
    name: "Northern Emerald",
    glowClass: "from-emerald-500/5 via-emerald-400/[0.01] to-transparent",
    accentColor: "#10b981",
  },
  {
    id: "prism",
    name: "Prism Dispersion",
    glowClass: "from-blue-500/5 via-purple-500/[0.01] to-pink-500/[0.01]",
    accentColor: "#a855f7",
  },
];

// Experience archival work
interface ExperienceItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link?: string;
}

const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "exp-1",
    title: "Intern",
    subtitle: "Codecta",
    imageUrl: "/Codecta.jpg",
  },
  {
    id: "exp-2",
    title: "IT Support",
    subtitle: "Lumitic Inc.",
    imageUrl: "/Lumitic.jpg",
  },
  {
    id: "exp-3",
    title: "Web Programmer",
    subtitle: "Modern Escape Europe",
    imageUrl: "/ModernEscapeEurope.png",
  },
  {
    id: "exp-4",
    title: "Web Programmer",
    subtitle: "Xtream Networks",
    imageUrl: "/xtream.png",
    link: "https://xtream.ba/",
  },
  {
    id: "exp-5",
    title: "Web Developer",
    subtitle: "Si-Team Ug",
    imageUrl: "/siteam.png",
  },
  {
    id: "exp-6",
    title: "Personal Project",
    subtitle: "Junior Job Platform",
    imageUrl: "/prviposao.png",
    link: "https://www.prviposao.site/",
  },
  {
    id: "exp-7",
    title: "Final Year Project",
    subtitle: "Conference Web App",
    imageUrl: "/Conference.png",
    link: "https://conferencehub.onrender.com/",
  },
  {
    id: "exp-8",
    title: "Frontend & SEO Project",
    subtitle: "Ehodach",
    imageUrl: "/ehodach.png",
    link: "https://www.ehodach.ba/",
  },
  {
    id: "exp-9",
    title: "Frontend & SEO Project",
    subtitle: "Luftaktiv",
    imageUrl: "/luftaktiv.png",
    link: "https://www.luftaktiv.com/",
  },
  {
    id: "exp-10",
    title: "Full-Stack Web App",
    subtitle: "Aida Halimic Psychotherapy",
    imageUrl: "/aida.png",
    link: "https://www.aidahalimic.ba/",
  },
  {
    id: "exp-11",
    title: "Resident App for Building Complexes",
    subtitle: "ResideIn",
    imageUrl: "/residein.png",
    link: "https://www.reside-in.com/",
  },
];

// Tech stack items with custom float configurations
interface TechStackItem {
  name: string;
  category: string;
  iconUrl: string;
  floatDelay: number;
  floatDuration: number;
}

const TECH_STACK_ITEMS: TechStackItem[] = [
  { 
    name: "React", 
    category: "Frontend", 
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
    floatDelay: 0, 
    floatDuration: 5 
  },
  { 
    name: "Node.js", 
    category: "Backend", 
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
    floatDelay: 1.2, 
    floatDuration: 6 
  },
  { 
    name: "MongoDB", 
    category: "Database", 
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", 
    floatDelay: 0.5, 
    floatDuration: 5.5 
  },
  { 
    name: "JavaScript", 
    category: "Language", 
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
    floatDelay: 2.1, 
    floatDuration: 4.8 
  },
  { 
    name: "TypeScript", 
    category: "Language", 
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", 
    floatDelay: 1.6, 
    floatDuration: 6.2 
  },
  { 
    name: "Tailwind CSS", 
    category: "Styling", 
    iconUrl: "https://img.icons8.com/?size=100&id=FnnFuAIw4e8j&format=png", 
    floatDelay: 0.8, 
    floatDuration: 5.2 
  },
  { 
    name: "AWS", 
    category: "Cloud", 
    iconUrl: "https://img.icons8.com/?size=100&id=33039&format=png", 
    floatDelay: 2.5, 
    floatDuration: 5.8 
  },
  { 
    name: "WordPress", 
    category: "CMS", 
    iconUrl: "https://img.icons8.com/?size=100&id=v9uZbuVoWleB&format=png", 
    floatDelay: 0.2, 
    floatDuration: 4.5 
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("Collective");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [selectedSpectrum, setSelectedSpectrum] = useState<ThemeSpectrum>(SPECTRUNS[0]);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredExpIndex, setHoveredExpIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Split experience items into rows of 3 to prevent extreme physical squeeze
  const experienceRows: ExperienceItem[][] = [];
  for (let i = 0; i < EXPERIENCE_ITEMS.length; i += 3) {
    experienceRows.push(EXPERIENCE_ITEMS.slice(i, i + 3));
  }
  
  // Lead submission form states
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("storyteller");
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick action clipboard notifications
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);

  // Split-word letters array for animating "Hi, Im Dino"
  const titleLetters = Array.from("Hi, Im Dino");

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail) return;

    setIsSubmitting(true);
    // Simulate premium server-side pipeline latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setClipboardNotice(`Copied ${label} to clipboard`);
    setTimeout(() => setClipboardNotice(null), 3000);
  };

  const resetForm = () => {
    setFormEmail("");
    setFormRole("storyteller");
    setIsSubmitSuccess(false);
    setIsModalOpen(false);
  };

  return (
    <div className="h-[100dvh] md:h-screen w-full bg-black text-cream font-almarai relative overflow-hidden flex flex-col selection:bg-amber-100 selection:text-black">
      {/* Embedded Ambient High-Resolution Cinematic Video Scrubbing */}
      <CinematicVideoBg src="https://d8j0ntlcm91z4.cloudfront.net/user_3E5AbxgJnltA6DSc9EiHSIFT8EG/hf_20260522_141823_92790145-180e-4f77-abf3-edde525f7ac7.mp4" />

      {/* Cinematic grid lines for editorial structure */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] z-0 hidden md:block">
        <div className="h-full w-full relative">
          <div className="absolute top-0 bottom-0 left-1/4 border-l border-neutral-700" />
          <div className="absolute top-0 bottom-0 left-1/2 border-l border-neutral-700" />
          <div className="absolute top-0 bottom-0 left-3/4 border-l border-neutral-700" />
        </div>
      </div>

      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000 z-0 h-[200vh]">
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${selectedSpectrum.glowClass} transition-all duration-1000 scale-125`}
          style={{ transform: isHoveringTitle ? "scale(1.35) translate(20px, 10px)" : "scale(1.25)" }}
        />
        {/* Soft floating particles represent spectrum photons */}
        <div className="absolute w-[280px] h-[280px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[140px] opacity-[0.12] bg-neutral-900 top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute w-[320px] h-[320px] md:w-[800px] md:h-[800px] rounded-full blur-[120px] md:blur-[180px] opacity-[0.08] bg-neutral-900 top-[120vh] left-1/3 -translate-x-1/2 pointer-events-none animate-pulse hidden md:block" />
      </div>



      {/* 🌪️ VIEWPORT HEIGHT GRADIENT-MASKED MASTER SCROLL CONTAINER */}
      <div 
        id="main-scroll-container"
        className="h-full w-full overflow-y-auto overflow-x-hidden relative z-10 flex flex-col scroll-smooth pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Hero section at 100vh with Inset Feel */}
        <section className="min-h-[100dvh] h-[100dvh] md:h-screen w-full p-3 sm:p-4 md:p-6 flex-shrink-0 relative z-10">
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden bg-transparent border border-neutral-900/40 flex flex-col justify-between p-4 sm:p-8 md:p-16">
          
          {/* TOP STATUS SPACER */}
          <div className="w-full h-4 md:h-8 z-10 pt-2 md:pt-4" />

          {/* 🅰️ CENTERED MAIN HERO TITLE */}
          <div className="my-auto flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto px-2 py-6 sm:py-10 z-10">
            
            {/* Chromatic aberration interactive heading */}
            <div 
              onMouseEnter={() => setIsHoveringTitle(true)}
              onMouseLeave={() => setIsHoveringTitle(false)}
              className="relative cursor-default select-none mb-5 sm:mb-10 group w-full"
            >
              {/* TITLE BACKING CHROMATIC SHADOWS */}
              <h1 
                className={`font-almarai font-extrabold text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] leading-[0.95] md:leading-none tracking-[-0.05em] md:tracking-[-0.07em] transition-all duration-700 absolute inset-0 text-red-500/10 select-none pointer-events-none blur-[1px] ${
                  isHoveringTitle ? "-translate-x-1.5 translate-y-0.5 scale-102" : "translate-x-0 translate-y-0"
                }`}
              >
                Hi, Im Dino
              </h1>
              <h1 
                className={`font-almarai font-extrabold text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] leading-[0.95] md:leading-none tracking-[-0.05em] md:tracking-[-0.07em] transition-all duration-700 absolute inset-0 text-blue-500/10 select-none pointer-events-none blur-[1px] ${
                  isHoveringTitle ? "translate-x-1.5 -translate-y-0.5 scale-[0.99]" : "translate-x-0 translate-y-0"
                }`}
              >
                Hi, Im Dino
              </h1>

              {/* PRIMARY TEXT WORDMARK */}
              <h1 
                id="hero-title"
                className="font-almarai font-extrabold text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] leading-[0.95] md:leading-none tracking-[-0.05em] md:tracking-[-0.07em] text-cream relative transition-transform duration-700 select-none"
              >
                {titleLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* 🔘 CTA BUTTON (“explore”) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                id="cta-explore"
                onClick={() => {
                  document.getElementById("experience-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-cream text-black font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-500 hover:gap-4 hover:shadow-[0_0_30px_rgba(225,224,204,0.15)] active:scale-95 cursor-pointer font-semibold md:animate-bounce shadow-2xl"
              >
                <span>explore</span>
                <div className="bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45">
                  <ArrowRight size={16} className="text-cream" />
                </div>
              </button>
            </motion.div>
          </div>

          {/* 🗺️ INTERACTIVE AURA CONTROLLER AND FOOTER */}
          <div className="w-full h-8 z-20 border-t border-neutral-900/60" />
        </div>
      </section>

      {/* 🔮 EXPERIENCE ARCHIVE GRID */}
      <section 
        id="experience-section"
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-center py-12 md:py-16 md:min-h-screen relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-4 md:pb-6 mb-6 md:mb-8 flex-shrink-0">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream font-almarai">EXPERIENCE</h2>
          </div>
        </div>

        {/* Curation Deck - 3-Card Accordion Rows */}
        <div className="flex flex-col gap-4 md:gap-5 w-full h-auto my-auto py-2 md:py-4">
          {experienceRows.map((rowItems, rowIndex) => (
            <div key={rowIndex} className="flex flex-col md:flex-row w-full gap-3 md:gap-4 md:h-[260px] h-auto">
              {rowItems.map((item) => {
                const idx = EXPERIENCE_ITEMS.findIndex((x) => x.id === item.id);
                const isAnyHoveredInThisRow =
                  !isMobile && hoveredExpIndex !== null && Math.floor(hoveredExpIndex / 3) === rowIndex;
                const isCurrentHovered = hoveredExpIndex === idx;
                const showCardContent = isMobile || isCurrentHovered || !isAnyHoveredInThisRow;

                const cardFlexClass = isMobile
                  ? "w-full flex-none min-h-[200px] h-[52vw] max-h-[240px]"
                  : isAnyHoveredInThisRow
                    ? isCurrentHovered
                      ? "md:flex-[3] h-[240px] md:h-full border-neutral-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                      : "md:flex-[0.6] h-[75px] md:h-full opacity-30 hover:opacity-60 border-neutral-900/40"
                    : "md:flex-1 h-[140px] md:h-full";

                const cardMotionProps = {
                  key: item.id,
                  onMouseEnter: () => !isMobile && setHoveredExpIndex(idx),
                  onMouseLeave: () => !isMobile && setHoveredExpIndex(null),
                  initial: { y: 35, opacity: 0 },
                  whileInView: { y: 0, opacity: 1 },
                  viewport: { once: true, amount: 0.15 },
                  transition: { delay: (idx % 3) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
                  className: `group relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none no-underline text-inherit ${cardFlexClass}`,
                };

                const ExperienceCard = item.link ? motion.a : motion.div;

                return (
                  <ExperienceCard
                    {...cardMotionProps}
                    {...(item.link
                      ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
                      : { onClick: () => setHoveredExpIndex(isCurrentHovered ? null : idx) })}
                  >
                    {/* Absolute Image Background */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                      <img 
                        src={item.imageUrl} 
                        alt={`${item.title} - ${item.subtitle}`}
                        referrerPolicy="no-referrer"
                        className={`h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          showCardContent
                            ? "grayscale-0 scale-102 filter brightness-[0.7]" 
                            : "grayscale filter brightness-[0.3]"
                        } group-hover:scale-105`}
                      />
                      {/* Glowing refractive overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/20 opacity-95" />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: selectedSpectrum.accentColor }}
                      />
                    </div>

                    {/* Card Content - TOP Badge details */}
                    <div className={`relative z-10 flex justify-between items-center transition-all duration-500 ${
                      showCardContent ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}>
                      <span className="font-mono text-[10px] tracking-widest text-amber-200/90 font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="text-[8px] font-mono tracking-widest text-neutral-400 group-hover:text-cream transition-colors uppercase">
                        Ref-{(idx + 104).toString(16).toUpperCase()}
                      </div>
                    </div>

                    {/* Card Content - BOTTOM Detail Header */}
                    <div className={`relative z-10 mt-auto transition-all duration-500 ${
                      showCardContent ? "opacity-100" : "opacity-0 md:opacity-0"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs tracking-widest text-amber-100/90 font-mono uppercase mb-0.5 font-semibold break-words">
                            {item.subtitle}
                          </p>
                          <h3 className={`font-almarai font-extrabold tracking-tight text-white transition-all duration-500 break-words ${
                            isMobile || isCurrentHovered
                              ? "text-lg sm:text-xl md:text-2xl text-amber-100"
                              : "text-sm sm:text-base md:whitespace-nowrap"
                          }`}>
                            {item.title}
                          </h3>
                        </div>

                        {item.link && (
                          <div className={`shrink-0 transition-all duration-500 text-cream/90 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800/80 text-[9px] md:text-[8px] font-mono tracking-wider self-start md:self-auto ${
                            isMobile || isCurrentHovered
                              ? "opacity-100 translate-y-0 scale-100" 
                              : "opacity-0 translate-y-3 scale-90 pointer-events-none"
                          }`}>
                            <span>ACTIVE VIEW</span>
                            <ArrowRight size={8} className="text-amber-200" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vertical rotation label to represent compressed slats on desktop when another is hovered */}
                    <div className={`absolute inset-0 flex items-center justify-center select-none pointer-events-none hidden md:flex transition-all duration-500 ${
                      isAnyHoveredInThisRow && !isCurrentHovered ? "opacity-60 scale-100" : "opacity-0 scale-75 pointer-events-none"
                    }`}>
                      <div className="rotate-90 whitespace-nowrap flex items-center gap-2">
                        <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-bold">
                          {item.title}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                        <span className="font-mono text-[8px] text-neutral-500 font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </ExperienceCard>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* 🧪 BUBBLY TECH STACK SECTION */}
      <section 
        id="tech-section"
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-center pt-16 md:pt-48 pb-12 md:pb-16 lg:min-h-screen lg:h-screen relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-4 md:pb-6 mb-8 md:mb-12 flex-shrink-0">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream font-almarai">Tech Stack</h2>
          </div>
        </div>

        {/* Bubbly interactive node cloud layout */}
        <div className="relative py-8 md:py-14 px-4 sm:px-6 md:px-10 rounded-2xl md:rounded-3xl bg-neutral-950/40 border border-neutral-900/60 overflow-hidden flex flex-col md:flex-row md:flex-wrap justify-center items-stretch md:items-center gap-3 sm:gap-5 md:gap-8 min-h-0 md:min-h-[420px] my-auto">
          {/* Subtle grid backing for the bubbly cloud */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          {TECH_STACK_ITEMS.map((tech, idx) => {
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-auto"
              >
              <motion.div
                animate={isMobile ? undefined : { y: [0, -10, 0] }}
                transition={
                  isMobile
                    ? undefined
                    : {
                        y: {
                          delay: tech.floatDelay,
                          duration: tech.floatDuration,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
                whileHover={
                  isMobile
                    ? undefined
                    : {
                        scale: 1.1,
                        y: -14,
                        borderColor: selectedSpectrum.accentColor,
                        boxShadow: `0 10px 30px -10px ${selectedSpectrum.accentColor}30`,
                      }
                }
                className="group relative w-full md:w-auto px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-2xl md:rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-900/90 text-cream cursor-pointer flex items-center gap-3 sm:gap-5 transition-all duration-300 shadow-md select-none"
              >
                {/* High quality dynamic glow circle relative to the spectrum */}
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: selectedSpectrum.accentColor }}
                />

                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-neutral-900 group-hover:bg-black flex items-center justify-center p-2 sm:p-2.5 transition-colors duration-300 border border-neutral-800"
                >
                  <img 
                    src={tech.iconUrl} 
                    alt={tech.name} 
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>

                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-sm tracking-widest text-neutral-400 uppercase font-mono font-bold leading-none mb-1 sm:mb-1.5">
                    {tech.category}
                  </span>
                  <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-cream animate-none">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ✉️ LET'S CONNECT SECTION */}
      <section 
        id="contact-section"
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-center py-12 md:py-16 lg:min-h-screen lg:h-screen relative z-10"
      >
        <div className="bg-neutral-950/80 border border-neutral-900 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-14 relative overflow-hidden backdrop-blur-md my-auto w-full">
          {/* Dynamic background lighting reflecting key selection */}
          <div 
            className="absolute right-0 bottom-0 w-96 h-96 rounded-full blur-[140px] opacity-[0.06] transition-all duration-1000"
            style={{ backgroundColor: selectedSpectrum.accentColor }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-start">
            <div className="lg:col-span-5 space-y-4 md:space-y-6">
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase block font-mono">03 // INQUIRIES & DEPLOYMENT</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-cream font-almarai">LET'S CONNECT</h2>
            </div>

            {/* Direct oversized contact terminals (LinkedIn and Email) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="block text-[10px] tracking-widest text-neutral-500 uppercase font-mono font-bold mb-4">
                DIRECT CHANNELS
              </span>

              {/* EMAIL */}
              <div className="group relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-neutral-900 bg-neutral-950/40 p-4 sm:p-6 rounded-2xl hover:border-neutral-800 hover:bg-neutral-950/80 transition-all duration-300">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-cream border border-neutral-800 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] tracking-wider text-neutral-500 uppercase font-mono block">SECURE EMAIL ADDRESS</span>
                    <span className="text-sm sm:text-base font-bold tracking-tight text-cream break-all">dinokrso02@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  <button 
                    onClick={() => copyToClipboard("dinokrso02@gmail.com", "Email")}
                    className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-cream transition-all border border-neutral-800/80 cursor-pointer"
                    title="Copy Email"
                  >
                    <Copy size={13} />
                  </button>
                  <a 
                    href="mailto:dinokrso02@gmail.com"
                    className="p-2.5 rounded-full bg-cream text-black hover:bg-white transition-all cursor-pointer flex items-center justify-center"
                    title="Send Email"
                  >
                    <ArrowRight size={13} className="group-hover:rotate-45 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* LINKEDIN */}
              <div className="group relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-neutral-900 bg-neutral-950/40 p-4 sm:p-6 rounded-2xl hover:border-neutral-800 hover:bg-neutral-950/80 transition-all duration-300">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-cream border border-neutral-800 transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] tracking-wider text-neutral-500 uppercase font-mono block">PROFESSIONAL DIRECTORY</span>
                    <span className="text-sm sm:text-base font-bold tracking-tight text-cream break-all leading-snug">
                      <span className="md:hidden">LinkedIn — Dino Kršo</span>
                      <span className="hidden md:inline">linkedin.com/in/dino-kršo-5ba153200</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  <button 
                    onClick={() => copyToClipboard("https://www.linkedin.com/in/dino-kr%C5%A1o-5ba153200/", "LinkedIn link")}
                    className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-cream transition-all border border-neutral-800/80 cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy size={13} />
                  </button>
                  <a 
                    href="https://www.linkedin.com/in/dino-kr%C5%A1o-5ba153200/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-cream text-black hover:bg-white transition-all cursor-pointer flex items-center justify-center"
                    title="Visit Profile"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>

      {/* Floating Clipboard notification toast */}
      <AnimatePresence>
        {clipboardNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 bg-neutral-900 border border-neutral-850 px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-2xl text-cream text-[11px] tracking-wider font-mono uppercase max-md:mx-auto max-md:max-w-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{clipboardNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 "JOIN THE LAB" APPLICATION DIALOG / PORTAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop opacity layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="relative w-full max-w-md overflow-hidden bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-cream font-almarai z-10"
            >
              {/* Close Button */}
              <button
                id="close-lab-modal"
                onClick={resetForm}
                className="absolute top-6 right-6 text-neutral-500 hover:text-cream transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full border border-neutral-800/80 flex items-center justify-center bg-black/20 hover:bg-neutral-900"
              >
                <X size={14} />
              </button>

              {!isSubmitSuccess ? (
                <div>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest text-neutral-500 uppercase mb-4">
                    <Sparkles size={11} className="text-amber-300 animate-pulse" />
                    <span>Prisma Laboratory Application</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-cream mb-2 leading-tight">
                    Join the Collective
                  </h3>
                  <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
                    Submit your details. Our curation panel reviews candidate portfolios weekly. Selected storytellers unlock workspace access.
                  </p>

                  <form onSubmit={handleJoinSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2 font-medium font-mono">
                        Your Practice / Core Medium
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "storyteller", label: "Storyteller", icon: Compass },
                          { id: "filmmaker", label: "Filmmaker", icon: Flame },
                          { id: "artist", label: "Visual Artist", icon: Palette },
                        ].map((role) => {
                          const IconComp = role.icon;
                          const isRoleSelected = formRole === role.id;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setFormRole(role.id)}
                              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                isRoleSelected
                                  ? "border-cream bg-neutral-900 text-cream"
                                  : "border-neutral-800 bg-neutral-900/20 text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300"
                              }`}
                            >
                              <IconComp size={16} className={isRoleSelected ? "text-cream" : "text-neutral-500"} />
                              <span className="text-[10px] font-medium tracking-wide">{role.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="modal-email-form" className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2 font-medium font-mono">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="modal-email-form"
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@yourdomain.com"
                        className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-cream placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-mono tracking-wide transition-all"
                      />
                    </div>

                    <button
                      id="submit-lab-application-form"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-cream text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white active:scale-99 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Processing application...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Application</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-cream text-black flex items-center justify-center mb-6 shadow-xl shadow-amber-950/20">
                    <Check size={28} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-cream mb-3 font-almarai">
                    Application Transmitted
                  </h3>
                  
                  <div className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-lg mb-6 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                    ROLE: {formRole} | {formEmail}
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-8">
                    Your inquiry has been successfully routed into the Prisma screening stack. Check your mailbox shortly for confirmation.
                  </p>

                  <button
                    id="finish-application-dismiss"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-cream text-[10px] tracking-widest uppercase rounded-full border border-neutral-800 transition-all cursor-pointer"
                  >
                    Return to canvas
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

