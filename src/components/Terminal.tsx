import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useDeferredValue,
  type KeyboardEvent,
  type JSX,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ESC,
  COLORS,
  createStaticFileSystem,
  userProfile,
  musicTracks,
  hackMessages,
  getHelpText,
  getWhoamiText,
  getMusicText,
  getSecretText,
  getAboutText,
  funCommands,
  type FileSystemItem,
} from "@/data/terminalData";
import { fetchGitHubRepos } from "@/api";

// Parse ANSI codes and convert to styled spans
const parseAnsiToHtml = (text: string): JSX.Element[] => {
  const parts: JSX.Element[] = [];
  let currentColor = "";
  let isBold = false;
  let isDim = false;
  let key = 0;

  // Match ANSI escape sequences: ESC[ followed by codes and 'm'
  const regex = new RegExp(
    `${ESC.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\[([0-9;]+)m`,
    "g"
  );
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      parts.push(
        <span
          key={key++}
          className={`${currentColor} ${isBold ? "font-bold" : ""} ${
            isDim ? "opacity-60" : ""
          }`}
        >
          {segment}
        </span>
      );
    }

    const code = match[1];
    if (code === "0") {
      currentColor = "";
      isBold = false;
      isDim = false;
    } else if (code === "1") {
      isBold = true;
    } else if (code === "2") {
      isDim = true;
    } else if (code === "31") {
      currentColor = "text-red-400";
    } else if (code === "32") {
      currentColor = "text-green-400";
    } else if (code === "33") {
      currentColor = "text-yellow-400";
    } else if (code === "34") {
      currentColor = "text-blue-400";
    } else if (code === "35") {
      currentColor = "text-magenta-400";
    } else if (code === "36") {
      currentColor = "text-cyan-400";
    } else if (code === "37") {
      currentColor = "text-white";
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const segment = text.slice(lastIndex);
    parts.push(
      <span
        key={key++}
        className={`${currentColor} ${isBold ? "font-bold" : ""} ${
          isDim ? "opacity-60" : ""
        }`}
      >
        {segment}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key={0}>{text}</span>];
};

// Check if a string is a URL
const isUrl = (str: string): boolean => {
  return (
    str.startsWith("http://") || str.startsWith("https://") || str.includes("@")
  );
};

// Render text with clickable links
const renderWithLinks = (text: string): JSX.Element => {
  const words = text.split(/(\s+)/);
  return (
    <>
      {words.map((word, i) => {
        if (isUrl(word)) {
          const href =
            word.includes("@") && !word.startsWith("http")
              ? `mailto:${word}`
              : word;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              {word}
            </a>
          );
        }
        return <span key={i}>{word}</span>;
      })}
    </>
  );
};

