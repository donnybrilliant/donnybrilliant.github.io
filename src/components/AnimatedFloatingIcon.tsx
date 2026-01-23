import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import type { TechIcon } from "@/data/techIcons";

export type IconAnimationMode = "default" | "glitch" | "pulse" | "bounce" | "shake" | "morph" | "rainbow" | "flip";

interface AnimatedFloatingIconProps {
  tech: TechIcon;
  index: number;
  total: number;
  animationMode: IconAnimationMode;
}

const getAnimationProps = (mode: IconAnimationMode, randomDelay: number) => {
  switch (mode) {
    case "glitch":
      return {
        x: [0, -8, 8, -8, 8, 0],
        y: [0, 8, -8, 8, -8, 0],
        opacity: [1, 0.3, 1, 0.5, 1],
        scale: 1,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 0.3, repeat: Infinity, ease: "linear" as const, delay: randomDelay * 0.03 }
      };
    case "pulse":
      return {
        scale: [1, 1.8, 1],
        opacity: [0.6, 1, 0.6],
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const, delay: randomDelay * 0.08 }
      };
    case "bounce":
      return {
        y: [0, -50, 0],
        scale: [1, 1.3, 1],
        opacity: 1,
        x: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const, delay: randomDelay * 0.06 }
      };
    case "shake":
      return {
        rotate: [0, -25, 25, -25, 25, 0],
        x: [0, -5, 5, -5, 5, 0],
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 0.35, repeat: Infinity, ease: "linear" as const, delay: randomDelay * 0.04 }
      };
    case "morph":
      return {
        scale: [1, 1.5, 0.7, 1.3, 1],
        rotate: [0, 90, 180, 270, 360],
        opacity: 1,
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const, delay: randomDelay * 0.15 }
      };
    case "rainbow":
      return {
        filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
        scale: [1, 1.2, 1],
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        transition: { duration: 1.5, repeat: Infinity, ease: "linear" as const, delay: randomDelay * 0.08 }
      };
    case "flip":
      return {
        rotateY: [0, 180, 360],
        rotateX: [0, 90, 0],
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const, delay: randomDelay * 0.08 }
      };
    default:
      return {
        opacity: [0.5, 0.9, 0.5],
        scale: [1, 1.1, 1],
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "hue-rotate(0deg)",
        transition: { duration: 3 + randomDelay, repeat: Infinity, ease: "easeInOut" as const }
      };
  }
};

export const AnimatedFloatingIcon = ({ tech, index, total, animationMode }: AnimatedFloatingIconProps) => {
  // Distribute icons in a circular pattern
  const angle = (index / total) * Math.PI * 2;
  const radius = 30 + (index % 3) * 12;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;

  const randomDelay = index * 0.15;
  const animateProps = getAnimationProps(animationMode, randomDelay);

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transformStyle: "preserve-3d",
      }}
      animate={animateProps}
      whileHover={{ 
        scale: 2.5, 
        opacity: 1,
        zIndex: 50,
        filter: "hue-rotate(0deg) drop-shadow(0 0 20px currentColor)",
        transition: { duration: 0.2 }
      }}
    >
      <Icon 
        icon={tech.icon}
        className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg"
        style={{ color: tech.color }}
      />
      <motion.span 
        className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-xs font-pixel opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none"
        style={{ color: tech.color }}
      >
        {tech.label}
      </motion.span>
    </motion.div>
  );
};
