import { useState, useRef, lazy, Suspense } from "react";
import { Icon } from "@iconify/react";
import terminalIcon from "@iconify-icons/fa6-solid/terminal";
import githubIcon from "@iconify-icons/fa6-brands/github";
import packageIcon from "@iconify-icons/codicon/package";

// Hooks
import { useScrollspy } from "@/hooks/useScrollspy";
import { useBrowserTheme } from "@/hooks/useBrowserTheme";
import { useWindows } from "@/hooks/useWindows";
import { useGridColumns } from "@/hooks/useGridColumns";

// Data
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/socialLinks";

// Utils
import { calculateAge } from "@/utils";

// Components
import { DraggableWindow } from "@/components/DraggableWindow";

// Lazy load heavy window components (only loaded when user opens them)
const Terminal = lazy(() =>
  import("@/components/Terminal").then((m) => ({ default: m.Terminal }))
);
const PackageJsonViewer = lazy(() =>
  import("@/components/PackageJsonViewer").then((m) => ({
    default: m.PackageJsonViewer,
  }))
);
const ProjectModal = lazy(() =>
  import("@/components/ProjectModal").then((m) => ({ default: m.ProjectModal }))
);
import { FloatingIcon } from "@/components/FloatingIcon";
import { MyAvatar } from "@/components/Avatar";
import { TypeWriter } from "@/components/TypeWriter";
import { ProjectCard } from "@/components/ProjectCard";
import { MondrianGrid } from "@/components/MondrianGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sectionIds = ["home", "projects", "about", "contact"];

