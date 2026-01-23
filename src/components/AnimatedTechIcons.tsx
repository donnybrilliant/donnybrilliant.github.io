import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { techIcons } from "@/data/techIcons";
import { AnimatedFloatingIcon, IconAnimationMode } from "@/components/AnimatedFloatingIcon";
import { AnimatedButton } from "@/components/AnimatedButton";
import { IconRain } from "@/components/IconRain";

const allModes: IconAnimationMode[] = ["glitch", "pulse", "bounce", "shake", "morph", "rainbow", "flip"];

const getRandomMode = () => allModes[Math.floor(Math.random() * allModes.length)];

interface AnimatedTechIconsProps {
  className?: string;
}

export const AnimatedTechIcons = ({ className = "" }: AnimatedTechIconsProps) => {
  const [activeMode, setActiveMode] = useState<IconAnimationMode>("default");
  const [chaosActive, setChaosActive] = useState(false);
  const [iconModes, setIconModes] = useState<Record<string, IconAnimationMode>>({});
  const [chaosTick, setChaosTick] = useState(0);
  const [scanlinesActive, setScanlinesActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Chaos mode: each icon gets its own random animation, changing at random intervals
  useEffect(() => {
    if (!chaosActive) {
      setIconModes({});
      return;
    }
    
    // Initialize all icons with random modes
    const initialModes: Record<string, IconAnimationMode> = {};
    techIcons.forEach(icon => {
      initialModes[icon.label] = getRandomMode();
    });
    setIconModes(initialModes);
    
    // Randomly change individual icons at staggered intervals
    const interval = setInterval(() => {
      setChaosTick(prev => prev + 1);
      // Each tick, randomly change 2-5 icons
      const numToChange = 2 + Math.floor(Math.random() * 4);
      const shuffled = [...techIcons].sort(() => Math.random() - 0.5);
      const toChange = shuffled.slice(0, numToChange);
      
      setIconModes(prev => {
        const updated = { ...prev };
        toChange.forEach(icon => {
          updated[icon.label] = getRandomMode();
        });
        return updated;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [chaosActive]);

  const handleModeChange = (mode: IconAnimationMode) => {
    setChaosActive(false);
    setActiveMode(mode);
  };

  const toggleChaos = () => {
    setChaosActive(prev => !prev);
  };

  const getIconMode = useCallback((label: string): IconAnimationMode => {
    if (chaosActive && iconModes[label]) {
      return iconModes[label];
    }
    return activeMode;
  }, [chaosActive, iconModes, activeMode]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ pointerEvents: 'none' }}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      
      {/* Icon rain background - hidden by default for minimal look */}
      {controlsVisible && <IconRain />}

      {/* Floating tech icons - subtle by default */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
        controlsVisible ? "opacity-100" : "opacity-30"
      }`}>
        {techIcons.map((tech, index) => (
          <AnimatedFloatingIcon
            key={tech.label}
            tech={tech}
            index={index}
            total={techIcons.length}
            animationMode={getIconMode(tech.label)}
          />
        ))}
      </div>

      {/* Scanlines overlay */}
      <div
        className={`absolute inset-0 scanlines transition-opacity pointer-events-none ${
          scanlinesActive ? "opacity-30" : "opacity-0"
        }`}
      />

      {/* Controls container - toggle button and control buttons in same container */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-8 md:pb-12" style={{ pointerEvents: 'auto' }}>
        <div className="flex flex-col items-center gap-4">
          {/* Toggle button - always visible */}
          <motion.button
            className={`px-4 py-2 bg-card/80 backdrop-blur rounded-full border border-border text-sm font-pixel text-foreground hover:bg-card transition-colors flex items-center gap-2 ${
              !controlsVisible ? 'mb-4' : ''
            }`}
            onClick={() => setControlsVisible(!controlsVisible)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon icon={controlsVisible ? "mdi:eye-off" : "mdi:eye"} className="w-4 h-4" />
            <span className="hidden sm:inline">{controlsVisible ? "Hide Controls" : "Show Controls"}</span>
          </motion.button>

          {/* Control buttons - Single row at bottom */}
          {controlsVisible && (
            <motion.div
              className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
          <AnimatedButton 
            animation="glitch" 
            color="primary"
            onClick={() => handleModeChange("glitch")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:flash" className="w-4 h-4" />
              <span className="hidden sm:inline">GLITCH</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="pulse" 
            color="secondary"
            onClick={() => handleModeChange("pulse")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:coffee-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">PULSE</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="bounce" 
            color="tertiary"
            onClick={() => handleModeChange("bounce")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:rocket-launch" className="w-4 h-4" />
              <span className="hidden sm:inline">BOUNCE</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="shake" 
            color="quad"
            onClick={() => handleModeChange("shake")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:bug-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">SHAKE</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="morph" 
            color="accent"
            onClick={() => handleModeChange("morph")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:star-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">MORPH</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="rainbow" 
            color="primary"
            onClick={() => handleModeChange("rainbow")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:palette-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">RAINBOW</span>
            </span>
          </AnimatedButton>
          
          <AnimatedButton 
            animation="flip" 
            color="secondary"
            onClick={() => handleModeChange("flip")}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:rotate-3d-variant" className="w-4 h-4" />
              <span className="hidden sm:inline">FLIP</span>
            </span>
          </AnimatedButton>

          <AnimatedButton 
            animation={chaosActive ? "rainbow" : "shake"} 
            color="quad"
            onClick={toggleChaos}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:fire" className="w-4 h-4" />
              <span className="hidden sm:inline">{chaosActive ? "STOP CHAOS" : "CHAOS"}</span>
            </span>
          </AnimatedButton>

          <AnimatedButton 
            animation="pulse" 
            color="accent"
            onClick={() => setScanlinesActive(!scanlinesActive)}
          >
            <span className="flex items-center gap-2">
              <Icon icon={scanlinesActive ? "mdi:grid" : "mdi:grid-off"} className="w-4 h-4" />
              <span className="hidden sm:inline">{scanlinesActive ? "LINES" : "NO LINES"}</span>
            </span>
          </AnimatedButton>

          {/* Reset button - rightmost, red, with stop icon */}
          <motion.button
            className="px-6 py-3 font-pixel text-sm md:text-base font-bold rounded-lg transition-all duration-300 bg-destructive text-destructive-foreground shadow-lg hover:shadow-[0_0_50px_hsl(var(--destructive)/0.8)] hover:scale-105 active:scale-95 flex items-center gap-2"
            onClick={() => handleModeChange("default")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="mdi:stop" className="w-4 h-4" />
            <span className="hidden sm:inline">RESET</span>
          </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
