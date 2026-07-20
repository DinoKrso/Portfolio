/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FloatingStackItem {
  name: string;
  iconUrl: string;
}

interface FloatingStackProps {
  items: FloatingStackItem[];
  isMobile: boolean;
}

// Hand-placed slots around the hero title (kept clear of the centered text and CTA).
// depth: mouse-parallax strength; scatterX/Y: outward drift while scrolling the hero away.
const SLOTS = [
  { top: "16%", left: "8%", depth: 26, rotate: -6, scatterX: -170, scatterY: -90, floatDelay: 0, floatDuration: 5 },
  { top: "13%", right: "10%", depth: 34, rotate: 5, scatterX: 180, scatterY: -70, floatDelay: 1.1, floatDuration: 6 },
  { top: "42%", left: "4%", depth: 18, rotate: 3, scatterX: -200, scatterY: 20, floatDelay: 0.5, floatDuration: 5.5 },
  { top: "45%", right: "5%", depth: 24, rotate: -4, scatterX: 200, scatterY: 40, floatDelay: 1.8, floatDuration: 4.8 },
  { top: "56%", left: "6%", depth: 30, rotate: 6, scatterX: -150, scatterY: 110, floatDelay: 0.8, floatDuration: 6.2 },
  { top: "75%", right: "12%", depth: 20, rotate: -5, scatterX: 160, scatterY: 120, floatDelay: 2.2, floatDuration: 5.2 },
  { top: "84%", right: "26%", depth: 40, rotate: 2, scatterX: 110, scatterY: 150, floatDelay: 1.5, floatDuration: 5.8 },
] as const;

export default function FloatingStack({ items, isMobile }: FloatingStackProps) {
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scatterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const chipCount = isMobile ? 4 : SLOTS.length;
  const chips = items.slice(0, chipCount);

  // Mouse parallax: each chip drifts opposite the cursor at its own depth
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX / window.innerWidth) * 2 - 1;
      const moveY = (e.clientY / window.innerHeight) * 2 - 1;
      parallaxRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = SLOTS[i].depth;
        gsap.to(el, {
          x: -moveX * depth,
          y: -moveY * depth,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(parallaxRefs.current.filter(Boolean));
    };
  }, [isMobile, prefersReducedMotion]);

  // Scroll scatter: chips fly outward and fade as the hero is scrolled away
  useEffect(() => {
    if (prefersReducedMotion) return;
    const scroller = document.getElementById("main-scroll-container");
    const hero = document.getElementById("hero-section");
    if (!scroller || !hero) return;

    const tweens: gsap.core.Tween[] = [];
    scatterRefs.current.forEach((el, i) => {
      if (!el) return;
      tweens.push(
        gsap.to(el, {
          x: SLOTS[i].scatterX,
          y: SLOTS[i].scatterY,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            scroller,
            start: "top top",
            end: "bottom 35%",
            scrub: 0.6,
          },
        })
      );
    });

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none select-none max-[359px]:hidden" aria-hidden>
      {chips.map((item, i) => {
        const slot = SLOTS[i];
        return (
          <div
            key={item.name}
            ref={(el) => {
              scatterRefs.current[i] = el;
            }}
            className="absolute will-change-transform"
            style={{
              top: slot.top,
              left: "left" in slot ? slot.left : undefined,
              right: "right" in slot ? slot.right : undefined,
            }}
          >
            <div
              ref={(el) => {
                parallaxRefs.current[i] = el;
              }}
              className="will-change-transform"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: [0, -12, 0], rotate: [slot.rotate, slot.rotate + 4, slot.rotate] }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: slot.floatDuration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: slot.floatDelay,
                        }
                  }
                  style={{ rotate: slot.rotate }}
                  className={`flex items-center justify-center rounded-2xl bg-neutral-950/80 border border-neutral-800/70 backdrop-blur-sm shadow-[0_0_28px_rgba(225,224,204,0.06)] ${
                    isMobile ? "w-11 h-11 p-2" : "w-14 h-14 p-2.5 md:w-16 md:h-16 md:p-3"
                  }`}
                >
                  <img
                    src={item.iconUrl}
                    alt=""
                    title={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain opacity-90"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