const Index = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);

  // Custom hooks
  const activeSection = useScrollspy(sectionIds, 100);
  const { initialVisibleCount } = useGridColumns();
  const {
    windows,
    openWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindows();

  // Sync browser theme-color with navbar/footer
  useBrowserTheme();

  return (
    <div className="relative">
      {/* Draggable Windows */}
      {windows.map((window) => (
        <DraggableWindow
          key={window.id}
          id={window.id}
          title={window.title}
          isOpen={window.isOpen}
          isMinimized={window.isMinimized}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          zIndex={window.zIndex}
          initialPosition={window.position}
          initialSize={
            window.size ||
            (window.id === "terminal"
              ? { width: 700, height: 450 }
              : { width: 600, height: 500 })
          }
          onPositionChange={(position) =>
            updateWindowPosition(window.id, position)
          }
          onSizeChange={(size) => updateWindowSize(window.id, size)}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading...
              </div>
            }
          >
            {window.id === "terminal" && <Terminal />}
            {window.id === "packageJson" && <PackageJsonViewer />}
            {window.projectData && (
              <ProjectModal project={window.projectData} />
            )}
          </Suspense>
        </DraggableWindow>
      ))}

      {/* Header with Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content */}
      <main ref={sectionsRef} className="pb-12">

        {/* Home Section */}
        <section
          id="home"
          className="section-home min-h-screen flex flex-col md:flex-row-reverse items-center justify-center md:justify-center gap-8 md:gap-0 px-6 md:px-12 pt-24 pb-12"
        >
          {/* Avatar container - min dimensions prevent CLS while allowing component's natural size */}
          <div className="md:-ml-16 min-w-[200px] min-h-[200px] md:min-w-[300px] md:min-h-[300px] flex-shrink-0">
            <MyAvatar />
          </div>
          <div className="max-w-lg md:max-w-md lg:max-w-lg overflow-visible">
            <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 ml-[-0.5rem] retro-text-hover cursor-default whitespace-nowrap overflow-visible animate-fade-in">
              Hello World!
            </h1>
            <div className="mb-6 min-h-[150px]">
              <TypeWriter
                text={`My name is Daniel, I am a web developer. \nI like [random stuff](#mondrian-grid). \nTry the [theme slider](#theme-slider) or moving icons around. \nCheck out which packages I use in my projects or take a browse through the terminal`}
                speed={25}
                onLinkClick={(href) => {
                  if (href === "#theme-slider") {
                    // Scroll to footer and focus the theme slider
                    const slider = document.getElementById("theme-slider");
                    if (slider) {
                      slider.scrollIntoView({ block: "end" });
                      slider.focus();
                    }
                  } else if (href === "#mondrian-grid") {
                    // Scroll to the Mondrian grid section
                    const gridSection =
                      document.getElementById("mondrian-grid");
                    if (gridSection) {
                      gridSection.scrollIntoView({ block: "start" });
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-col xs:flex-row flex-nowrap xs:flex-wrap gap-4 justify-start animate-fade-in delay-1000">
              <button
                onClick={() => openWindow("terminal")}
                className="font-pixel text-sm px-4 py-2 bg-foreground text-background border-2 border-transparent hover:bg-transparent hover:text-foreground hover:border-foreground transition-colors cursor-pointer hello-world-focus hover-scale"
              >
                Open Terminal
              </button>
              <button
                onClick={() => openWindow("packageJson")}
                className="font-pixel text-sm px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer hello-world-focus hover-scale"
              >
                View Packages
              </button>
            </div>
          </div>
        </section>

        {/* Floating Icons - draggable on page, positioned after buttons for natural tab order */}
        <FloatingIcon
          id="terminal"
          icon={
            <Icon
              icon={terminalIcon}
              className="w-8 h-8 text-primary-foreground"
            />
          }
          label="terminal.sh"
          onClick={() => openWindow("terminal")}
          color="bg-primary"
          initialPosition={{ x: 20, y: 80 }}
          sectionBoundaryRef={projectsSectionRef}
          xOffset={-55}
        />
        <FloatingIcon
          id="packageJson"
          icon={
            <Icon
              icon={packageIcon}
              className="w-8 h-8 text-secondary-foreground"
            />
          }
          label="package.json"
          onClick={() => openWindow("packageJson")}
          color="bg-secondary"
          initialPosition={{ x: 20, y: 180 }}
          sectionBoundaryRef={projectsSectionRef}
          xOffset={55}
        />

        {/* Projects Section */}
        <section
          id="projects"
          ref={projectsSectionRef}
          className="section-projects min-h-screen py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-center animate-on-scroll">
              Projects
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-12 max-w-xl text-center mx-auto">
              Check out the projects I've made as part of my developer journey.
            </p>

            <div
              id="projects-grid"
              className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {(showAllProjects
                ? projects
                : projects.slice(0, initialVisibleCount)
              ).map((project, i) => (
                <ProjectCard
                  key={project.title}
                  {...project}
                  index={i}
                  onOpenModal={() =>
                    openWindow(`project-${project.title}`, project)
                  }
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-on-scroll-fade">
              {projects.length > initialVisibleCount && (
                <button
                  onClick={() => {
                    if (showAllProjects) {
                      projectsSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    } else {
                      setTimeout(() => {
                        const grid = document.getElementById("projects-grid");
                        if (grid) {
                          const cards = grid.children;
                          if (cards.length > initialVisibleCount) {
                            cards[initialVisibleCount]?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }
                      }, 100);
                    }
                    setShowAllProjects(!showAllProjects);
                  }}
                  className="font-pixel text-lg px-6 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors hover-scale"
                >
                  {showAllProjects
                    ? "View Less"
                    : `View More (${projects.length - initialVisibleCount})`}
                </button>
              )}
              <a
                href="https://github.com/donnybrilliant?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-lg px-6 py-3 bg-foreground text-background hover:bg-primary transition-colors inline-flex items-center gap-2"
              >
                <Icon icon={githubIcon} className="w-5 h-5" />
                All Repos
              </a>
            </div>

            <p className="subtle text-center mt-8">
              ALWAYS A PROJECT IN THE BACK OF MY MIND
            </p>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="section-about min-h-screen py-24 px-6 flex flex-col items-center justify-center gap-8"
        >
          <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center animate-on-scroll">
            About Me
          </h2>

          <p className="text-base md:text-lg lg:text-xl max-w-xl text-center">
            {calculateAge()} years old. I started with code, took a long detour
            into music, and eventually found my way back to programming.
          </p>

          <ul className="space-y-2 text-center text-base md:text-lg">
            <li>
              What started as a childhood hobby turned into a full-stack
              obsession - same curiosity, just with better tools and fewer
              dial-up noises.
            </li>
            <li>
              I hold a degree in Full Stack Development, a Bachelor's in
              Sociology, and a possibly excessive number of developer
              certifications.
            </li>
            <li>
              I've worked across a wide range of professions, which means I
              bring real-world perspective, not just clean code.
            </li>
            <li>
              I like building creative things that actually make sense - for
              users and developers.
            </li>
          </ul>

          <div className="text-center mt-8 animate-on-scroll-fade">
            <button
              onClick={() => openWindow("terminal")}
              className="font-pixel text-lg px-6 py-3 bg-foreground text-background hover:bg-primary transition-colors cursor-pointer"
            >
              Terminal
            </button>
            <p className="mt-2 text-sm">
              Browse the terminal to find out more about me
            </p>
          </div>

          <p className="subtle mt-8">NEVER STOP LEARNING</p>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="section-contact min-h-screen py-24 px-6 flex flex-col items-center justify-center gap-8"
        >
          <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center animate-on-scroll">
            Contact Me
          </h2>

          <ul className="space-y-4 text-lg md:text-xl lg:text-2xl">
            {socialLinks.map(({ icon, label, url }, i) => (
              <li
                key={label}
                className={`animate-on-scroll-left animate-stagger-${Math.min(
                  i + 1,
                  6
                )}`}
              >
                <a
                  href={url}
                  target={url.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 link-fill"
                >
                  <Icon icon={icon} className="w-6 h-6" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <p className="subtle mt-8">TEST OUT THE THEME SLIDER!</p>
        </section>

        {/* Mondrian Grid Section */}
        <MondrianGrid />
      </main>

      {/* Footer */}
      <Footer openWindows={openWindows} onToggleWindow={toggleWindow} />
    </div>
  );
};

export default Index;
