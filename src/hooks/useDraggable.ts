import { useState, useRef, useCallback } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface UseDraggableOptions {
  /** Initial position */
  initialPosition: Position;
  /** Function to calculate bounds dynamically */
  getBounds?: () => Bounds;
  /** Called when position changes during drag */
  onPositionChange?: (position: Position) => void;
  /** Called when drag ends */
  onDragEnd?: (position: Position) => void;
  /** Whether dragging is disabled */
  disabled?: boolean;
}

export interface UseDraggableReturn {
  position: Position;
  setPosition: (position: Position) => void;
  isDragging: boolean;
  dragHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
  };
}

/**
 * A hook for making elements draggable with pointer events.
 * Uses pointer capture for reliable cross-device drag handling.
 */
export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const {
    initialPosition,
    getBounds,
    onPositionChange,
    onDragEnd,
    disabled = false,
  } = options;

  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const latestPositionRef = useRef<Position>(position);

  /**
   * Clamps position within bounds if getBounds is provided
   */
  const clampPosition = useCallback(
    (pos: Position): Position => {
      if (!getBounds) return pos;

      const bounds = getBounds();
      return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
      };
    },
    [getBounds]
  );

  /**
   * Handles pointer down event to start dragging.
   * Uses pointer capture for reliable cross-device drag handling.
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      // Skip if clicking interactive elements (buttons, links, inputs)
      // This prevents dragging when user intends to interact with child elements
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("input")) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const el = e.currentTarget as HTMLElement;
      // Capture pointer to ensure drag continues even if pointer leaves element
      el.setPointerCapture(e.pointerId);

      setIsDragging(true);
      // Store initial pointer position and element position for delta calculation
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
      };
      latestPositionRef.current = position;

      const handlePointerMove = (ev: PointerEvent) => {
        // Only process events from the captured pointer
        if (ev.pointerId !== e.pointerId) return;

        // Calculate movement delta from drag start
        const deltaX = ev.clientX - dragStartRef.current.x;
        const deltaY = ev.clientY - dragStartRef.current.y;

        // Calculate new position and clamp to bounds
        const newPosition = clampPosition({
          x: dragStartRef.current.posX + deltaX,
          y: dragStartRef.current.posY + deltaY,
        });

        setPosition(newPosition);
        latestPositionRef.current = newPosition;
        onPositionChange?.(newPosition);
      };

      const handlePointerUp = (ev: PointerEvent) => {
        // Only process events from the captured pointer
        if (ev.pointerId !== e.pointerId) return;

        setIsDragging(false);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);

        // Call onDragEnd with final position
        onDragEnd?.(latestPositionRef.current);

        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore if pointer capture was already released (e.g., pointer cancel)
        }
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    [disabled, position, clampPosition, onPositionChange, onDragEnd]
  );

  return {
    position,
    setPosition,
    isDragging,
    dragHandlers: {
      onPointerDown: handlePointerDown,
    },
  };
}

