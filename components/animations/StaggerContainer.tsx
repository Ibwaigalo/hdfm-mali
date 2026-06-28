"use client";
import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  style?: CSSProperties;
  className?: string;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.06,
  style,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
