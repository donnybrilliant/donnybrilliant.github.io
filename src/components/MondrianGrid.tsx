import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { Icon } from "@iconify/react";
import shuffleIcon from "@iconify-icons/fa6-solid/shuffle";

interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const GRID_COLS_DESKTOP = 8;
const GRID_COLS_MOBILE = 4;
const GRID_ROWS_DESKTOP = 5;
const GRID_ROWS_MOBILE = 7;
const LINE_WIDTH = 8;
const NAVBAR_HEIGHT = 62; 
const FOOTER_HEIGHT = 48; 
const FIXED_BORDERS = 2; 

const COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-quad",
  "bg-foreground",
  "bg-background",
];

// Desktop layout (8 cols x 5 rows)
const desktopItems: GridItem[] = [
  { id: "1", x: 0, y: 0, width: 2, height: 2, color: COLORS[5] },
  { id: "2", x: 2, y: 0, width: 2, height: 1, color: COLORS[2] },
  { id: "3", x: 4, y: 0, width: 2, height: 3, color: COLORS[0] },
  { id: "4", x: 6, y: 0, width: 2, height: 2, color: COLORS[2] },
  { id: "5", x: 2, y: 1, width: 1, height: 2, color: COLORS[3] },
  { id: "6", x: 3, y: 1, width: 1, height: 1, color: COLORS[1] },
  { id: "7", x: 3, y: 2, width: 1, height: 2, color: COLORS[5] },
  { id: "8", x: 0, y: 2, width: 1, height: 2, color: COLORS[4] },
  { id: "9", x: 1, y: 2, width: 1, height: 1, color: COLORS[5] },
  { id: "10", x: 6, y: 2, width: 1, height: 1, color: COLORS[1] },
  { id: "11", x: 7, y: 2, width: 1, height: 3, color: COLORS[3] },
  { id: "12", x: 1, y: 3, width: 2, height: 1, color: COLORS[4] },
  { id: "13", x: 4, y: 3, width: 2, height: 2, color: COLORS[0] },
  { id: "14", x: 6, y: 3, width: 1, height: 2, color: COLORS[5] },
  { id: "15", x: 0, y: 4, width: 1, height: 1, color: COLORS[2] },
  { id: "16", x: 1, y: 4, width: 1, height: 1, color: COLORS[1] },
  { id: "17", x: 2, y: 4, width: 2, height: 1, color: COLORS[3] },
];

// Mobile layout (4 cols x 7 rows)
const mobileItems: GridItem[] = [
  { id: "1", x: 0, y: 0, width: 2, height: 2, color: COLORS[5] },
  { id: "2", x: 2, y: 0, width: 1, height: 1, color: COLORS[2] },
  { id: "3", x: 3, y: 0, width: 1, height: 2, color: COLORS[0] },
  { id: "4", x: 2, y: 1, width: 1, height: 2, color: COLORS[3] },
  { id: "5", x: 0, y: 2, width: 1, height: 1, color: COLORS[4] },
  { id: "6", x: 1, y: 2, width: 1, height: 1, color: COLORS[1] },
  { id: "7", x: 3, y: 2, width: 1, height: 2, color: COLORS[2] },
  { id: "8", x: 0, y: 3, width: 2, height: 2, color: COLORS[0] },
  { id: "9", x: 2, y: 3, width: 1, height: 1, color: COLORS[5] },
  { id: "10", x: 2, y: 4, width: 1, height: 1, color: COLORS[1] },
  { id: "11", x: 3, y: 4, width: 1, height: 2, color: COLORS[4] },
  { id: "12", x: 0, y: 5, width: 1, height: 2, color: COLORS[3] },
  { id: "13", x: 1, y: 5, width: 1, height: 1, color: COLORS[2] },
  { id: "14", x: 2, y: 5, width: 1, height: 2, color: COLORS[5] },
  { id: "15", x: 1, y: 6, width: 1, height: 1, color: COLORS[0] },
  { id: "16", x: 3, y: 6, width: 1, height: 1, color: COLORS[1] },
];

interface DraggableBlockProps {
  item: GridItem;
  cellSize: { width: number; height: number };
  onDrag: (itemId: string, gridX: number, gridY: number) => void;
  onDragEnd: (itemId: string) => void;
  isDragging: boolean;
  gridCols: number;
  gridRows: number;
}

