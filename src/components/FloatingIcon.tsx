import { motion } from "framer-motion";
import { useState, useRef, useEffect, type ReactNode, type RefObject, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Icon dimensions at normal size
const ICON_WIDTH = 88;
const ICON_HEIGHT = 100;
// Spacing between icons when side by side
const ICON_SPACING = 20;
// Width at which icons start scaling down (before stacking)
const SCALE_START_WIDTH = 400;
// Width at which icons stack vertically
const STACK_WIDTH = 260;
// Minimum scale factor
const MIN_SCALE = 0.7;

interface FloatingIconProps {
  id: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  initialPosition: { x: number; y: number };
  sectionBoundaryRef?: RefObject<HTMLElement | null>;
  xOffset?: number; 
  tabIndex?: number;
}

// Registry to track all floating icons for collision detection
const iconRegistry = new Map<string, {
  position: { x: number; y: number };
  xOffset: number;
  hasUserDragged: boolean;
  setPosition: (pos: { x: number; y: number }) => void;
}>();

// Check if two icons would overlap
const wouldOverlap = (
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
  margin = 10
): boolean => {
  const rect1 = {
    left: pos1.x,
    right: pos1.x + ICON_WIDTH,
    top: pos1.y,
    bottom: pos1.y + ICON_HEIGHT,
  };
  const rect2 = {
    left: pos2.x - margin,
    right: pos2.x + ICON_WIDTH + margin,
    top: pos2.y - margin,
    bottom: pos2.y + ICON_HEIGHT + margin,
  };
  
  return !(rect1.right < rect2.left || 
           rect1.left > rect2.right || 
           rect1.bottom < rect2.top || 
           rect1.top > rect2.bottom);
};

// Get the other icon's data from registry
const getOtherIcon = (currentId: string) => {
  for (const [id, data] of iconRegistry.entries()) {
    if (id !== currentId) {
      return { id, ...data };
    }
  }
  return null;
};

// Calculate scale factor based on viewport width
const getScaleFactor = (viewportWidth: number): number => {
  if (viewportWidth >= SCALE_START_WIDTH) {
    return 1;
  }
  if (viewportWidth <= STACK_WIDTH) {
    return MIN_SCALE;
  }
  // Linear interpolation between SCALE_START_WIDTH and STACK_WIDTH
  const ratio = (viewportWidth - STACK_WIDTH) / (SCALE_START_WIDTH - STACK_WIDTH);
  return MIN_SCALE + ratio * (1 - MIN_SCALE);
};

export const FloatingIcon = ({ 
  id,
  icon, 
  label, 
  onClick, 
  color = "bg-primary",
  initialPosition,
  sectionBoundaryRef,
  xOffset = 0,
  tabIndex = 0
}: FloatingIconProps) => {
  const iconRef = useRef<HTMLDivElement | null>(null);
  const [storedPosition, setStoredPosition] = useLocalStorage<{ x: number; y: number } | null>(
    `floating-icon-${id}`,
    null
  );
  const [position, setPosition] = useState<{ x: number; y: number }>(
    storedPosition ?? initialPosition
  );
  const [isDragging, setIsDragging] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isOverPrimaryBackground, setIsOverPrimaryBackground] = useState(false);
  const [scale, setScale] = useState(1);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);
  // Track if user has explicitly dragged this icon (persists across sessions via localStorage)
  const hasUserDragged = useRef(storedPosition !== null);

  // Register this icon in the registry
  useEffect(() => {
    iconRegistry.set(id, {
      position,
      xOffset,
      hasUserDragged: hasUserDragged.current,
      setPosition,
    });
    
    return () => {
      iconRegistry.delete(id);
    };
  }, [id, position, xOffset]);

  const getBounds = useCallback(() => {
    const el = iconRef.current;
    const iconWidth = (el?.offsetWidth ?? ICON_WIDTH) + 4;
    const iconHeight = (el?.offsetHeight ?? ICON_HEIGHT) + 4;
    const container = (el?.offsetParent as HTMLElement | null) ?? document.documentElement;

    const navbar = document.querySelector('header');
    const footer = document.querySelector('footer');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
    const footerHeight = footer ? footer.getBoundingClientRect().height : 48;

    const maxX = Math.max(0, container.clientWidth - iconWidth);
    const minY = navbarHeight;
    const maxY = Math.max(minY, container.scrollHeight - iconHeight - footerHeight);

    return { container, maxX, maxY, minY, iconWidth, iconHeight, navbarHeight };
  }, []);

  // Calculate the base Y position from section boundary
  const getBaseY = useCallback(() => {
    const navbar = document.querySelector('header');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
    
    if (sectionBoundaryRef?.current) {
      const sectionTop = sectionBoundaryRef.current.offsetTop;
      const baseY = Math.floor(sectionTop - ICON_HEIGHT / 2);
      return Math.max(navbarHeight, baseY);
    }
    
    const footer = document.querySelector('footer');
    const footerHeight = footer ? footer.getBoundingClientRect().height : 48;
    const maxY = window.innerHeight - footerHeight - ICON_HEIGHT;
    return Math.max(navbarHeight, Math.floor(maxY));
  }, [sectionBoundaryRef]);

  // Calculate positions for this icon based on viewport width (for non-dragged icons)
  // Icons are positioned on the RIGHT side of the screen
  const calculateResponsivePosition = useCallback(() => {
    // Use getBounds to get consistent dimensions with drag constraints
    // iconWidth from getBounds includes the actual element width (with label)
    const { maxX, iconWidth } = getBounds();
    const viewportWidth = document.documentElement.clientWidth;
    const baseY = getBaseY();
    const currentScale = getScaleFactor(viewportWidth);
    const scaledIconHeight = ICON_HEIGHT * currentScale;
    const scaledSpacing = ICON_SPACING * currentScale;
    
    // Check if we need to stack (viewport too narrow)
    const shouldStack = viewportWidth < STACK_WIDTH;
    
    if (shouldStack) {
      // Stack vertically on the right side
      // Left icon (negative xOffset) goes ON TOP
      // Right icon (positive xOffset) goes BELOW
      const isRightIcon = xOffset > 0;
      
      // Position at maxX (right edge, respecting drag bounds)
      const clampedX = Math.max(0, maxX);
      
      if (isRightIcon) {
        // Right icon goes below (second position)
        return { x: clampedX, y: baseY + scaledIconHeight + scaledSpacing };
      } else {
        // Left icon goes on top (first position)
        return { x: clampedX, y: baseY };
      }
    } else {
      // Side by side on the right side of the screen
      // Calculate position from right edge
      // Right icon is at the far right, left icon is next to it
      const isRightIcon = xOffset > 0;
      
      if (isRightIcon) {
        // Right icon - positioned at maxX (right edge, respecting drag bounds)
        return { x: Math.max(0, maxX), y: baseY };
      } else {
        // Left icon - positioned to the left of the right icon
        // Use actual iconWidth from getBounds for accurate spacing
        const leftX = maxX - iconWidth - scaledSpacing;
        return { x: Math.max(0, leftX), y: baseY };
      }
    }
  }, [xOffset, getBaseY, getBounds]);

  // Update scale on mount and resize
  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = document.documentElement.clientWidth;
      setScale(getScaleFactor(viewportWidth));
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Initialize position (only once, after section boundary is available)
  useEffect(() => {
    if (hasInitialized) return;
    
    const timer = setTimeout(() => {
      const { maxX, maxY, minY } = getBounds();
      
      // If user has previously dragged this icon, use stored position (clamped to bounds)
      if (storedPosition !== null) {
        const clampedPosition = {
          x: Math.max(0, Math.min(storedPosition.x, maxX)),
          y: Math.max(minY, Math.min(storedPosition.y, maxY)),
        };
        setPosition(clampedPosition);
      } else {
        // Calculate fresh position
        const newPosition = calculateResponsivePosition();
        setPosition(newPosition);
      }
      setHasInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [sectionBoundaryRef, hasInitialized, storedPosition, getBounds, calculateResponsivePosition]);

  // After initialization, check for collision and resolve it
  // This only runs for user-dragged icons, not for auto-positioned icons
  // (auto-positioned icons are calculated to not overlap)
  useEffect(() => {
    // Skip collision resolution while dragging - we handle it on release
    // Also skip if this icon hasn't been user-dragged (auto-positioned icons don't need collision resolution)
    if (!hasInitialized || isDragging || !hasUserDragged.current) return;
    
    const resolveCollisions = () => {
      const otherIcon = getOtherIcon(id);
      if (!otherIcon) return;
      
      // Check if we're overlapping with the other icon
      if (wouldOverlap(position, otherIcon.position)) {
        const { maxY, minY } = getBounds();
        
        // Determine which icon should move based on xOffset
        // The icon with positive xOffset (right icon) should move below
        const shouldThisIconMove = xOffset > 0 || (xOffset === otherIcon.xOffset && id > otherIcon.id);
        
        if (shouldThisIconMove) {
          // Move this icon below the other
          const newY = otherIcon.position.y + ICON_HEIGHT + ICON_SPACING;
          const clampedY = Math.max(minY, Math.min(newY, maxY));
          setPosition(prev => ({ ...prev, y: clampedY }));
        }
        // If we shouldn't move, the other icon will handle it
      }
    };
    
    // Small delay to ensure both icons have registered their positions
    const timer = setTimeout(resolveCollisions, 50);
    return () => clearTimeout(timer);
  }, [hasInitialized, isDragging, id, xOffset, position, getBounds]);

  // Handle resize - recalculate positions but DON'T save to localStorage
  useEffect(() => {
    const handleResize = () => {
      if (!hasInitialized) return;
      
      const { maxX, maxY, minY } = getBounds();
      
      // If user has explicitly dragged this icon, just constrain to bounds
      if (hasUserDragged.current) {
        setPosition((prev: { x: number; y: number }) => {
          const newPos = {
            x: Math.max(0, Math.min(prev.x, maxX)),
            y: Math.max(minY, Math.min(prev.y, maxY)),
          };
          
          // Check collision with the new position
          const otherIcon = getOtherIcon(id);
          if (otherIcon && wouldOverlap(newPos, otherIcon.position)) {
            const shouldThisIconMove = xOffset > 0 || (xOffset === otherIcon.xOffset && id > otherIcon.id);
            if (shouldThisIconMove) {
              const newY = otherIcon.position.y + ICON_HEIGHT + ICON_SPACING;
              return { ...newPos, y: Math.max(minY, Math.min(newY, maxY)) };
            }
          }
          
          return newPos;
        });
      } else {
        // Recalculate responsive position
        const newPosition = calculateResponsivePosition();
        setPosition(newPosition);
      }
      // NOTE: We do NOT save to localStorage here - only on explicit drag
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [hasInitialized, getBounds, calculateResponsivePosition, id, xOffset]);

  // Check if icon is over the hello world section (primary background)
  useEffect(() => {
    const checkPosition = () => {
      if (!iconRef.current) return;
      
      const iconRect = iconRef.current.getBoundingClientRect();
      const iconCenterY = iconRect.top + iconRect.height / 2;
      
      const helloWorldSection = document.querySelector('.section-home');
      if (helloWorldSection) {
        const sectionRect = helloWorldSection.getBoundingClientRect();
        const isOver = iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom;
        setIsOverPrimaryBackground(isOver);
      } else {
        setIsOverPrimaryBackground(false);
      }
    };

    checkPosition();
    
    window.addEventListener('scroll', checkPosition, true);
    window.addEventListener('resize', checkPosition);
    
    return () => {
      window.removeEventListener('scroll', checkPosition, true);
      window.removeEventListener('resize', checkPosition);
    };
  }, [position]);

  const getEventCoords = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const { container } = getBounds();
    const containerRect = container.getBoundingClientRect();
    const containerDocLeft = containerRect.left + window.scrollX;
    const containerDocTop = containerRect.top + window.scrollY;

    const { clientX, clientY } = getEventCoords(e);
    const pageX = clientX + window.scrollX;
    const pageY = clientY + window.scrollY;

    dragStart.current = {
      x: pageX - containerDocLeft - position.x,
      y: pageY - containerDocTop - position.y,
    };

    hasMoved.current = false;
    setIsDragging(true);

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const { container, maxX, maxY, minY } = getBounds();
      const r = container.getBoundingClientRect();
      const docLeft = r.left + window.scrollX;
      const docTop = r.top + window.scrollY;

      const { clientX: moveClientX, clientY: moveClientY } = getEventCoords(moveEvent);
      const movePageX = moveClientX + window.scrollX;
      const movePageY = moveClientY + window.scrollY;

      const dragStartX = dragStart.current?.x ?? 0;
      const dragStartY = dragStart.current?.y ?? 0;
      let newX = movePageX - docLeft - dragStartX;
      let newY = movePageY - docTop - dragStartY;

      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
        hasMoved.current = true;
      }

      // Clamp to bounds only - allow dragging over other icons freely
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      dragStart.current = null;
      setIsDragging(false);

      if (hasMoved.current) {
        // User explicitly dragged - mark as dragged
        hasUserDragged.current = true;
        
        // Resolve collision on release - if overlapping, float away
        setPosition((currentPos) => {
          const { maxY, minY } = getBounds();
          const otherIcon = getOtherIcon(id);
          
          // Check if we need to resolve collision
          const needsCollisionResolution = otherIcon && wouldOverlap(currentPos, otherIcon.position);
          // When stacking due to collision, go ABOVE (subtract) instead of below
          const finalY = needsCollisionResolution
            ? Math.max(minY, Math.min(otherIcon.position.y - ICON_HEIGHT - ICON_SPACING, maxY))
            : currentPos.y;
          
          const finalPos = { x: currentPos.x, y: finalY };
          
          // Save final position to localStorage
          setStoredPosition(finalPos);
          
          // Update registry
          iconRegistry.set(id, {
            position: finalPos,
            xOffset,
            hasUserDragged: true,
            setPosition,
          });
          
          return finalPos;
        });
      } else {
        onClick();
      }

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      ref={iconRef}
      className="absolute z-20 cursor-pointer active:cursor-grabbing touch-none"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
      animate={{ scale: isDragging ? scale * 1.1 : scale }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={`desktop-icon group select-none ${isOverPrimaryBackground ? 'over-primary-bg' : ''}`}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        role="button"
        aria-label={`Open ${label}`}
      >
        <div
          className={`desktop-icon-image ${color} rounded-lg shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          {icon}
        </div>
        <span className="desktop-icon-label pointer-events-none">{label}</span>
      </div>
    </motion.div>
  );
};
