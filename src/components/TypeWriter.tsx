import { useEffect, useMemo, useReducer } from "react";
import { motion } from "framer-motion";

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  onLinkClick?: (href: string) => void;
}

interface ParsedPart {
  type: "text" | "link" | "newline";
  content: string;
  href?: string;
}

// State and action types for the reducer
interface TypeWriterState {
  charIndex: number;
  isComplete: boolean;
}

type TypeWriterAction =
  | { type: "ADVANCE" }
  | { type: "COMPLETE" }
  | { type: "RESET" };

/**
 * Reducer for TypeWriter component state.
 * Manages character index and completion state.
 */
function typeWriterReducer(
  state: TypeWriterState,
  action: TypeWriterAction
): TypeWriterState {
  switch (action.type) {
    case "ADVANCE":
      return { ...state, charIndex: state.charIndex + 1 };
    case "COMPLETE":
      return { ...state, isComplete: true };
    case "RESET":
      return { charIndex: 0, isComplete: false };
    default:
      return state;
  }
}

/**
 * Pre-parse the text into structured parts (text, links, newlines).
 * Supports markdown-style links: [text](url)
 *
 * @param text - The text to parse
 * @returns Array of parsed parts
 */
function parseTextStructure(text: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  const regex = /(\[.*?\]\(.*?\)|\n)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    const matched = match[0];
    if (matched === "\n") {
      parts.push({ type: "newline", content: "" });
    } else {
      const linkMatch = matched.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push({ type: "link", content: linkMatch[1], href: linkMatch[2] });
      }
    }

    ({ lastIndex } = regex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

/**
 * Build a character map that types out link text character by character.
 * Creates a mapping from character index to part index and character position.
 * This allows the typewriter effect to render links character-by-character.
 *
 * @param parts - Array of parsed text parts
 * @returns Array of { partIndex, charIndex } mappings
 */
function buildCharacterMap(
  parts: ParsedPart[]
): { partIndex: number; charIndex: number }[] {
  const map: { partIndex: number; charIndex: number }[] = [];

  parts.forEach((part, partIndex) => {
    if (part.type === "text" || part.type === "link") {
      // Map each character in text/link parts
      for (let i = 0; i < part.content.length; i++) {
        map.push({ partIndex, charIndex: i });
      }
    } else if (part.type === "newline") {
      // Newlines are single-character elements
      map.push({ partIndex, charIndex: 0 });
    }
  });

  return map;
}

export const TypeWriter = ({
  text,
  speed = 30,
  onComplete,
  onLinkClick,
}: TypeWriterProps) => {
  const [state, dispatch] = useReducer(typeWriterReducer, {
    charIndex: 0,
    isComplete: false,
  });
  const { charIndex, isComplete } = state;

  const parsedParts = useMemo(() => parseTextStructure(text), [text]);
  const charMap = useMemo(() => buildCharacterMap(parsedParts), [parsedParts]);

  // Reset when text changes
  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [text]);

  // Typing effect
  useEffect(() => {
    if (charIndex < charMap.length) {
      const timeout = setTimeout(() => {
        dispatch({ type: "ADVANCE" });
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isComplete && charMap.length > 0) {
      dispatch({ type: "COMPLETE" });
      onComplete?.();
    }
  }, [charIndex, charMap.length, speed, onComplete, isComplete]);

  // Render based on current progress
  const renderContent = () => {
    const result: React.ReactNode[] = [];
    const visibleParts = new Map<number, number>(); // partIndex -> how many chars visible

    // Build visibility map
    for (let i = 0; i < charIndex; i++) {
      const { partIndex, charIndex: cIdx } = charMap[i];
      visibleParts.set(
        partIndex,
        Math.max(visibleParts.get(partIndex) || 0, cIdx + 1)
      );
    }

    // Consistent line-height for all text elements
    const textLineHeight = "calc(1em * 1.5)";

    parsedParts.forEach((part, partIndex) => {
      const visible = visibleParts.get(partIndex);
      
      if (part.type === "text") {
        if (visible !== undefined) {
          result.push(
            <span key={partIndex} style={{ lineHeight: textLineHeight }}>
              {part.content.slice(0, visible)}
            </span>
          );
        }
      } else if (part.type === "link") {
        // Always render link element structure to prevent layout shift
        // Render empty link if we haven't started typing it yet
        const linkContent = visible !== undefined ? part.content.slice(0, visible) : "\u200B"; // Zero-width space to maintain structure
        result.push(
          <a
            key={partIndex}
            href={part.href}
            className="link-fill font-bold"
            target={part.href?.startsWith("#") ? undefined : "_blank"}
            rel={part.href?.startsWith("#") ? undefined : "noopener noreferrer"}
            onClick={(e) => {
              if (part.href?.startsWith("#") && onLinkClick) {
                e.preventDefault();
                onLinkClick(part.href);
              }
            }}
            style={{
              lineHeight: textLineHeight, // Match container line-height exactly
              verticalAlign: "baseline", // Align link element with text baseline
              alignItems: "baseline", // Align link content to baseline instead of center
              ...(visible === undefined ? { color: "transparent" } : {}),
            }}
          >
            {linkContent}
          </a>
        );
      } else if (part.type === "newline") {
        if (visible !== undefined) {
          result.push(<br key={partIndex} />);
        }
      }
    });

    return result;
  };

  // Render full text invisibly to reserve exact space
  const renderPlaceholder = () => {
    // Consistent line-height for all text elements
    const textLineHeight = "calc(1em * 1.5)";
    
    return parsedParts.map((part, partIndex) => {
      if (part.type === "text") {
        return (
          <span key={partIndex} style={{ lineHeight: textLineHeight }}>
            {part.content}
          </span>
        );
      } else if (part.type === "link") {
        // Render link with same classes and attributes as actual content to match width exactly
        return (
          <a
            key={partIndex}
            href={part.href}
            className="link-fill font-bold"
            target={part.href?.startsWith("#") ? undefined : "_blank"}
            rel={part.href?.startsWith("#") ? undefined : "noopener noreferrer"}
            style={{
              pointerEvents: "none",
              lineHeight: textLineHeight, // Match container line-height exactly
              verticalAlign: "baseline", // Align link element with text baseline
              alignItems: "baseline", // Align link content to baseline instead of center
            }}
          >
            {part.content}
          </a>
        );
      } else if (part.type === "newline") {
        return <br key={partIndex} />;
      }
      return null;
    });
  };

  // Calculate exact line-height to match between regular text and links
  // text-lg = 1.125rem, text-xl = 1.25rem, leading-normal = 1.5
  // We'll use CSS calc to ensure exact matching
  const lineHeightStyle = {
    lineHeight: "calc(1em * 1.5)", // Match leading-normal exactly
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-primary text-xl font-normal leading-normal relative"
      style={{ minHeight: "fit-content", ...lineHeightStyle }}
    >
      {/* 
        Invisible placeholder to reserve exact space.
        Uses visibility: hidden so it takes up space in the layout.
        This prevents layout shift as text types out character by character.
      */}
      <div
        aria-hidden="true"
        style={{ visibility: "hidden", whiteSpace: "pre-wrap", ...lineHeightStyle }}
      >
        {renderPlaceholder()}
        <span style={lineHeightStyle}>_</span>
      </div>
      {/* 
        Visible typing content positioned absolutely over placeholder.
        This creates the typewriter effect while maintaining stable layout.
      */}
      <div
        className="absolute inset-0"
        style={{ overflow: "visible", whiteSpace: "pre-wrap", ...lineHeightStyle }}
      >
        {renderContent()}
        <span className="animate-blink" style={lineHeightStyle}>_</span>
      </div>
    </motion.div>
  );
};
