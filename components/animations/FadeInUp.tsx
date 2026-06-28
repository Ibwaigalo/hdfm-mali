"use client";
import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  style?: CSSProperties;
  className?: string;
  as?: "div" | "section" | "article";
}

export default function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  distance = 30,
  style,
  className,
  as = "div",
}: FadeInUpProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      style={style}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
