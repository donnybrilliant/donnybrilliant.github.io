import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import xmarkIcon from "@iconify-icons/fa6-solid/xmark";
import expandIcon from "@iconify-icons/fa6-solid/expand";
import githubIcon from "@iconify-icons/fa6-brands/github";
import globeIcon from "@iconify-icons/fa6-solid/globe";
import codeIcon from "@iconify-icons/fa6-solid/code";
import lightbulbIcon from "@iconify-icons/fa6-solid/lightbulb";
import triangleExclamationIcon from "@iconify-icons/fa6-solid/triangle-exclamation";
import commentIcon from "@iconify-icons/fa6-solid/comment";

export interface ProjectDetails {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  challenges?: string[];
  solutions?: string[];
  reflections?: string;
  features?: string[];
}

interface ProjectModalProps {
  project: ProjectDetails;
}

export const ProjectModal = ({ project }: ProjectModalProps) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // When image is expanded, focus the close button and disable tabbing to hidden content
  useEffect(() => {
    if (isImageExpanded && closeButtonRef.current) {
      // Small delay to ensure the button is rendered
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isImageExpanded]);

  // Disable tabbing to hidden content when image is expanded
  useEffect(() => {
    if (!mainContentRef.current) return;

    // Get all potentially focusable elements in the content area
    const contentElements =
      mainContentRef.current.querySelectorAll<HTMLElement>(
        "button, a, [tabindex], input, textarea, select"
      );

    if (isImageExpanded) {
      // Set tabIndex to -1 for all content elements when image is expanded
      contentElements.forEach((el) => {
        // Skip the close button in the expanded image overlay
        if (el === closeButtonRef.current) return;

        // Store original tabIndex (or 0 if none was set for naturally focusable elements)
        const currentTabIndex = el.tabIndex;
        const isNaturallyFocusable =
          (el.tagName === "A" ||
            el.tagName === "BUTTON" ||
            el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT") &&
          !el.hasAttribute("tabindex");

        if (currentTabIndex >= 0) {
          el.setAttribute("data-original-tabindex", currentTabIndex.toString());
          el.tabIndex = -1;
        } else if (isNaturallyFocusable) {
          // Element is naturally focusable (implicit tabIndex 0)
          el.setAttribute("data-original-tabindex", "0");
          el.tabIndex = -1;
        }
      });
    } else {
      // Restore original tabIndex when image is closed
      contentElements.forEach((el) => {
        const originalTabIndex = el.getAttribute("data-original-tabindex");
        if (originalTabIndex !== null) {
          const restoredIndex = parseInt(originalTabIndex);
          el.tabIndex = restoredIndex;
          el.removeAttribute("data-original-tabindex");
          // If it was naturally focusable (tabIndex 0), remove the explicit tabindex
          if (
            restoredIndex === 0 &&
            !el.hasAttribute("tabindex") &&
            (el.tagName === "A" || el.tagName === "BUTTON")
          ) {
            // Keep tabindex for buttons and links that need it
          }
        }
      });
    }
  }, [isImageExpanded]);

  const handleThumbnailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsImageExpanded(true);
    }
  };

  return (
    <div className="h-full relative">
      {/* Expanded Image Lightbox - covers entire modal */}
      <AnimatePresence>
        {isImageExpanded && project.imageUrl && (
          <motion.div
            className="absolute inset-0 z-50 bg-terminal-bg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Close button header */}
            <div className="flex justify-between items-center p-3 border-b border-white/10 shrink-0">
              <span className="font-pixel text-sm text-white/70 uppercase">
                {project.title}
              </span>
              <button
                ref={closeButtonRef}
                onClick={() => setIsImageExpanded(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors focus:outline-2 focus:outline-white focus:outline-offset-2 hover-scale-lg"
                aria-label="Close expanded image"
                tabIndex={1}
              >
                <Icon icon={xmarkIcon} className="w-5 h-5" />
              </button>
            </div>
            {/* Full image - scrollable */}
            <div className="flex-1 overflow-auto p-4">
              <img
                src={project.imageUrl}
                alt={`Screenshot of ${project.title}`}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - scrollable */}
      <div
        ref={mainContentRef}
        className="h-full overflow-y-auto p-4 space-y-6"
        tabIndex={-1}
      >
        {/* Header with thumbnail */}
        <div className="flex flex-wrap gap-4 items-start">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h2
              className="font-pixel text-3xl mb-1 uppercase hyphens-auto"
              lang="no"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {project.title}
            </h2>
            <p className="font-pixel text-base text-primary uppercase">
              {project.subtitle}
            </p>
          </div>

          {/* Small thumbnail */}
          {project.imageUrl && (
            <div
              ref={thumbnailRef}
              className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded border border-border cursor-pointer relative group focus:outline-2 focus:outline-primary focus:outline-offset-2 hover-scale"
              onClick={() => setIsImageExpanded(true)}
              onKeyDown={handleThumbnailKeyDown}
              tabIndex={0}
              role="button"
              aria-label={`Expand image for ${project.title}`}
            >
              <img
                src={project.imageUrl}
                alt={`Screenshot of ${project.title}`}
                className="w-full h-full object-cover object-top"
              />
              {/* Expand hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Icon icon={expandIcon} className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-base text-white/90 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-pixel text-sm hover:bg-primary transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2 hover-scale-subtle"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Icon icon={githubIcon} className="w-4 h-4" />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-foreground font-pixel text-sm hover:bg-foreground hover:text-background transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2 hover-scale-subtle"
              aria-label={`View ${project.title} live site`}
            >
              <Icon icon={globeIcon} className="w-4 h-4" />
              Live Site
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-pixel text-base flex items-center gap-2 text-white">
              <Icon icon={codeIcon} className="w-4 h-4 text-secondary" />
              TECH STACK
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary/20 text-white/90 text-base border border-secondary/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-pixel text-base flex items-center gap-2 text-white">
              <Icon icon={lightbulbIcon} className="w-4 h-4 text-accent" />
              FEATURES
            </h3>
            <ul className="space-y-1 text-base text-white/90">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-1">▸</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-pixel text-base flex items-center gap-2 text-white">
              <Icon icon={triangleExclamationIcon} className="w-4 h-4 text-destructive" />
              CHALLENGES
            </h3>
            <ul className="space-y-1 text-base text-white/90">
              {project.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✗</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solutions */}
        {project.solutions && project.solutions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-pixel text-base flex items-center gap-2 text-white">
              <Icon icon={lightbulbIcon} className="w-4 h-4 text-primary" />
              SOLUTIONS
            </h3>
            <ul className="space-y-1 text-base text-white/90">
              {project.solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  {solution}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reflections */}
        {project.reflections && (
          <div className="space-y-2">
            <h3 className="font-pixel text-base flex items-center gap-2 text-white">
              <Icon icon={commentIcon} className="w-4 h-4 text-white/60" />
              REFLECTIONS
            </h3>
            <p className="text-base text-white/70 italic leading-relaxed border-l-2 border-white/30 pl-4">
              "{project.reflections}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
