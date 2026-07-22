/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingStack from "./components/FloatingStack.tsx";
import Marquee from "./components/Marquee.tsx";

const Room3DBg = lazy(() => import("./components/Room3DBg.tsx"));
import {
  ArrowRight,
  Linkedin,
  Mail,
  ExternalLink,
  Copy
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Section-jump nav links, in scroll order
interface NavLink {
  label: string;
  sectionId: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", sectionId: "hero-section" },
  { label: "Experience", sectionId: "experience-section" },
  { label: "Tech Stack", sectionId: "tech-section" },
  { label: "Contact", sectionId: "contact-section" },
];

// Ticker strip content between sections
const MARQUEE_ITEMS = [
  "Full-Stack Developer",
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "MongoDB",
  "Tailwind CSS",
  "AWS",
  "WordPress",
  "SEO",
];

// Scroll-illuminated manifesto, revealed word by word while pinned
const STATEMENT =
  "I design and build fast, cinematic web experiences, from first pixel to production, that turn ideas into products people remember.";

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

// Letter-by-letter heading reveal on scroll, same motion language as the hero title
function SplitHeading({ text, className }: { text: string; className?: string }) {
  return (
    <h2 className={className} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ y: 26, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: i * 0.035, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </h2>
  );
}

// Mono section label that slides in
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-[10px] tracking-widest text-neutral-500 uppercase block font-mono mb-2"
    >
      {children}
    </motion.span>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero-section");
  const [selectedSpectrum] = useState<ThemeSpectrum>(SPECTRUNS[0]);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);

  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Refs driven by the GSAP scroll choreography
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroHintRef = useRef<HTMLDivElement>(null);
  const statementWrapRef = useRef<HTMLElement>(null);
  const statementWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const galleryWrapRef = useRef<HTMLElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Highlight the nav link for whichever section crosses the viewport's center band
  useEffect(() => {
    const scroller = document.getElementById("main-scroll-container");
    if (!scroller) return;

    const sectionEls = NAV_LINKS.map((link) => document.getElementById(link.sectionId)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: scroller, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll choreography: pinned hero zoom-through, word-by-word manifesto,
  // horizontal project gallery, scrubbed tech chips, contact rise
  useEffect(() => {
    if (prefersReducedMotion) return;
    const scroller = document.getElementById("main-scroll-container");
    if (!scroller) return;

    const ctx = gsap.context(() => {
      // Thin progress line under the nav, tracking the full journey
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { scroller, start: 0, end: "max", scrub: 0.3 },
          }
        );
      }

      // Act 1 — hero: title zooms through the viewer and fades while pinned
      if (heroWrapRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroWrapRef.current,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });
        if (heroTitleRef.current) {
          heroTl.to(
            heroTitleRef.current,
            { scale: 2.05, yPercent: -16, opacity: 0, ease: "power1.in" },
            0
          );
        }
        if (heroCtaRef.current) {
          heroTl.to(heroCtaRef.current, { opacity: 0, y: 60, ease: "none" }, 0);
        }
        if (heroHintRef.current) {
          heroTl.to(heroHintRef.current, { opacity: 0, ease: "none" }, 0);
        }
      }

      // Act 2 — manifesto: each word illuminates in order while the section is pinned
      const words = statementWordRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null
      );
      if (statementWrapRef.current && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: statementWrapRef.current,
              scroller,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          }
        );
      }

      // Act 3 — experience: vertical scroll drives the gallery sideways.
      // Mobile skips this entirely — the pinned 400vh + sticky + scrub combo is
      // fragile on mobile browsers (address-bar resize, touch-scroll conflicts),
      // so mobile gets a plain native horizontal-swipe gallery instead (see JSX).
      if (galleryWrapRef.current && galleryTrackRef.current && !isMobile) {
        const track = galleryTrackRef.current;
        gsap.to(track, {
          x: () => -(track.scrollWidth - scroller.clientWidth + 48),
          ease: "none",
          scrollTrigger: {
            trigger: galleryWrapRef.current,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }

      // Act 4 — tech chips slide in from alternating sides, scrubbed to scroll
      gsap.utils.toArray<HTMLElement>(".tech-chip").forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -120 : 120,
          opacity: 0,
          rotate: i % 2 === 0 ? -6 : 6,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top 96%",
            end: "top 62%",
            scrub: 0.5,
          },
        });
      });

      // Act 5 — contact card rises and settles as it enters
      if (contactCardRef.current) {
        gsap.from(contactCardRef.current, {
          y: 120,
          scale: 0.94,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: contactCardRef.current,
            scroller,
            start: "top 95%",
            end: "top 55%",
            scrub: 0.5,
          },
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, scroller);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  // Split-word letters array for animating "Hi, Im Dino"
  const titleLetters = Array.from("Hi, Im Dino");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setClipboardNotice(`Copied ${label} to clipboard`);
    setTimeout(() => setClipboardNotice(null), 3000);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-[100dvh] md:h-screen w-full bg-black text-cream font-almarai relative overflow-hidden flex flex-col selection:bg-amber-100 selection:text-black">
      {/* Scroll-choreographed 3D developer room background */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black" />}>
        <Room3DBg />
      </Suspense>

      {/* Journey progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none">
        <div ref={progressBarRef} className="h-full w-full bg-cream/70 origin-left scale-x-0" />
      </div>

      {/* Section navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-3 sm:pt-4 px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-md border border-neutral-800/60 rounded-full px-2 py-2 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => scrollToSection(link.sectionId)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeSection === link.sectionId
                  ? "bg-cream text-black font-bold"
                  : "text-neutral-400 hover:text-cream"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

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
        {/* ═══ ACT 1 — HERO: pinned intro, title zooms through the viewer on scroll ═══ */}
        <section
          id="hero-section"
          ref={heroWrapRef}
          className="relative h-[220vh] w-full flex-shrink-0 z-10"
        >
          <div className="sticky top-0 h-[100dvh] md:h-screen w-full p-3 sm:p-4 md:p-6">
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden bg-transparent border border-neutral-900/40 flex flex-col justify-between p-4 sm:p-8 md:p-16">

              {/* Floating tech "ingredients" drifting around the title with parallax + scroll scatter */}
              <FloatingStack items={TECH_STACK_ITEMS} isMobile={isMobile} />

              {/* TOP STATUS SPACER */}
              <div className="w-full h-4 md:h-8 z-10 pt-2 md:pt-4" />

              {/* 🅰️ CENTERED MAIN HERO TITLE */}
              <div className="my-auto flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto px-2 py-6 sm:py-10 z-10">

                {/* Chromatic aberration interactive heading — GSAP scales this wrapper on scroll */}
                <div
                  ref={heroTitleRef}
                  onMouseEnter={() => setIsHoveringTitle(true)}
                  onMouseLeave={() => setIsHoveringTitle(false)}
                  className="relative cursor-default select-none mb-5 sm:mb-10 group w-full will-change-transform"
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
                        {char === " " ? " " : char}
                      </motion.span>
                    ))}
                  </h1>
                </div>

                {/* 🔘 CTA BUTTON ("explore") — fades out while the title zooms */}
                <div ref={heroCtaRef}>
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
                      className="group flex items-center gap-3 px-6 py-3 rounded-full bg-cream text-black font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-500 hover:gap-4 hover:shadow-[0_0_30px_rgba(225,224,204,0.15)] active:scale-95 cursor-pointer font-semibold shadow-2xl"
                    >
                      <span className="relative block overflow-hidden h-[1.3em]">
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                          explore
                        </span>
                        <span
                          aria-hidden
                          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                        >
                          explore
                        </span>
                      </span>
                      <div className="bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45">
                        <ArrowRight size={16} className="text-cream" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Scroll hint */}
              <div
                ref={heroHintRef}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
              >
                <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-neutral-500">
                  Scroll
                </span>
                <motion.div
                  animate={prefersReducedMotion ? undefined : { y: [0, 8, 0], opacity: [0.7, 0.2, 0.7] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="w-px h-8 bg-cream/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Skills ticker strip */}
        <Marquee items={MARQUEE_ITEMS} className="flex-shrink-0" />

        {/* ═══ ACT 2 — MANIFESTO: pinned statement, words illuminate as you scroll ═══ */}
        <section
          ref={statementWrapRef}
          className="relative h-[240vh] w-full flex-shrink-0 z-10"
        >
          <div className="sticky top-0 h-[100dvh] md:h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 md:px-24">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-6 md:mb-10">
              01 // MANIFEST
            </span>
            <p className="max-w-5xl text-center font-almarai font-extrabold tracking-tight leading-[1.15] text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-cream">
              {STATEMENT.split(" ").map((word, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    statementWordRefs.current[i] = el;
                  }}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* ═══ ACT 3 — EXPERIENCE: vertical scroll drives a horizontal project gallery on desktop;
             mobile gets a plain native horizontal-swipe row (pinned-scrub is fragile on mobile) ═══ */}
        <section
          id="experience-section"
          ref={galleryWrapRef}
          className={`relative w-full flex-shrink-0 z-10 ${isMobile ? "" : "h-[400vh]"}`}
        >
          <div
            className={`w-full flex flex-col justify-center ${
              isMobile ? "py-14" : "sticky top-0 h-[100dvh] md:h-screen overflow-hidden"
            }`}
          >
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 mb-8 md:mb-12">
              <SectionLabel>02 // SELECTED WORK</SectionLabel>
              <SplitHeading
                text="EXPERIENCE"
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream font-almarai"
              />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="mt-4 h-px bg-cream/25 origin-left"
              />
            </div>

            {/* Horizontal track — GSAP translates it on desktop; native swipe-scroll on mobile */}
            <div
              ref={galleryTrackRef}
              className={`flex items-stretch gap-4 md:gap-6 pl-4 sm:pl-8 md:pl-16 ${
                isMobile
                  ? "w-full overflow-x-auto pr-4 pb-2 snap-x snap-proximity [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "w-max will-change-transform"
              }`}
            >
              {EXPERIENCE_ITEMS.map((item, idx) => {
                const CardTag = item.link ? "a" : "div";
                return (
                  <CardTag
                    key={item.id}
                    {...(item.link
                      ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-950 border border-neutral-800/60 w-[76vw] sm:w-[400px] md:w-[460px] h-[52vh] md:h-[56vh] shrink-0 flex flex-col justify-between p-4 sm:p-6 cursor-pointer select-none no-underline text-inherit transition-colors duration-500 hover:border-neutral-600/80 ${
                      isMobile ? "snap-center" : ""
                    }`}
                  >
                    {/* Absolute Image Background */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                      <img
                        src={item.imageUrl}
                        alt={`${item.title} - ${item.subtitle}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] brightness-[0.65] group-hover:brightness-[0.8] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/10 opacity-95" />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: selectedSpectrum.accentColor }}
                      />
                    </div>

                    {/* TOP badge row */}
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="font-mono text-[11px] tracking-widest text-amber-200/90 font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-neutral-400 group-hover:text-cream transition-colors uppercase">
                        Ref-{(idx + 104).toString(16).toUpperCase()}
                      </span>
                    </div>

                    {/* BOTTOM detail header */}
                    <div className="relative z-10 mt-auto">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs tracking-widest text-amber-100/90 font-mono uppercase mb-1 font-semibold break-words">
                            {item.subtitle}
                          </p>
                          <h3 className="font-almarai font-extrabold tracking-tight text-white text-lg sm:text-xl md:text-2xl break-words">
                            {item.title}
                          </h3>
                        </div>

                        {item.link && (
                          <div className="shrink-0 text-cream/90 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800/80 text-[9px] md:text-[8px] font-mono tracking-wider opacity-0 translate-y-3 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500">
                            <span>ACTIVE VIEW</span>
                            <ArrowRight size={8} className="text-amber-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardTag>
                );
              })}

              {/* Gallery end card — invitation to connect */}
              <div
                className={`relative rounded-2xl md:rounded-3xl border border-dashed border-neutral-800 w-[60vw] sm:w-[320px] shrink-0 flex flex-col items-center justify-center gap-4 p-6 text-center ${
                  isMobile ? "snap-center" : ""
                }`}
              >
                <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                  Your project here?
                </span>
                <button
                  onClick={() => scrollToSection("contact-section")}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream text-black text-[11px] font-bold tracking-widest uppercase cursor-pointer transition-all duration-300 hover:gap-3 active:scale-95"
                >
                  <span>Let's talk</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Drag hint */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 mt-8 md:mt-10 flex items-center gap-3">
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-neutral-600">
                {isMobile ? "Swipe to explore" : "Keep scrolling"}
              </span>
              <ArrowRight size={10} className="text-neutral-600" />
            </div>
          </div>
        </section>

        {/* Skills ticker strip, reversed direction */}
        <Marquee items={MARQUEE_ITEMS} reverse className="flex-shrink-0" />

        {/* ═══ ACT 4 — TECH STACK: chips scrub in from the sides ═══ */}
        <section
          id="tech-section"
          className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-center pt-16 md:pt-24 pb-12 md:pb-16 lg:min-h-screen flex-shrink-0 relative z-10"
        >
          <div className="relative flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-4 md:pb-6 mb-8 md:mb-12 flex-shrink-0">
            <div>
              <SectionLabel>03 // TOOLKIT</SectionLabel>
              <SplitHeading text="Tech Stack" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream font-almarai" />
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute bottom-[-1px] left-0 right-0 h-px bg-cream/25 origin-left"
            />
          </div>

          {/* Bubbly interactive node cloud layout */}
          <div className="relative py-8 md:py-14 px-4 sm:px-6 md:px-10 rounded-2xl md:rounded-3xl bg-neutral-950/40 border border-neutral-900/60 overflow-hidden flex flex-col md:flex-row md:flex-wrap justify-center items-stretch md:items-center gap-3 sm:gap-5 md:gap-8 min-h-0 md:min-h-[420px] my-auto">
            {/* Subtle grid backing for the bubbly cloud */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

            {TECH_STACK_ITEMS.map((tech) => {
              return (
                <div key={tech.name} className="tech-chip relative z-10 w-full md:w-auto will-change-transform">
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
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ ACT 5 — LET'S CONNECT ═══ */}
        <section
          id="contact-section"
          className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-center py-12 md:py-16 lg:min-h-screen flex-shrink-0 relative z-10"
        >
          <div
            ref={contactCardRef}
            className="bg-neutral-950/80 border border-neutral-900 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-14 relative overflow-hidden backdrop-blur-md my-auto w-full will-change-transform"
          >
            {/* Dynamic background lighting reflecting key selection */}
            <div
              className="absolute right-0 bottom-0 w-96 h-96 rounded-full blur-[140px] opacity-[0.06] transition-all duration-1000"
              style={{ backgroundColor: selectedSpectrum.accentColor }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-start">
              <div className="lg:col-span-5 space-y-4 md:space-y-6">
                <SectionLabel>04 // INQUIRIES & DEPLOYMENT</SectionLabel>
                <SplitHeading text="LET'S CONNECT" className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-cream font-almarai" />
              </div>

              {/* Direct oversized contact terminals (LinkedIn and Email) */}
              <div className="lg:col-span-7 space-y-4">
                <span className="block text-[10px] tracking-widest text-neutral-500 uppercase font-mono font-bold mb-4">
                  DIRECT CHANNELS
                </span>

                {/* EMAIL */}
                <motion.div
                  initial={{ opacity: 0, x: 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-neutral-900 bg-neutral-950/40 p-4 sm:p-6 rounded-2xl hover:border-neutral-800 hover:bg-neutral-950/80 transition-all duration-300"
                >
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
                      aria-label="Copy email address to clipboard"
                    >
                      <Copy size={13} />
                    </button>
                    <a
                      href="mailto:dinokrso02@gmail.com"
                      className="group/btn p-2.5 rounded-full bg-cream text-black hover:bg-white transition-all cursor-pointer flex items-center justify-center"
                      title="Send Email"
                      aria-label="Send email"
                    >
                      <span className="relative block w-[13px] h-[13px] overflow-hidden">
                        <ArrowRight
                          size={13}
                          className="absolute inset-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-full group-hover/btn:-translate-y-full"
                        />
                        <ArrowRight
                          size={13}
                          aria-hidden
                          className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
                        />
                      </span>
                    </a>
                  </div>
                </motion.div>

                {/* LINKEDIN */}
                <motion.div
                  initial={{ opacity: 0, x: 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-neutral-900 bg-neutral-950/40 p-4 sm:p-6 rounded-2xl hover:border-neutral-800 hover:bg-neutral-950/80 transition-all duration-300"
                >
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
                      aria-label="Copy LinkedIn profile link to clipboard"
                    >
                      <Copy size={13} />
                    </button>
                    <a
                      href="https://www.linkedin.com/in/dino-kr%C5%A1o-5ba153200/"
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn p-2.5 rounded-full bg-cream text-black hover:bg-white transition-all cursor-pointer flex items-center justify-center"
                      title="Visit Profile"
                      aria-label="Visit LinkedIn profile"
                    >
                      <span className="relative block w-[13px] h-[13px] overflow-hidden">
                        <ExternalLink
                          size={13}
                          className="absolute inset-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-full group-hover/btn:-translate-y-full"
                        />
                        <ExternalLink
                          size={13}
                          aria-hidden
                          className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
                        />
                      </span>
                    </a>
                  </div>
                </motion.div>
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
    </div>
  );
}
