/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ items, reverse = false, className = "" }: MarqueeProps) {
  const strip = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <React.Fragment key={item}>
          <span className="mx-5 sm:mx-7 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/60 whitespace-nowrap">
            {item}
          </span>
          <span className="text-amber-200/50 text-[10px]">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`marquee w-full overflow-hidden border-y border-neutral-900/60 py-3.5 sm:py-4 relative z-10 ${className}`}
    >
      <div className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}>
        {strip(false)}
        {strip(true)}
      </div>
    </motion.div>
  );
}
