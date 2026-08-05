"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ value, label, suffix = "", duration = 2 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalFrames = Math.round(duration * 60);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      // easeOutExpo
      const currentVal = end * (1 - Math.pow(2, -10 * progress));
      
      if (currentFrame === totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.round(currentVal));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-center p-6 bg-card/40 rounded-2xl border border-border">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 mb-2"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
