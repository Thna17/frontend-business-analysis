"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const pageTransitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.992 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0.16, ease: "linear" } : { duration: 0.42, ease: pageTransitionEase }}
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  );
}
