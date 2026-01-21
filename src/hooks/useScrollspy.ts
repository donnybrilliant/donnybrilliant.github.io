import { useState, useEffect } from "react";

export function useScrollspy(sectionIds: string[], offset = 64) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      let currentSection = "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - offset;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // Initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