const DraggableBlock = ({
  item,
  cellSize,
  onDrag,
  onDragEnd,
  isDragging,
  gridCols,
  gridRows,
}: DraggableBlockProps) => {
  const x = useMotionValue(item.x * cellSize.width);
  const y = useMotionValue(item.y * cellSize.height);
  const lastGridPos = useRef({ x: item.x, y: item.y });

  // Update position when item or cellSize changes (for non-dragging blocks)
  useEffect(() => {
    if (!isDragging) {
      const targetX = item.x * cellSize.width;
      const targetY = item.y * cellSize.height;
      animate(x, targetX, { type: "spring", stiffness: 400, damping: 30 });
      animate(y, targetY, { type: "spring", stiffness: 400, damping: 30 });
      lastGridPos.current = { x: item.x, y: item.y };
    }
  }, [item.x, item.y, cellSize.width, cellSize.height, x, y, isDragging]);

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    _info: PanInfo
  ) => {
    const currentX = x.get();
    const currentY = y.get();

    // Calculate grid position based on center of block
    const centerX = currentX + (item.width * cellSize.width) / 2;
    const centerY = currentY + (item.height * cellSize.height) / 2;

    let gridX =
      Math.floor(centerX / cellSize.width) - Math.floor(item.width / 2);
    let gridY =
      Math.floor(centerY / cellSize.height) - Math.floor(item.height / 2);

    // Clamp to valid grid positions
    gridX = Math.max(0, Math.min(gridCols - item.width, gridX));
    gridY = Math.max(0, Math.min(gridRows - item.height, gridY));

    // Only trigger rearrangement if grid position changed
    if (gridX !== lastGridPos.current.x || gridY !== lastGridPos.current.y) {
      lastGridPos.current = { x: gridX, y: gridY };
      onDrag(item.id, gridX, gridY);
    }
  };

  const handleDragEnd = () => {
    // Snap to final grid position
    const targetX = lastGridPos.current.x * cellSize.width;
    const targetY = lastGridPos.current.y * cellSize.height;
    animate(x, targetX, { type: "spring", stiffness: 500, damping: 35 });
    animate(y, targetY, { type: "spring", stiffness: 500, damping: 35 });
    onDragEnd(item.id);
  };

  return (
    <motion.div
      className={`absolute cursor-grab active:cursor-grabbing ${item.color}`}
      style={{
        x,
        y,
        width: item.width * cellSize.width - LINE_WIDTH,
        height: item.height * cellSize.height - LINE_WIDTH,
        marginLeft: LINE_WIDTH / 2,
        marginTop: LINE_WIDTH / 2,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        top: 0,
        right: (gridCols - item.width) * cellSize.width,
        bottom: (gridRows - item.height) * cellSize.height,
      }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.02,
        zIndex: 10,
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      }}
    />
  );
};

