"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  amount?: number;
}

export default function ScrollAnimation({
  children,
  delay = 0,
  duration = 0.8,
  direction = "up",
  className = "",
  amount = 30
}: ScrollAnimationProps) {
  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: amount };
      case "down": return { opacity: 0, y: -amount };
      case "left": return { opacity: 0, x: amount };
      case "right": return { opacity: 0, x: -amount };
      case "none": return { opacity: 0 };
      default: return { opacity: 0, y: amount };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextAnimation({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
