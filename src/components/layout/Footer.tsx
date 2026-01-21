import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import terminalIcon from "@iconify-icons/fa6-solid/terminal";
import folderOpenIcon from "@iconify-icons/fa6-solid/folder-open";
import packageIcon from "@iconify-icons/codicon/package";
import { ThemeSlider } from "@/components/ThemeSlider";
import type { WindowState } from "@/context/WindowContext";

interface FooterProps {
  openWindows: WindowState[];
  onToggleWindow: (id: string) => void;
}

export const Footer = ({ openWindows, onToggleWindow }: FooterProps) => {
  return (
    <footer className="footer fixed bottom-0 left-0 right-0 bg-background dark-surface flex items-center px-4 z-40 gap-4">
      <a href="#home" className="font-pixel text-sm link-fill shrink-0">
        vierweb.no
      </a>

      <div className="h-6 w-px bg-current opacity-30" />

      {/* Open Windows Tabs - animate container on tiny screens */}
      <AnimatePresence mode="wait">
        {openWindows.length > 0 && (
          <motion.div
            className="taskbar-container flex-1 flex items-center gap-2 overflow-x-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <AnimatePresence>
              {openWindows.map((window) => (
                <motion.button
                  key={window.id}
                  className={`taskbar-item flex items-center gap-2 ${
                    !window.isMinimized ? "taskbar-item-active" : ""
                  }`}
                  onClick={() => onToggleWindow(window.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  {window.id === "terminal" && <Icon icon={terminalIcon} className="w-4 h-4" />}
                  {window.id === "packageJson" && <Icon icon={packageIcon} className="w-4 h-4" />}
                  {window.id.startsWith("project-") && (
                    <Icon icon={folderOpenIcon} className="w-4 h-4" />
                  )}
                  <span className="taskbar-item-text text-xs font-pixel truncate max-w-[100px]">
                    {window.title}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer when no windows */}
      {openWindows.length === 0 && <div className="flex-1" />}

      <div className="h-6 w-px bg-current opacity-30 ml-1" />

      <ThemeSlider />
    </footer>
  );
};
