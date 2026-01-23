import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { techIcons } from "@/data/techIcons";

export const OrbitingIcons = () => {
  // Use subset of icons for orbiting effect
  const orbitIcons = techIcons.slice(0, 8);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {orbitIcons.map((tech, index) => {
        const orbitDuration = 20 + index * 5;
        const orbitRadius = 180 + index * 30;
        const startAngle = (index / orbitIcons.length) * 360;

        return (
          <motion.div
            key={tech.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: orbitDuration,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformOrigin: "center center",
            }}
          >
            <motion.div
              className="absolute"
              style={{
                left: `${orbitRadius}px`,
                transform: `rotate(${startAngle}deg)`,
              }}
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: orbitDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Icon
                icon={tech.icon}
                className="w-6 h-6 md:w-8 md:h-8 opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: tech.color }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