export const MondrianGrid = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const gridCols = isMobile ? GRID_COLS_MOBILE : GRID_COLS_DESKTOP;
  const gridRows = isMobile ? GRID_ROWS_MOBILE : GRID_ROWS_DESKTOP;
  const initialItems = isMobile ? mobileItems : desktopItems;

  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [cellSize, setCellSize] = useState({ width: 100, height: 100 });
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Handle mobile/desktop changes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItems(mobile ? mobileItems : desktopItems);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateCellSize = () => {
      // Subtract border width + fixed header/footer (incl. their borders) from total size
      const vw = window.innerWidth - LINE_WIDTH;
      const vh =
        window.innerHeight -
        LINE_WIDTH -
        NAVBAR_HEIGHT -
        FOOTER_HEIGHT -
        FIXED_BORDERS;

      setCellSize({
        width: vw / gridCols,
        height: vh / gridRows,
      });
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [gridCols, gridRows]);

  const findValidPosition = useCallback(
    (
      item: GridItem,
      currentItems: GridItem[],
      excludeId: string
    ): { x: number; y: number } | null => {
      // Try to find the closest valid position
      const directions = [
        { dx: 0, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: -1 },
        { dx: 2, dy: 0 },
        { dx: -2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: 0, dy: -2 },
      ];

      for (const dir of directions) {
        const testX = item.x + dir.dx;
        const testY = item.y + dir.dy;

        if (
          testX >= 0 &&
          testY >= 0 &&
          testX + item.width <= gridCols &&
          testY + item.height <= gridRows
        ) {
          const collides = currentItems.some((other) => {
            if (other.id === item.id || other.id === excludeId) return false;
            return !(
              testX + item.width <= other.x ||
              testX >= other.x + other.width ||
              testY + item.height <= other.y ||
              testY >= other.y + other.height
            );
          });

          if (!collides) {
            return { x: testX, y: testY };
          }
        }
      }
      return null;
    },
    [gridCols, gridRows]
  );

  const rearrangeItems = useCallback(
    (draggedId: string, newX: number, newY: number) => {
      setItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.id === draggedId ? { ...item, x: newX, y: newY } : item
        );

        // Find and resolve all collisions
        let iterations = 0;
        const maxIterations = 100;
        let hasCollisions = true;

        while (hasCollisions && iterations < maxIterations) {
          hasCollisions = false;

          for (let i = 0; i < newItems.length; i++) {
            const item = newItems[i];
            if (item.id === draggedId) continue;

            // Check if this item collides with the dragged item
            const draggedItem = newItems.find((n) => n.id === draggedId);
            if (!draggedItem) continue;
            const collides = !(
              item.x + item.width <= draggedItem.x ||
              item.x >= draggedItem.x + draggedItem.width ||
              item.y + item.height <= draggedItem.y ||
              item.y >= draggedItem.y + draggedItem.height
            );

            if (collides) {
              // Find a new position for this item
              const newPos = findValidPosition(item, newItems, item.id);
              if (newPos) {
                newItems[i] = { ...item, x: newPos.x, y: newPos.y };
                hasCollisions = true;
              }
            }
          }
          iterations++;
        }

        // Final pass: ensure no overlaps at all
        for (let i = 0; i < newItems.length; i++) {
          for (let j = i + 1; j < newItems.length; j++) {
            const a = newItems[i];
            const b = newItems[j];
            const collides = !(
              a.x + a.width <= b.x ||
              a.x >= b.x + b.width ||
              a.y + a.height <= b.y ||
              a.y >= b.y + b.height
            );

            if (collides && b.id !== draggedId) {
              const newPos = findValidPosition(b, newItems, b.id);
              if (newPos) {
                newItems[j] = { ...b, x: newPos.x, y: newPos.y };
              }
            }
          }
        }

        return newItems;
      });
      setDraggingId(draggedId);
    },
    [findValidPosition]
  );

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const shuffleBlocks = useCallback(() => {
    setItems((prevItems) => {
      const shuffled: GridItem[] = [];
      const itemsToPlace = [...prevItems].sort(() => Math.random() - 0.5);

      for (const item of itemsToPlace) {
        // Try random positions until we find one that doesn't collide
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
          const randomX = Math.floor(
            Math.random() * (gridCols - item.width + 1)
          );
          const randomY = Math.floor(
            Math.random() * (gridRows - item.height + 1)
          );

          const collides = shuffled.some((other) => {
            return !(
              randomX + item.width <= other.x ||
              randomX >= other.x + other.width ||
              randomY + item.height <= other.y ||
              randomY >= other.y + other.height
            );
          });

          if (!collides) {
            shuffled.push({ ...item, x: randomX, y: randomY });
            placed = true;
          }
          attempts++;
        }

        // Fallback: find any valid position
        if (!placed) {
          for (let y = 0; y <= gridRows - item.height && !placed; y++) {
            for (let x = 0; x <= gridCols - item.width && !placed; x++) {
              const collides = shuffled.some((other) => {
                return !(
                  x + item.width <= other.x ||
                  x >= other.x + other.width ||
                  y + item.height <= other.y ||
                  y >= other.y + other.height
                );
              });
              if (!collides) {
                shuffled.push({ ...item, x, y });
                placed = true;
              }
            }
          }
        }

        // Ultimate fallback: keep original position
        if (!placed) {
          shuffled.push(item);
        }
      }

      return shuffled;
    });
  }, [gridCols, gridRows]);

  return (
    <section
      id="mondrian-grid"
      className="relative w-screen overflow-hidden bg-foreground box-border"
      style={{
        padding: LINE_WIDTH / 2,
        height: `calc(100svh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px - ${FIXED_BORDERS}px)`,
      }}
    >
      {items.map((item) => (
        <DraggableBlock
          key={item.id}
          item={item}
          cellSize={cellSize}
          onDrag={rearrangeItems}
          onDragEnd={handleDragEnd}
          isDragging={draggingId === item.id}
          gridCols={gridCols}
          gridRows={gridRows}
        />
      ))}

      <motion.button
        onClick={shuffleBlocks}
        className="absolute bottom-6 right-6 z-20 p-3 bg-background/90 hover:bg-background text-foreground rounded-full shadow-lg backdrop-blur-sm border border-foreground/20"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        title="Shuffle blocks"
      >
        <Icon icon={shuffleIcon} className="w-5 h-5" />
      </motion.button>
    </section>
  );
};
