import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import terminalIcon from "@iconify-icons/fa6-solid/terminal";
import houseIcon from "@iconify-icons/fa6-solid/house";
import packageIcon from "@iconify-icons/codicon/package";

interface Window {
  id: string;
  title: string;
  isMinimized: boolean;
}

interface TaskbarProps {
  windows: Window[];
  onWindowClick: (id: string) => void;
  onHomeClick: () => void;
}

export const Taskbar = ({ windows, onWindowClick, onHomeClick }: TaskbarProps) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "terminal":
        return <Icon icon={terminalIcon} className="w-4 h-4" />;
      case "packageJson":
        return <Icon icon={packageIcon} className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="taskbar">
      <motion.button
        className="taskbar-item flex items-center gap-2"
        onClick={onHomeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon={houseIcon} className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </motion.button>

      <div className="h-6 w-px bg-window-border mx-2" />

      <AnimatePresence>
        {windows.map((window) => (
          <motion.button
            key={window.id}
            className={`taskbar-item flex items-center gap-2 ${
              !window.isMinimized ? "taskbar-item-active" : ""
            }`}
            onClick={() => onWindowClick(window.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getIcon(window.id)}
            <span className="hidden sm:inline">{window.title}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      <div className="flex-1" />

      <div className="font-pixel text-xs text-window-header-foreground hidden sm:block">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
};
