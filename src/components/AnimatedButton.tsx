import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType = "glitch" | "pulse" | "bounce" | "shake" | "morph" | "rainbow" | "flip";

interface AnimatedButtonProps {
  children: ReactNode;
  animation: AnimationType;
  color: "primary" | "secondary" | "tertiary" | "quad" | "accent";
  onClick?: () => void;
}

const colorClasses = {
  primary: "bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--primary)/0.8)]",
  secondary: "bg-secondary text-secondary-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--secondary)/0.8)]",
  tertiary: "bg-tertiary text-tertiary-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--tertiary)/0.8)]",
  quad: "bg-quad text-quad-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--quad)/0.8)]",
  accent: "bg-accent text-accent-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--accent)/0.8)]",
};

const animationVariants: Record<AnimationType, Variants> = {
  glitch: {
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 2, -2, 2, -2, 0],
      transition: { duration: 0.3, repeat: Infinity }
    }
  },
  pulse: {
    hover: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: Infinity }
    }
  },
  bounce: {
    hover: {
      y: [0, -10, 0],
      transition: { duration: 0.4, repeat: Infinity }
    }
  },
  shake: {
    hover: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4, repeat: Infinity }
    }
  },
  morph: {
    hover: {
      borderRadius: ["12px", "20px 8px 20px 8px", "8px 20px 8px 20px", "12px"],
      transition: { duration: 1, repeat: Infinity }
    }
  },
  rainbow: {
    hover: {
      filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
      transition: { duration: 1, repeat: Infinity, ease: "linear" as const }
    }
  },
  flip: {
    hover: {
      rotateY: [0, 180, 360],
      transition: { duration: 0.8, repeat: Infinity }
    }
  }
};

export const AnimatedButton = ({ children, animation, color, onClick }: AnimatedButtonProps) => {
  return (
    <motion.button
      className={`
        px-6 py-3 font-pixel text-sm md:text-base font-bold rounded-lg
        transition-all duration-300 relative overflow-hidden
        ${colorClasses[color]}
      `}
      variants={animationVariants[animation]}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ perspective: "400px" }}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Glitch effect overlay for glitch animation */}
      {animation === "glitch" && (
        <>
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-pixel font-bold opacity-0"
            style={{ color: "hsl(var(--primary))", clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
            whileHover={{ opacity: 0.5, x: -2 }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-pixel font-bold opacity-0"
            style={{ color: "hsl(var(--secondary))", clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
            whileHover={{ opacity: 0.5, x: 2 }}
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.button>
  );
};