export const Terminal = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem>(
    createStaticFileSystem
  );
  const [history, setHistory] = useState<
    { type: "input" | "output"; text: string; isHtml?: boolean }[]
  >([{ type: "output", text: "Welcome to Daniel's Terminal v2.0" }]);

  // Defer history rendering for smoother input during rapid output
  const deferredHistory = useDeferredValue(history);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>(["~"]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const username = userProfile.username;
  const [isMatrixRunning, setIsMatrixRunning] = useState(false);
  const [matrixChars, setMatrixChars] = useState<
    { char: string; x: number; y: number }[]
  >([]);
  const [isSnakeRunning, setIsSnakeRunning] = useState(false);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([]);
  const [food, setFood] = useState<{ x: number; y: number }[]>([]);
  const [snakeDirection, setSnakeDirection] = useState<{
    x: number;
    y: number;
  }>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isAsciiAnimating, setIsAsciiAnimating] = useState(true);
  const [asciiChars, setAsciiChars] = useState<
    { char: string; x: number; y: number; targetY: number; fallen: boolean }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientContainerRef = useRef<HTMLDivElement>(null);
  const matrixIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const snakeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ASCII gradient drop animation on mount
  useEffect(() => {
    // Generate ASCII gradient that fills the screen
    const generateGradient = (): {
      char: string;
      x: number;
      y: number;
      targetY: number;
      fallen: boolean;
    }[] => {
      const chars: {
        char: string;
        x: number;
        y: number;
        targetY: number;
        fallen: boolean;
      }[] = [];

      // Get container dimensions - use viewport as fallback
      const width = gradientContainerRef.current?.clientWidth || window.innerWidth;
      const height = gradientContainerRef.current?.clientHeight || window.innerHeight;
      
      // Calculate grid based on character size (approximately 8px wide, 16px tall)
      const charWidth = 8;
      const charHeight = 16;
      const cols = Math.floor(width / charWidth);
      const rows = Math.floor(height / charHeight);

      // Gradient characters from light to dark
      const gradientChars = ["░", "▒", "▓", "█"];
      
      // Create a radial gradient pattern from center
      const centerX = cols / 2;
      const centerY = rows / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Calculate distance from center for radial gradient
          const dx = col - centerX;
          const dy = row - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const normalizedDist = Math.min(dist / maxDist, 1);

          // Create smooth gradient from center to edges
          const gradientValue = normalizedDist;
          
          // Select character based on gradient value (inverted so center is darker)
          const charIndex = Math.floor((1 - gradientValue) * (gradientChars.length - 1));
          const char = gradientChars[charIndex];

          // Add characters with varying density for organic feel
          const density = 0.75 + (normalizedDist * 0.2); // More dense at edges
          if (Math.random() < density) {
            chars.push({
              char,
              x: (col / cols) * 100,
              y: (row / rows) * 100,
              targetY: 100 + Math.random() * 30,
              fallen: false,
            });
          }
        }
      }

      return chars;
    };

    // Generate gradient after a brief delay to ensure container is rendered
    const timer = setTimeout(() => {
      const chars = generateGradient();
      setAsciiChars(chars);

      // Start dropping after 1.5 seconds
      dropTimerRef.current = setTimeout(() => {
        dropIntervalRef.current = setInterval(() => {
          setAsciiChars((prev) => {
            const updated = prev.map((c) => {
              if (!c.fallen && c.y < c.targetY) {
                return { ...c, y: c.y + 3 + Math.random() * 2 };
              } else if (c.y >= c.targetY && !c.fallen) {
                return { ...c, fallen: true };
              }
              return c;
            });

            // Check if all have fallen
            if (updated.every((c) => c.fallen)) {
              if (dropIntervalRef.current) {
                clearInterval(dropIntervalRef.current);
                dropIntervalRef.current = null;
              }
              setTimeout(() => {
                setIsAsciiAnimating(false);
              }, 300);
            }

            return updated;
          });
        }, 30);
      }, 1500);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    };
  }, []);

  // Fetch GitHub repos with react-query (prefetched in App.tsx)
  const {
    data: repos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["github-repos"],
    queryFn: fetchGitHubRepos,
  });

  // Update file system when repos are loaded
  useEffect(() => {
    if (!repos) return;

    const repoItems: FileSystemItem[] = repos
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        type: "directory" as const,
        children: [
          {
            name: "README.md",
            type: "file" as const,
            content: `# ${repo.name}\n\n${
              repo.description || "No description available."
            }\n\n🔗 ${repo.html_url}${
              repo.homepage ? `\n🌐 ${repo.homepage}` : ""
            }\n\n${repo.language ? `📝 Language: ${repo.language}` : ""}${
              repo.topics.length > 0
                ? `\n🏷️  Topics: ${repo.topics.join(", ")}`
                : ""
            }\n⭐ Stars: ${repo.stargazers_count}`,
          },
          {
            name: "open.txt",
            type: "file" as const,
            content: repo.html_url,
            url: repo.html_url,
          },
          ...(repo.homepage
            ? [
                {
                  name: "website.txt",
                  type: "file" as const,
                  content: repo.homepage,
                  url: repo.homepage,
                },
              ]
            : []),
        ],
      }));

    setFileSystem((prev) => {
      const newFs = { ...prev };
      const githubDir = newFs.children?.find((c) => c.name === "github");
      const projectsDir = newFs.children?.find((c) => c.name === "projects");
      if (githubDir) {
        githubDir.children = repoItems;
      }
      if (projectsDir) {
        projectsDir.children = repoItems;
      }
      return newFs;
    });

    setHistory((prev) => [
      ...prev.slice(0, -1), // Remove "Loading..." message
      {
        type: "output",
        text: `${COLORS.green}✓ Loaded ${repoItems.length} GitHub repositories!${COLORS.reset}`,
        isHtml: true,
      },
      {
        type: "output",
        text: `Type '${COLORS.cyan}cd github${COLORS.reset}' to explore projects, or '${COLORS.cyan}help${COLORS.reset}' for commands.\n`,
        isHtml: true,
      },
    ]);
  }, [repos]);

  // Handle fetch error
  useEffect(() => {
    if (!isError) return;

    setHistory((prev) => [
      ...prev.slice(0, -1),
      {
        type: "output",
        text: `${COLORS.yellow}⚠ Could not load GitHub repos. Using cached data.${COLORS.reset}`,
        isHtml: true,
      },
      { type: "output", text: "Type 'help' for available commands.\n" },
    ]);
  }, [isError]);

  useEffect(() => {
    inputRef.current?.focus();
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const getCurrentDir = useCallback((): FileSystemItem | null => {
    let current: FileSystemItem | null = fileSystem;
    for (let i = 1; i < currentPath.length; i++) {
      const found: FileSystemItem | undefined = current?.children?.find(
        (c) => c.name === currentPath[i]
      );
      if (found?.type === "directory") {
        current = found;
      } else {
        return null;
      }
    }
    return current;
  }, [currentPath, fileSystem]);

  // Matrix effect
  const startMatrix = useCallback(() => {
    setIsMatrixRunning(true);
    setHistory([]);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const columns = 60; // More columns for wider coverage
    const drops: number[] = Array(columns).fill(1);

    matrixIntervalRef.current = setInterval(() => {
      const newChars: { char: string; x: number; y: number }[] = [];
      for (let i = 0; i < columns; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        newChars.push({ char, x: (i / columns) * 100, y: drops[i] }); // Responsive positioning
        if (Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
        if (drops[i] > 30) drops[i] = 0;
      }
      setMatrixChars((prev) => [...prev.slice(-300), ...newChars]);
    }, 80);
  }, []);

  const stopMatrix = () => {
    if (matrixIntervalRef.current) {
      clearInterval(matrixIntervalRef.current);
      matrixIntervalRef.current = null;
    }
    setIsMatrixRunning(false);
    setMatrixChars([]);
    setHistory([
      { type: "output", text: "Matrix stopped. Press any key to continue." },
    ]);
  };

  // Snake game
  const initSnake = useCallback(() => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood([
      { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 15) },
      { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 15) },
    ]);
    setSnakeDirection({ x: 1, y: 0 });
    setGameOver(false);
  }, []);

  const startSnake = useCallback(() => {
    setIsSnakeRunning(true);
    setHistory([]);
    initSnake();
  }, [initSnake]);

  // Snake game loop
  useEffect(() => {
    if (!isSnakeRunning || gameOver) return;

    snakeIntervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        if (prevSnake.length === 0) return prevSnake;

        const head = {
          x: prevSnake[0].x + snakeDirection.x,
          y: prevSnake[0].y + snakeDirection.y,
        };

        // Check wall collision
        if (head.x < 0 || head.x >= 25 || head.y < 0 || head.y >= 18) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        setFood((prevFood) => {
          const eaten = prevFood.findIndex(
            (f) => f.x === head.x && f.y === head.y
          );
          if (eaten !== -1) {
            const newFood = [...prevFood];
            newFood[eaten] = {
              x: Math.floor(Math.random() * 25),
              y: Math.floor(Math.random() * 18),
            };
            return newFood;
          }
          newSnake.pop();
          return prevFood;
        });

        return newSnake;
      });
    }, 150);

    return () => {
      if (snakeIntervalRef.current) {
        clearInterval(snakeIntervalRef.current);
      }
    };
  }, [isSnakeRunning, gameOver, snakeDirection]);

  const stopSnake = () => {
    if (snakeIntervalRef.current) {
      clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = null;
    }
    setIsSnakeRunning(false);
    setSnake([]);
    setFood([]);
    setGameOver(false);
    setHistory((prev) => [
      ...prev,
      { type: "output", text: "Snake game ended." },
    ]);
  };

  // Hack simulation
  const runHack = useCallback(async () => {
    for (const msg of hackMessages) {
      await new Promise((resolve) => setTimeout(resolve, msg.delay));
      setHistory((prev) => [
        ...prev,
        { type: "output", text: msg.text, isHtml: true },
      ]);
    }
  }, []);

  const processCommand = useCallback(
    (cmd: string): string => {
      const parts = cmd.trim().split(" ");
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (command) {
        case "help":
          return getHelpText();

        case "ls": {
          const dir = getCurrentDir();
          if (!dir?.children)
            return `${COLORS.red}No files found${COLORS.reset}`;
          const listMode = args.includes("-l");
          return dir.children
            .map((c) => {
              if (c.type === "directory") {
                return listMode
                  ? `${COLORS.blue}[DIR]${COLORS.reset}  📁 ${c.name}/`
                  : `📁 ${COLORS.blue}${c.name}/${COLORS.reset}`;
              }
              const icon = c.url ? "🔗" : "📄";
              return listMode
                ? `${COLORS.green}[FILE]${COLORS.reset} ${icon} ${c.name}`
                : `${icon} ${c.name}`;
            })
            .join("\n");
        }

        case "cd":
          if (!args[0] || args[0] === "~") {
            setCurrentPath(["~"]);
            return "";
          }
          if (args[0] === "..") {
            if (currentPath.length > 1) {
              setCurrentPath((prev) => prev.slice(0, -1));
            }
            return "";
          }
          // Handle multi-level paths like "github/repo-name"
          if (args[0].includes("/")) {
            const pathParts = args[0].split("/").filter(Boolean);
            let tempPath = [...currentPath];
            let tempDir: FileSystemItem | null = getCurrentDir();

            for (const part of pathParts) {
              if (part === "..") {
                if (tempPath.length > 1) tempPath = tempPath.slice(0, -1);
              } else {
                const found = tempDir?.children?.find(
                  (c) => c.name === part && c.type === "directory"
                );
                if (found) {
                  tempPath.push(part);
                  tempDir = found;
                } else {
                  return `${COLORS.red}cd: no such directory: ${args[0]}${COLORS.reset}`;
                }
              }
            }
            setCurrentPath(tempPath);
            return "";
          }

          {
            const targetDir = getCurrentDir()?.children?.find(
              (c) => c.name === args[0] && c.type === "directory"
            );
            if (targetDir) {
              setCurrentPath((prev) => [...prev, args[0]]);
              return "";
            }
          }
          return `${COLORS.red}cd: no such directory: ${args[0]}${COLORS.reset}`;

        case "cat": {
          if (!args[0])
            return `${COLORS.yellow}Usage: cat <filename>${COLORS.reset}`;
          const file = getCurrentDir()?.children?.find(
            (c) => c.name === args[0] && c.type === "file"
          );
          if (file?.content) return file.content;
          return `${COLORS.red}cat: ${args[0]}: No such file${COLORS.reset}`;
        }

        case "open": {
          if (!args[0])
            return `${COLORS.yellow}Usage: open <filename>${COLORS.reset}`;
          const fileToOpen = getCurrentDir()?.children?.find(
            (c) => c.name === args[0] && c.type === "file"
          );
          if (fileToOpen?.url) {
            window.open(fileToOpen.url, "_blank");
            return `${COLORS.green}Opening ${fileToOpen.url}...${COLORS.reset}`;
          }
          if (fileToOpen?.content && isUrl(fileToOpen.content.trim())) {
            window.open(fileToOpen.content.trim(), "_blank");
            return `${COLORS.green}Opening ${fileToOpen.content.trim()}...${
              COLORS.reset
            }`;
          }
          return `${COLORS.red}open: ${args[0]}: Not a URL file${COLORS.reset}`;
        }

        case "find": {
          if (!args[0])
            return `${COLORS.yellow}Usage: find <name>${COLORS.reset}`;
          const searchTerm = args[0].toLowerCase();
          const results: string[] = [];

          const searchDir = (item: FileSystemItem, path: string) => {
            if (item.name.toLowerCase().includes(searchTerm)) {
              results.push(
                `${path}${item.name}${item.type === "directory" ? "/" : ""}`
              );
            }
            item.children?.forEach((child) =>
              searchDir(child, `${path}${item.name}/`)
            );
          };

          fileSystem.children?.forEach((child) => searchDir(child, "~/"));

          if (results.length === 0)
            return `${COLORS.yellow}No matches found for '${args[0]}'${COLORS.reset}`;
          return results
            .map((r) => `${COLORS.cyan}${r}${COLORS.reset}`)
            .join("\n");
        }

        case "repos": {
          const githubDir = fileSystem.children?.find(
            (c) => c.name === "github"
          );
          if (!githubDir?.children?.length) {
            return `${COLORS.yellow}No repos loaded. Try refreshing.${COLORS.reset}`;
          }
          const repoList = githubDir.children
            .slice(0, 20)
            .map(
              (repo, i) =>
                `${COLORS.cyan}${(i + 1).toString().padStart(2)}.${
                  COLORS.reset
                } 📦 ${repo.name}`
            )
            .join("\n");
          return `${COLORS.green}${COLORS.bold}📊 GitHub Repositories (${githubDir.children.length} total):${COLORS.reset}\n${repoList}\n\n${COLORS.dim}Use 'cd github/<repo-name>' to explore a repo${COLORS.reset}`;
        }

        case "pwd":
          return `${COLORS.cyan}${currentPath
            .join("/")
            .replace("~", `/home/${username}`)}${COLORS.reset}`;

        case "clear":
          setHistory([]);
          return "";

        case "whoami":
          return getWhoamiText();

        case "music": {
          const track =
            musicTracks[Math.floor(Math.random() * musicTracks.length)];
          return getMusicText(track);
        }

        case "secret":
          return getSecretText();

        case "sudo":
          return funCommands.sudo;

        case "coffee":
          return funCommands.coffee;

        case "42":
          return funCommands["42"];

        case "date":
          return `${COLORS.cyan}${new Date().toString()}${COLORS.reset}`;

        case "echo":
          return args.join(" ");

        case "browser":
          return (
            `${COLORS.cyan}User Agent:${COLORS.reset} ${navigator.userAgent}\n` +
            `${COLORS.cyan}Screen:${COLORS.reset} ${screen.width}x${screen.height}\n` +
            `${COLORS.cyan}Window:${COLORS.reset} ${window.innerWidth}x${window.innerHeight}\n` +
            `${COLORS.cyan}URL:${COLORS.reset} ${window.location.href}`
          );

        case "tree": {
          const printTree = (
            item: FileSystemItem,
            prefix = "",
            isLast = true
          ): string => {
            const connector = isLast ? "└── " : "├── ";
            const icon =
              item.type === "directory" ? "📁" : item.url ? "🔗" : "📄";
            const color =
              item.type === "directory" ? COLORS.blue : COLORS.reset;
            let result = `${prefix}${connector}${color}${icon} ${item.name}${COLORS.reset}\n`;

            if (item.children) {
              const newPrefix = prefix + (isLast ? "    " : "│   ");
              const childrenLength = item.children.length;
              item.children.forEach((child, i) => {
                const childIsLast = i === childrenLength - 1;
                result += printTree(child, newPrefix, childIsLast);
              });
            }
            return result;
          };

          const dir = getCurrentDir();
          if (!dir?.children)
            return `${COLORS.yellow}Empty directory${COLORS.reset}`;

          let result = `${COLORS.blue}📁 ${dir.name}${COLORS.reset}\n`;
          const childrenLength = dir.children.length;
          dir.children.forEach((child, i) => {
            result += printTree(child, "", i === childrenLength - 1);
          });
          return result;
        }

        case "about": {
          const githubDir = fileSystem.children?.find(
            (c) => c.name === "github"
          );
          const repoCount = githubDir?.children?.length || 0;
          return getAboutText(repoCount);
        }

        case "matrix":
          startMatrix();
          return "";

        case "hack":
          runHack();
          return `${COLORS.green}Starting hack sequence...${COLORS.reset}`;

        case "snake":
          startSnake();
          return "";

        case "":
          return "";

        default:
          return `${COLORS.red}command not found: ${command}${COLORS.reset}. Type 'help' for available commands.`;
      }
    },
    [
      currentPath,
      getCurrentDir,
      username,
      startMatrix,
      runHack,
      startSnake,
      fileSystem,
    ]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey && e.key === "c") || e.key === "Escape") {
      if (isMatrixRunning) {
        stopMatrix();
        return;
      }
      if (isSnakeRunning) {
        stopSnake();
        return;
      }
    }

    if (isSnakeRunning && !gameOver) {
      if (e.key === "ArrowUp" && snakeDirection.y !== 1) {
        setSnakeDirection({ x: 0, y: -1 });
      } else if (e.key === "ArrowDown" && snakeDirection.y !== -1) {
        setSnakeDirection({ x: 0, y: 1 });
      } else if (e.key === "ArrowLeft" && snakeDirection.x !== 1) {
        setSnakeDirection({ x: -1, y: 0 });
      } else if (e.key === "ArrowRight" && snakeDirection.x !== -1) {
        setSnakeDirection({ x: 1, y: 0 });
      }
      return;
    }

    if (e.key === "Enter" && input.trim()) {
      const output = processCommand(input);
      setHistory((prev) => [
        ...prev,
        { type: "input", text: `${currentPath.join("/")} $ ${input}` },
        ...(output
          ? [{ type: "output" as const, text: output, isHtml: true }]
          : []),
      ]);
      setCommandHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const inputParts = input.split(" ");
      const lastPart = inputParts[inputParts.length - 1];
      const files = getCurrentDir()?.children?.map((c) => c.name) || [];
      const matches = files.filter((f) =>
        f.toLowerCase().startsWith(lastPart.toLowerCase())
      );
      if (matches.length === 1) {
        inputParts[inputParts.length - 1] = matches[0];
        setInput(inputParts.join(" "));
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          { type: "output", text: matches.join("  ") },
        ]);
      }
    }
  };

  // ASCII gradient drop animation render
  if (isAsciiAnimating) {
    return (
      <div
        ref={gradientContainerRef}
        className="h-full bg-terminal-bg font-mono text-sm overflow-hidden relative cursor-pointer"
        onClick={() => {
          setIsAsciiAnimating(false);
        }}
      >
        <div className="absolute inset-0">
          {asciiChars.map((item, i) => (
            <span
              key={i}
              className="absolute text-primary font-bold text-xs transition-none whitespace-pre"
              style={{
                left: `${item.x}%`,
                top: item.fallen
                  ? `${item.y}%`
                  : `${item.y}%`,
                opacity: item.fallen ? 0 : 1,
                textShadow: "0 0 5px currentColor",
                transform: item.fallen
                  ? `translateY(${(item.y - 100) * 5}px)`
                  : "none",
              }}
            >
              {item.char}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 text-primary/70 text-xs">
          Click to skip
        </div>
      </div>
    );
  }

  // Matrix effect render
  if (isMatrixRunning) {
    return (
      <div
        className="h-full bg-black font-mono text-sm overflow-hidden relative cursor-pointer"
        onClick={stopMatrix}
        onKeyDown={(e) => {
          if ((e.ctrlKey && e.key === "c") || e.key === "Escape") {
            stopMatrix();
          }
        }}
        tabIndex={0}
        autoFocus
      >
        <div className="absolute inset-0 overflow-hidden">
          {matrixChars.map((item, i) => (
            <span
              key={i}
              className="absolute text-green-500 text-xs"
              style={{
                left: `${item.x}%`,
                top: `${item.y * 3}%`,
                opacity: 1 - (i / matrixChars.length) * 0.5,
              }}
            >
              {item.char}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 text-green-500 opacity-70 text-xs">
          Click to close
        </div>
      </div>
    );
  }

  // Snake game render
  if (isSnakeRunning) {
    return (
      <div
        className="h-full bg-terminal-bg font-mono text-sm p-4 overflow-hidden relative"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative w-full h-full border-2 border-green-500">
          {food.map((f, i) => (
            <div
              key={`food-${i}`}
              className="absolute w-3 h-3 bg-red-500 rounded-full"
              style={{
                left: `${f.x * 4}%`,
                top: `${f.y * 5.5}%`,
              }}
            />
          ))}
          {snake.map((seg, i) => (
            <div
              key={`snake-${i}`}
              className={`absolute w-3 h-3 ${
                i === 0 ? "bg-green-400" : "bg-green-600"
              }`}
              style={{
                left: `${seg.x * 4}%`,
                top: `${seg.y * 5.5}%`,
              }}
            />
          ))}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <pre className="text-red-500 text-xs">
                {`  _____                         ____                 
 / ____|                       / __ \\                
| |  __  __ _ _ __ ___   ___  | |  | |_   _____ _ __ 
| | |_ |/ _\` | '_ \` _ \\ / _ \\ | |  | \\ \\ / / _ \\ '__|
| |__| | (_| | | | | | |  __/ | |__| |\\ V /  __/ |   
 \\_____|\\__,_|_| |_| |_|\\___|  \\____/  \\_/ \\___|_|`}
              </pre>
              <p className="text-green-500 mt-4">Score: {snake.length}</p>
              <p className="text-white mt-2 text-xs">Press Ctrl+C to exit</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          className="absolute opacity-0"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {!gameOver && (
          <div className="absolute bottom-2 left-2 text-green-500 text-xs">
            Use arrow keys to move • Score: {snake.length} • Ctrl+C to quit
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full bg-terminal-bg font-mono text-sm p-4 overflow-auto relative scanlines cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {deferredHistory.map((line, i) => (
        <div
          key={i}
          className={`whitespace-pre-wrap animate-terminal-line ${
            line.type === "input"
              ? "text-terminal-prompt"
              : "text-terminal-text"
          }`}
        >
          {line.isHtml
            ? parseAnsiToHtml(line.text)
            : renderWithLinks(line.text)}
        </div>
      ))}
      {!isAsciiAnimating && (
        <div className="flex items-center">
          <span className="text-terminal-prompt">
            {currentPath.join("/")} $&nbsp;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-terminal-text outline-none caret-primary"
            autoFocus
            spellCheck={false}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};
