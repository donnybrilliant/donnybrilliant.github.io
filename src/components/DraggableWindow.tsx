import { motion } from "framer-motion";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import xmarkIcon from "@iconify-icons/fa6-solid/xmark";
import minusIcon from "@iconify-icons/fa6-solid/minus";
import windowMaximizeIcon from "@iconify-icons/fa6-solid/window-maximize";
import windowRestoreIcon from "@iconify-icons/fa6-solid/window-restore";
import { useWindows } from "@/hooks/useWindows";

interface DraggableWindowProps {
  id: string;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

type SwipeDirection = "left" | "right" | "up" | null;

export const DraggableWindow = ({
  id,
  title,
  children,
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  onPositionChange,
  onSizeChange,
}: DraggableWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const { registerWindowRef } = useWindows();

  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [footerHeight, setFooterHeight] = useState(48);
  const [isClosing, setIsClosing] = useState(false);
  const [closeDirection, setCloseDirection] = useState<SwipeDirection>(null);

  // Refs for drag/resize tracking
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const latestPositionRef = useRef<{ x: number; y: number } | null>(null);
  const latestSizeRef = useRef<{ width: number; height: number } | null>(null);
  const prevInitialPositionRef = useRef(initialPosition);
  const prevInitialSizeRef = useRef(initialSize);

  // Register window ref with context for focus management
  useEffect(() => {
    registerWindowRef(id, windowRef.current);
    return () => registerWindowRef(id, null);
  }, [id, registerWindowRef]);

  // Sync dragging/resizing state to refs
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  useEffect(() => {
    isResizingRef.current = isResizing;
  }, [isResizing]);

  // Sync position from props
  useEffect(() => {
    if (initialPosition && !isDraggingRef.current) {
      const prev = prevInitialPositionRef.current;
      if (prev.x !== initialPosition.x || prev.y !== initialPosition.y) {
        setPosition(initialPosition);
        prevInitialPositionRef.current = initialPosition;
      }
    }
  }, [initialPosition]);

  // Sync size from props
  useEffect(() => {
    if (initialSize && !isResizingRef.current) {
      const prev = prevInitialSizeRef.current;
      if (
        prev.width !== initialSize.width ||
        prev.height !== initialSize.height
      ) {
        setSize(initialSize);
        prevInitialSizeRef.current = initialSize;
      }
    }
  }, [initialSize]);

  // Check mobile and measure footer
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      const footer = document.querySelector("footer");
      setFooterHeight(footer?.getBoundingClientRect().height || 48);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const footer = document.querySelector("footer");
    const resizeObserver = footer
      ? new ResizeObserver(() => {
          if (footer) {
            setFooterHeight(footer.getBoundingClientRect().height);
          }
        })
      : null;
    if (resizeObserver && footer) {
      resizeObserver.observe(footer);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      resizeObserver?.disconnect();
    };
  }, []);

  // Handle mobile fullscreen / desktop positioning
  useEffect(() => {
    if (isMobile) {
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - footerHeight,
      });
      setIsMaximized(true);
    } else if (!isMaximized) {
      const centerX = Math.max(50, (window.innerWidth - initialSize.width) / 2);
      const centerY = Math.max(
        50,
        (window.innerHeight - initialSize.height) / 3
      );
      setPosition({ x: centerX, y: centerY });
      setSize(initialSize);
    }
  }, [isMobile, initialSize, footerHeight, isMaximized]);

  // Update maximized window size on browser resize
  useEffect(() => {
    if (!isMaximized || isMobile) return;

    const handleResize = () => {
      const maximizedSize = {
        width: window.innerWidth,
        height: window.innerHeight - footerHeight,
      };
      setSize(maximizedSize);
      onSizeChange?.(maximizedSize);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized, isMobile, footerHeight, onSizeChange]);

  // Reset closing state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setCloseDirection(null);
    }
  }, [isOpen]);

  // Focus thumbnail when window opens
  useEffect(() => {
    if (isOpen && !isMinimized && windowRef.current) {
      const timer = setTimeout(() => {
        const thumbnail = windowRef.current?.querySelector<HTMLElement>(
          '[role="button"][aria-label*="Expand image"], [role="button"][aria-label*="expand image"]'
        );
        if (thumbnail && thumbnail.tabIndex >= 0) {
          thumbnail.focus();
        } else {
          // Focus first focusable content element
          const firstFocusable = windowRef.current?.querySelector<HTMLElement>(
            'a, button:not([tabindex="1000"]):not([tabindex="1001"]):not([tabindex="1002"]), [tabindex="0"], [role="button"]'
          );
          firstFocusable?.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Swipe close handlers (mobile)
  const handleSwipeClose = (direction: SwipeDirection) => {
    setCloseDirection(direction);
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !swipeStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const deltaTime = Date.now() - swipeStartRef.current.time;

    const minSwipeDistance = 80;
    const maxSwipeTime = 300;

    if (deltaTime < maxSwipeTime) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX > minSwipeDistance) {
        handleSwipeClose(deltaX < 0 ? "left" : "right");
      } else if (absY > absX && deltaY < -minSwipeDistance) {
        handleSwipeClose("up");
      }
    }
    swipeStartRef.current = null;
  };

  // Drag handling
  const startDrag = (e: React.PointerEvent) => {
    if (isMaximized || isMobile) return;

    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    latestPositionRef.current = position;

    const handlePointerMove = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;

      const deltaX = ev.clientX - dragStartRef.current.x;
      const deltaY = ev.clientY - dragStartRef.current.y;

      const headerHeight = 32;
      const currentFooterHeight = window.innerWidth <= 248 ? 100 : 48;
      const maxX = Math.max(0, window.innerWidth - size.width);
      const maxY = Math.max(
        0,
        window.innerHeight - currentFooterHeight - headerHeight
      );

      const newPosition = {
        x: Math.max(0, Math.min(maxX, dragStartRef.current.posX + deltaX)),
        y: Math.max(0, Math.min(maxY, dragStartRef.current.posY + deltaY)),
      };

      setPosition(newPosition);
      latestPositionRef.current = newPosition;
    };

    const endDrag = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);

      if (latestPositionRef.current) {
        onPositionChange?.(latestPositionRef.current);
      }
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture was already released (e.g., pointer cancel)
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  };

  // Maximize handling
  const handleMaximize = () => {
    if (isMobile) return;

    if (isMaximized) {
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
      onPositionChange?.(preMaximizeState.position);
      onSizeChange?.(preMaximizeState.size);
    } else {
      setPreMaximizeState({ position, size });
      const maximizedPosition = { x: 0, y: 0 };
      const maximizedSize = {
        width: window.innerWidth,
        height: window.innerHeight - footerHeight,
      };
      setPosition(maximizedPosition);
      setSize(maximizedSize);
      onPositionChange?.(maximizedPosition);
      onSizeChange?.(maximizedSize);
    }
    setIsMaximized(!isMaximized);
  };

  // Resize handling
  const startResize = (e: React.MouseEvent) => {
    if (isMobile) return;

    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
    latestSizeRef.current = size;

    const handleMouseMove = (ev: MouseEvent) => {
      const newSize = {
        width: Math.max(
          minSize.width,
          resizeStartRef.current.width + ev.clientX - resizeStartRef.current.x
        ),
        height: Math.max(
          minSize.height,
          resizeStartRef.current.height + ev.clientY - resizeStartRef.current.y
        ),
      };
      setSize(newSize);
      latestSizeRef.current = newSize;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (latestSizeRef.current) {
        onSizeChange?.(latestSizeRef.current);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  if (!isOpen) return null;

  // Exit animation based on swipe direction
  const getExitAnimation = () => {
    if (!isClosing) return { scale: 1, opacity: 1, x: 0, y: 0 };
    switch (closeDirection) {
      case "left":
        return { x: -window.innerWidth, opacity: 0 };
      case "right":
        return { x: window.innerWidth, opacity: 0 };
      case "up":
        return { y: -window.innerHeight, opacity: 0 };
      default:
        return { scale: 0.8, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={windowRef}
      className="window fixed"
      style={{
        left: isMobile || isMaximized ? 0 : position.x,
        top: isMobile || isMaximized ? 0 : position.y,
        right: isMobile || isMaximized ? 0 : "auto",
        bottom: isMobile || isMaximized ? footerHeight : "auto",
        width: isMobile ? "auto" : isMaximized ? "100vw" : size.width,
        height: isMobile
          ? "auto"
          : isMaximized
          ? `calc(100vh - ${footerHeight}px)`
          : size.height,
        zIndex,
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
        maxWidth: "100vw",
        maxHeight: isMobile ? "none" : `calc(100vh - ${footerHeight}px)`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={
        isClosing ? getExitAnimation() : { scale: 1, opacity: 1, x: 0, y: 0 }
      }
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onMouseDown={onFocus}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`window-title-${id}`}
      tabIndex={-1}
    >
      {/* Window Header */}
      <div
        className={`window-header shrink-0 ${
          isDragging
            ? "cursor-grabbing"
            : isMobile
            ? "cursor-default"
            : "cursor-grab"
        }`}
        onPointerDown={startDrag}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center gap-3">
          <div className="window-controls flex gap-2 shrink-0">
            <button
              className="window-control window-control-close w-5 h-5 flex items-center justify-center focus:outline-2 focus:outline-white focus:outline-offset-2 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close"
              aria-label="Close window"
              tabIndex={1000}
            >
              <Icon icon={xmarkIcon} className="w-2.5 h-2.5" />
            </button>
            <button
              className="window-control window-control-minimize w-5 h-5 flex items-center justify-center focus:outline-2 focus:outline-white focus:outline-offset-2 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              title="Minimize"
              aria-label="Minimize window"
              tabIndex={1001}
            >
              <Icon icon={minusIcon} className="w-2.5 h-2.5" />
            </button>
            {!isMobile && (
              <button
                className="window-control window-control-maximize w-5 h-5 flex items-center justify-center focus:outline-2 focus:outline-white focus:outline-offset-2 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaximize();
                }}
                title={isMaximized ? "Restore" : "Maximize"}
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
                tabIndex={1002}
              >
                <Icon
                  icon={isMaximized ? windowRestoreIcon : windowMaximizeIcon}
                  className="w-2.5 h-2.5"
                />
              </button>
            )}
          </div>
          <span id={`window-title-${id}`} className="font-pixel text-xs">
            {title}
          </span>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content flex-1 text-window-body-foreground overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && !isMobile && (
        <div
          className="resize-handle"
          onMouseDown={startResize}
          style={{ cursor: "se-resize" }}
        />
      )}
    </motion.div>
  );
};
