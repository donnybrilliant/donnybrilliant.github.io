import { Icon } from "@iconify/react";
import githubIcon from "@iconify-icons/fa6-brands/github";
import globeIcon from "@iconify-icons/fa6-solid/globe";
import starIcon from "@iconify-icons/fa6-solid/star";

// Map language names to iconify icon identifiers (using colored logos)
const getLanguageIcon = (language: string): string => {
  const languageMap: Record<string, string> = {
    JavaScript: "logos:javascript",
    JS: "logos:javascript",
    TypeScript: "logos:typescript-icon",
    TS: "logos:typescript-icon",
    Python: "logos:python",
    Swift: "logos:swift",
    Go: "logos:go",
    GO: "logos:go",
    Bash: "logos:bash-icon",
    React: "logos:react",
    C: "logos:c",
    n8n: "logos:n8n-icon",
  };

  return languageMap[language] || "mdi:code-tags";
};

// Map language abbreviations to full names
const getLanguageFullName = (language: string): string => {
  const fullNameMap: Record<string, string> = {
    JS: "JavaScript",
    TS: "TypeScript",
    GO: "Go",
    C: "C",
  };

  return fullNameMap[language] || language;
};

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  primaryLanguage?: string;
  githubStars?: number;
  index?: number;
  onOpenModal?: () => void;
}

export const ProjectCard = ({
  title,
  subtitle,
  description,
  imageUrl,
  githubUrl,
  liveUrl,
  primaryLanguage,
  githubStars,
  index = 0,
  onOpenModal,
}: ProjectCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger modal if clicking on a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) return;
    onOpenModal?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't trigger modal if focus is on a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenModal?.();
    }
  };

  // Stagger animation delay based on index (capped at 6)
  const staggerClass = `animate-stagger-${Math.min(index + 1, 6)}`;

  return (
    <div
      className={`project-card flex flex-col h-full group animate-on-scroll ${staggerClass} relative`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="project-card-title-container font-pixel text-2xl h-16 flex-1" lang="no">
          <span className="project-card-title uppercase">{title}</span>
        </h3>
        {githubStars !== undefined && (
          <span className="inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors group-hover:text-foreground dark:text-dark-surface-light dark:group-hover:text-dark-surface-light">
            <Icon icon={starIcon} className="text-base text-yellow-400" />
            {githubStars}
          </span>
        )}
      </div>

      {imageUrl && (
        <div className="overflow-hidden my-4 bg-muted">
          <img
            src={imageUrl}
            alt={`Screenshot of ${title}`}
            className="project-card-image"
          />
        </div>
      )}

      <div className="flex-1">
        <p className="font-pixel text-base mb-1 uppercase">
          {subtitle}
        </p>
        <p className="text-base font-normal text-muted-foreground leading-normal">
          {description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex flex-wrap items-center justify-center gap-4 h-10 relative w-full">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-2xl hover:text-primary transition-colors hover-scale-xl flex items-center justify-center"
              aria-label="View on GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon={githubIcon} />
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-2xl hover:text-primary transition-colors hover-scale-xl flex items-center justify-center"
              aria-label="View live site"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon={globeIcon} />
            </a>
          )}
          {primaryLanguage && (
            <div className="project-card-language-inline absolute right-0 bottom-0 flex items-center">
              <Icon
                icon={getLanguageIcon(primaryLanguage)}
                className="text-2xl w-6 h-6 text-muted-foreground transition-colors group-hover:text-primary dark:text-dark-surface-light"
                aria-label={getLanguageFullName(primaryLanguage)}
              />
            </div>
          )}
        </div>
        {primaryLanguage && (
          <div className="project-card-language-block hidden items-center justify-center">
            <Icon
              icon={getLanguageIcon(primaryLanguage)}
              className="text-2xl w-6 h-6 text-muted-foreground transition-colors group-hover:text-primary dark:text-dark-surface-light"
              aria-label={getLanguageFullName(primaryLanguage)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
