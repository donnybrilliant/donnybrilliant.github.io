import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sectionIds = ["home", "projects", "about", "contact"];

interface NavbarProps {
  activeSection: string | null;
}

export const Navbar = ({ activeSection }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background dark-surface h-16 flex items-center justify-end px-4 md:px-8 z-40">
      {/* Hamburger Menu for very small screens */}
      <div className="hidden max-[286px]:block">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          <div className="hamburger-bar" />
          <div className="hamburger-bar" />
          <div className="hamburger-bar" />
        </button>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="mobile-nav fixed top-16 right-0 left-0 dark-surface"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ul className="flex flex-col p-4 gap-4 font-pixel text-xl">
                {sectionIds.map((section) => (
                  <li key={section}>
                    <a
                      href={`#${section}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`link-fill capitalize transition-all ${
                        activeSection === section
                          ? "underline underline-offset-4"
                          : ""
                      }`}
                      aria-current={
                        activeSection === section ? "page" : undefined
                      }
                    >
                      {section}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Regular nav for larger screens */}
      <nav className="max-[286px]:hidden">
        <ul className="flex gap-4 md:gap-8 font-pixel text-xs min-[355px]:text-base md:text-xl">
          {sectionIds.map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`link-fill capitalize transition-all ${
                  activeSection === section ? "underline underline-offset-4" : ""
                }`}
                aria-current={activeSection === section ? "page" : undefined}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

