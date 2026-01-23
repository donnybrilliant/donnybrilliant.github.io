import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { techIcons } from "@/data/techIcons";
import { useMemo } from "react";

export const IconRain = () => {
  const rainIcons = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const tech = techIcons[i % techIcons.length];
      return {
        ...tech,
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15,
        size: 16 + Math.random() * 16,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {rainIcons.map((item) => (
        <motion.div
          key={item.id}
          className="absolute opacity-20"
          style={{
            left: `${item.x}%`,
            width: item.size,
            height: item.size,
          }}
          initial={{ y: "-10%", rotate: 0 }}
          animate={{
            y: "110vh",
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          <Icon
            icon={item.icon}
            className="w-full h-full"
            style={{ color: item.color }}
          />
        </motion.div>
      ))}
    </div>
  );
};
