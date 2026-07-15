import type { Transition, Variants } from "framer-motion";

/** Soft restaurant ease — gentle deceleration */
export const softEase = [0.22, 1, 0.36, 1] as const;

export const softSpring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.9,
};

export const softTween = (delay = 0, duration = 0.75): Transition => ({
  duration,
  delay,
  ease: softEase,
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: softTween(0, 0.8),
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: softTween(0, 0.9),
  },
};

export const slideBrand: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: softTween(0, 0.85),
  },
};

export const heroStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.28,
    },
  },
};

export const bookStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

export const chipStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.028,
      delayChildren: 0.06,
    },
  },
};

export const chipItem: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: softSpring,
  },
};

export const stepPanel: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: softTween(0, 0.55),
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(6px)",
    transition: softTween(0, 0.32),
  },
};

export const floatSoft = {
  y: [0, -7, 0],
  transition: {
    duration: 5.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const driftBlob = (duration: number, x: number[], y: number[]) => ({
  x,
  y,
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    repeatType: "mirror" as const,
  },
});
