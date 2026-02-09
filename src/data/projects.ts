export interface ProjectDetails {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  primaryLanguage?: string;
  githubStars?: number;
  techStack: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  reflections: string;
}

export const projects: ProjectDetails[] = [
  {
    title: "Install.sh",
    subtitle: "Automated Mac Setup",
    description:
      "Script that installs all the necessary tools for a fresh Mac setup. Automates the tedious process of setting up a new development environment.",
    imageUrl: "/assets/screenshots/install-sh.webp",
    githubUrl: "https://github.com/donnybrilliant/install.sh",
    primaryLanguage: "Bash",
    githubStars: 56,
    techStack: ["Bash", "Shell Scripting", "Homebrew", "macOS"],
    features: [
      "One-command installation of dev tools",
      "Configurable package list",
      "Dotfile management",
      "Application settings sync",
    ],
    challenges: [
      "Handling different macOS versions",
      "Managing dependencies between packages",
    ],
    solutions: [
      "Version detection and conditional installs",
      "Ordered installation with dependency checks",
    ],
    reflections:
      "I was tired of installing everything manually. This project automates the process of setting up a new Mac.",
  },
  {
    title: "Laelia",
    subtitle: "Chord Synth",
    description:
      "A browser-based chord synth. Chords, strums, arpeggios, harp modes. Add to home screen and pretend it's a real instrument. Inspired by the Orchid from Telepathic Instruments.",
    imageUrl: "/assets/screenshots/laelia.webp",
    githubUrl: "https://github.com/donnybrilliant/Laelia",
    liveUrl: "https://laelia.vierweb.no",
    primaryLanguage: "TS",
    techStack: ["React", "Vite", "TypeScript", "Tone.js", "Tailwind", "PWA"],
    features: [
      "Keyboard — poly, strum, arp, or harp mode",
      "Chord buttons — maj, min, dim, sus, extensions (6, m7, M7, 9)",
      "Rotary dials — volume, sound, FX, key, BPM, voicing",
      "Sound presets — Piano, Pad, Strings, Organ, Pluck, Bell, Synth, Brass",
      "Visualizer and installable PWA",
    ],
    challenges: [
      "Web Audio and Tone.js integration",
      "PWA install flow and audio unlock on mobile",
    ],
    solutions: [
      "Tone.js for synthesis and scheduling",
      "Add-to-home-screen flow with tap-to-unlock audio",
    ],
    reflections:
      "Built from a teaser idea of the Orchid — no demo, no manual. Just how I pictured a chord synth in the browser.",
  },
  {
    title: "Consolidate",
    subtitle: "VSCode Extension",
    description:
      "VSCode extension for consolidating multiple files into one. Perfect for sharing code or feeding to AI models.",
    imageUrl: "/assets/screenshots/consolidate.webp",
    githubUrl: "https://github.com/donnybrilliant/consolidate",
    liveUrl:
      "https://marketplace.visualstudio.com/items?itemName=Vierweb.consolidate",
    primaryLanguage: "TS",
    techStack: ["TypeScript", "VSCode API", "Node.js"],
    features: [
      "Multi-file selection",
      "Configurable output format",
      "Respects .gitignore",
      "Line number annotations",
    ],
    challenges: [
      "Learning the VSCode extension API",
      "Handling large file trees efficiently",
    ],
    solutions: [
      "Async file reading with streaming",
      "Virtual document providers for preview",
    ],
    reflections:
      "Building my first VSCode extension was challenging but rewarding. The extension now has real users which feels amazing!",
  },
  {
    title: "Package.json",
    subtitle: "Tool",
    description:
      "A tool for listing all dependencies used in my GitHub repositories. Aggregates package.json files across all repos.",
    imageUrl: "/assets/screenshots/package-json.webp",
    githubUrl: "https://github.com/donnybrilliant/packagejson",
    primaryLanguage: "JS",
    techStack: ["JavaScript", "GitHub API", "Node.js"],
    features: [
      "GitHub API integration",
      "Dependency aggregation",
      "Version tracking",
      "Export functionality",
    ],
    challenges: [
      "GitHub API rate limiting",
      "Parsing various package.json formats",
    ],
    solutions: [
      "Caching and batched requests",
      "Robust JSON parsing with fallbacks",
    ],
    reflections:
      "This started as a personal utility but evolved into something I use regularly to track my tech stack evolution.",
  },
  {
    title: "Invoice Manager",
    subtitle: "Personal Tool",
    description:
      "Personal invoice management system for freelance work. Track clients, projects, and payments.",
    imageUrl: "/assets/screenshots/invoice-manager.webp",
    githubUrl: "https://github.com/donnybrilliant/invoice-manager",
    primaryLanguage: "TS",
    techStack: ["TypeScript", "React", "Node.js", "Supabase", "Tailwind"],
    features: [
      "Invoice generation",
      "Client management",
      "Payment tracking",
      "PDF export",
    ],
    challenges: [
      "Designing intuitive invoice workflows",
      "Handling currency and tax calculations",
    ],
    solutions: [
      "Template-based invoice generation",
      "Configurable tax and currency settings",
    ],
    reflections:
      "Built out of necessity for my freelance work. Now saves me hours of manual invoice management.",
  },
  {
    title: "Terminal.sh",
    subtitle: '"Hacking" Game',
    description:
      "Terminal-based, multiplayer game inspired by Uplink and Hacknet. Players 'hack' into systems using command-line interfaces.",
    imageUrl: "/assets/screenshots/terminal-sh.webp",
    githubUrl: "https://github.com/donnybrilliant/terminal.sh",
    primaryLanguage: "GO",
    techStack: ["GO", "WebSocket", "TUI"],
    features: [
      "Custom terminal emulator",
      "Multiplayer networking",
      "Progressive difficulty",
      "Achievement system",
    ],
    challenges: [
      "Creating an authentic terminal feel",
      "Real-time multiplayer synchronization",
    ],
    solutions: [
      "Custom input parsing and command history",
      "WebSocket-based game state sync",
    ],
    reflections:
      "My passion project. Combining my love for retro games with web development. Still actively working on expanding it.",
  },
  {
    title: "Avataaars",
    subtitle: "React Component",
    description:
      "React component for generating customizable avataaars. Full-featured avatar generator with animation support and export capabilities.",
    imageUrl: "/assets/screenshots/avataaars.webp",
    githubUrl: "https://github.com/donnybrilliant/avataaars",
    liveUrl: "https://avataaars.vierweb.no",
    primaryLanguage: "TS",
    techStack: ["React", "TypeScript", "SVG"],
    features: [
      "Customizable avatar generation",
      "Animation features and hover effects",
      "Export as SVG, animated SVG, or GIF",
      "Automatic responsive sizing",
      "React 19 compatible",
    ],
    challenges: [
      "Implementing smooth animations",
      "Handling complex SVG compositions",
      "Optimizing export functionality",
    ],
    solutions: [
      "Framer Motion for animations",
      "SVG path optimization",
      "Canvas-based export for GIF",
    ],
    reflections:
      "First fork of a project. I was using it and it needed to be updated to work with React 19.",
  },
  {
    title: "Merchandizer",
    subtitle: "Backend Project",
    description:
      "Backend for an inventory management system for touring artists. Handles merch tracking, sales, and restocking.",
    imageUrl: "/assets/screenshots/merchandizer.webp",
    githubUrl: "https://github.com/donnybrilliant/merchandizer",
    liveUrl: "https://merchandizer.onrender.com/",
    primaryLanguage: "JS",
    techStack: ["Node.js", "Express", "MongoDB", "REST API"],
    features: [
      "CRUD operations for inventory",
      "Sales tracking and reporting",
      "User authentication",
      "Role-based access control",
    ],
    challenges: [
      "Designing a flexible inventory schema",
      "Handling concurrent stock updates",
    ],
    solutions: [
      "Mongoose middleware for validation",
      "Optimistic locking for stock management",
    ],
    reflections:
      "My first serious backend project. Learning to think in terms of data models and API design was a paradigm shift.",
  },
  {
    title: "Observatory",
    subtitle: "VPS Monitoring",
    description:
      "A SSH-based TUI for monitoring VPS system metrics. Real-time server health monitoring in your terminal.",
    imageUrl: "/assets/screenshots/observatory.webp",
    githubUrl: "https://github.com/donnybrilliant/observatory",
    primaryLanguage: "GO",
    techStack: ["GO", "SSH", "TUI", "Linux"],
    features: [
      "Real-time CPU & memory monitoring",
      "Disk usage tracking",
      "Network statistics",
      "Multiple server support",
    ],
    challenges: [
      "Learning Go from scratch",
      "Building responsive TUI components",
    ],
    solutions: [
      "Goroutines for concurrent data fetching",
      "Bubble Tea framework for TUI",
    ],
    reflections:
      "My first Go project. The language's simplicity and performance made it perfect for system monitoring tools.",
  },

  {
    title: "Screenshooter",
    subtitle: "Screenshot API",
    description:
      "API for taking screenshots of webpages. Automated screenshot service using headless browsers.",
    imageUrl: "/assets/screenshots/screenshooter.webp",
    githubUrl: "https://github.com/donnybrilliant/screenshooter",
    primaryLanguage: "JS",
    techStack: ["JavaScript", "Puppeteer", "Express", "Node.js"],
    features: [
      "Full page screenshots",
      "Viewport customization",
      "Multiple output formats",
      "Caching for performance",
    ],
    challenges: [
      "Managing browser instances efficiently",
      "Handling dynamic content loading",
    ],
    solutions: [
      "Browser pool for concurrent requests",
      "Configurable wait strategies",
    ],
    reflections:
      "Simple but useful API. Learning headless browser automation opened up many possibilities.",
  },


  {
    title: "Setlist to Playlist",
    subtitle: "Playlist Converter",
    description:
      "Tool for converting concert setlists into playable music playlists. Transform your favorite live show setlists into Spotify playlists with ease.",
    imageUrl: "/assets/screenshots/setlist-to-playlist.webp",
    liveUrl: "https://n8n.vierweb.no/form/fd524a17-d7ba-4bff-8625-1de21a1d1e21",
    primaryLanguage: "n8n",
    techStack: ["Web Development", "n8n", "Form Processing"],
    features: [
      "Setlist input form",
      "Playlist generation",
      "Music service integration",
      "Easy conversion workflow",
    ],
    challenges: [
      "Parsing setlist formats",
      "Matching songs to music service catalogs",
      "Handling variations in song titles",
    ],
    solutions: [
      "Structured form input",
      "API integration for music services",
      "Fuzzy matching algorithms",
    ],
    reflections:
      "A practical tool born from the need to recreate concert experiences. Combining my passion for music with web development to solve a real-world problem.",
  },
  {
    title: "Memory Pressure",
    subtitle: "Mac Menu Bar App",
    description:
      "Menu bar application for monitoring your Mac's memory usage in real-time. Helps you determine if you need more RAM or just better memory management.",
    imageUrl: "/assets/screenshots/memory-pressure.webp",
    githubUrl: "https://github.com/donnybrilliant/MemoryPressure",
    liveUrl: "https://apps.apple.com/us/app/memory-pressure/id6743992575?mt=12",
    primaryLanguage: "Swift",
    techStack: ["Swift", "macOS", "Menu Bar", "System Monitoring"],
    features: [
      "Real-time memory monitoring",
      "Menu bar indicator",
      "Visual alerts for high memory usage",
      "User-friendly interface",
    ],
    challenges: [
      "Accessing system memory metrics",
      "Creating a lightweight menu bar app",
      "Providing clear visual feedback",
    ],
    solutions: [
      "System framework integration for memory stats",
      "Efficient polling with minimal resource usage",
      "Color-coded indicators for memory pressure",
    ],
    reflections:
      "My first macOS app published on the App Store. Building a native Mac app taught me about system APIs and the importance of creating tools that solve real problems.",
  },
  {
    title: "TLDR",
    subtitle: "News CLI Tool",
    description:
      "Command-line tool for fetching and browsing news stories interactively. Terminal-based news reader with interactive navigation.",
    imageUrl: "/assets/screenshots/tldr.webp",
    githubUrl: "https://github.com/donnybrilliant/tldr",
    primaryLanguage: "Python",
    techStack: ["Python", "CLI", "Terminal UI"],
    features: [
      "Interactive news browsing",
      "Multiple news source support",
      "Terminal-based UI",
      "Article caching",
    ],
    challenges: [
      "Building an intuitive terminal interface",
      "Handling various news API formats",
      "Managing article pagination",
    ],
    solutions: [
      "Rich library for terminal formatting",
      "Unified API abstraction layer",
      "Efficient caching strategy",
    ],
    reflections:
      "A practical CLI tool that makes staying informed more efficient. Terminal-based tools have a special charm and are often faster than web interfaces.",
  },
  {
    title: "Time Tracker",
    subtitle: "CLI Tool",
    description:
      "CLI tool to track time spent on tasks, set hourly wages, and generate reports. Personal productivity tool for time management and invoicing.",
    imageUrl: "/assets/screenshots/time-tracker.webp",
    githubUrl: "https://github.com/donnybrilliant/time-tracker",
    primaryLanguage: "C",
    techStack: ["C", "CLI", "Data Persistence"],
    features: [
      "Task-based time tracking",
      "Hourly wage configuration",
      "Report generation",
      "Project categorization",
    ],
    challenges: [
      "Accurate time measurement",
      "Data persistence and recovery",
      "Generating readable reports",
    ],
    solutions: [
      "Precise timestamp tracking",
      "JSON-based data storage",
      "Formatted output with tables",
    ],
    reflections:
      "Built to solve my own time tracking needs. Simple tools that solve real problems are often the most valuable.",
  },
  {
    title: "Stavangerkameratene",
    subtitle: "Website",
    description:
      "Website for the band Stavangerkameratene. A modern, responsive website showcasing the band's music, events, and information.",
    imageUrl: "/assets/screenshots/stavangerkameratene.webp",
    liveUrl: "https://stavangerkameratene.no",
    primaryLanguage: "JavaScript",
    techStack: ["Web Development", "HTML", "CSS", "JavaScript"],
    features: [
      "Band information and bio",
      "Music player integration",
      "Event calendar",
      "Responsive design",
    ],
    challenges: [
      "Creating an engaging band website",
      "Integrating music playback",
      "Designing for mobile and desktop",
    ],
    solutions: [
      "Modern web design principles",
      "Audio API integration",
      "Mobile-first responsive approach",
    ],
    reflections:
      "Building a website for a real client was exciting. Balancing creative design with practical functionality taught me about client needs.",
  },
  {
    title: "Tommy Fredvang",
    subtitle: "Website",
    description:
      "Website for artist Tommy Fredvang. A portfolio website showcasing artwork, exhibitions, and artist information.",
    imageUrl: "/assets/screenshots/tommy-fredvang.webp",
    liveUrl: "https://tommyfredvang.no",
    primaryLanguage: "JavaScript",
    techStack: ["Web Development", "HTML", "CSS", "JavaScript"],
    features: [
      "Artwork gallery",
      "Exhibition listings",
      "Artist biography",
      "Contact information",
    ],
    challenges: [
      "Showcasing artwork effectively",
      "Creating an elegant gallery interface",
      "Optimizing image loading",
    ],
    solutions: [
      "Image optimization techniques",
      "Lazy loading for gallery",
      "Clean, minimal design approach",
    ],
    reflections:
      "Designing for an artist required a focus on visual presentation. The project emphasized the importance of letting content shine.",
  },
  {
    title: "Fru Johnsen",
    subtitle: "E-Commerce Store",
    description:
      "Business website for Fru Johnsens Sopp og Nyttevekster. An e-commerce platform for selling mushrooms and edible plants.",
    imageUrl: "/assets/screenshots/fru-johnsen.webp",
    liveUrl: "https://frujohnsen.no/",
    primaryLanguage: "JavaScript",
    techStack: ["E-Commerce", "Web Development", "HTML", "CSS", "JavaScript"],
    features: [
      "Product catalog",
      "Shopping cart functionality",
      "Product categories",
      "Business information",
    ],
    challenges: [
      "Building a specialized e-commerce site",
      "Organizing product categories",
      "Creating an intuitive shopping experience",
    ],
    solutions: [
      "Category-based navigation",
      "Clear product presentation",
      "Streamlined checkout process",
    ],
    reflections:
      "Working on a specialized e-commerce site for a local business was rewarding. Understanding their unique needs shaped the entire project.",
  },
  {
    title: "Holidaze",
    subtitle: "Project Exam 2",
    description:
      "A booking website using OpenAI, Google Maps, Unsplash APIs. Full-stack accommodation booking platform.",
    imageUrl: "/assets/screenshots/project-exam-2.webp",
    githubUrl: "https://github.com/donnybrilliant/project-exam-2",
    liveUrl: "https://project-exam-2-holidaze.netlify.app/",
    primaryLanguage: "React",
    techStack: [
      "React",
      "Tailwind CSS",
      "OpenAI API",
      "Google Maps API",
      "Unsplash API",
    ],
    features: [
      "AI-powered search suggestions",
      "Interactive map integration",
      "Dynamic image fetching",
      "Booking management system",
    ],
    challenges: [
      "Integrating multiple third-party APIs",
      "Managing complex state across components",
    ],
    solutions: [
      "Custom hooks for API abstraction",
      "Context-based state management",
    ],
    reflections:
      "This exam project pushed my limits. Combining AI with traditional web features opened my eyes to future possibilities.",
  },
  {
    title: "JavaScript Frameworks",
    subtitle: "Shop",
    description:
      "An E-Commerce Store built with React and Styled-Components. Course assignment exploring modern React patterns and component styling.",
    imageUrl: "/assets/screenshots/javascript-frameworks.webp",
    githubUrl: "https://github.com/donnybrilliant/javascript-frameworks-ca",
    liveUrl: "https://javascript-frameworks-ca.netlify.app/",
    primaryLanguage: "JavaScript",
    techStack: ["React", "Styled-Components", "JavaScript", "REST API"],
    features: [
      "Product catalog and filtering",
      "Shopping cart functionality",
      "Responsive design",
      "Styled-components theming",
    ],
    challenges: [
      "Learning styled-components syntax",
      "Managing cart state across components",
      "Implementing product filters",
    ],
    solutions: [
      "Component-based styling approach",
      "Context API for cart management",
      "Custom hooks for filtering logic",
    ],
    reflections:
      "This project introduced me to styled-components. The CSS-in-JS approach felt natural and made component styling more intuitive.",
  },
  {
    title: "Express Generator ESM",
    subtitle: "Project Template",
    description:
      "Generator for creating Express applications using ECMAScript Modules. Modern Express.js project scaffold with ESM support.",
    imageUrl: "/assets/screenshots/express-generator-esm.webp",
    githubUrl: "https://github.com/donnybrilliant/express-generator-esm",
    primaryLanguage: "JavaScript",
    techStack: ["Node.js", "Express", "ESM", "JavaScript"],
    features: [
      "ESM module support",
      "Express.js scaffolding",
      "Modern project structure",
      "TypeScript option",
    ],
    challenges: [
      "Migrating from CommonJS to ESM",
      "Ensuring compatibility with Express",
      "Creating a flexible generator",
    ],
    solutions: [
      "Proper package.json configuration",
      "ESM import/export syntax",
      "Template-based generation",
    ],
    reflections:
      "Modern JavaScript development benefits from ESM. This generator helps bootstrap projects with the latest standards from the start.",
  },
  {
    title: "Semester Project 2",
    subtitle: "Elementarium",
    description:
      "A blog about rendering elements in JavaScript. Built with Headless WordPress as the CMS, exploring modern content management approaches.",
    imageUrl: "/assets/screenshots/semester-project-2.webp",
    githubUrl: "https://github.com/donnybrilliant/semester-project-2-resit",
    liveUrl: "https://donnybrilliant.github.io/semester-project-2-resit/",
    primaryLanguage: "JavaScript",
    techStack: ["JavaScript", "WordPress REST API", "HTML", "CSS"],
    features: [
      "Headless WordPress integration",
      "Blog post rendering",
      "Category filtering",
      "Responsive blog layout",
    ],
    challenges: [
      "Understanding WordPress REST API",
      "Parsing and rendering WordPress content",
      "Handling WordPress media formats",
    ],
    solutions: [
      "REST API endpoint integration",
      "Content parsing utilities",
      "Image optimization and lazy loading",
    ],
    reflections:
      "Working with headless WordPress taught me the power of decoupling content management from presentation. The flexibility was eye-opening.",
  },
  {
    title: "Cross Course Project",
    subtitle: "Raindydays",
    description:
      "A webstore for a raincoat company. Built with Headless WordPress, featuring product catalog, shopping cart, and checkout functionality.",
    imageUrl: "/assets/screenshots/cross-course-project.webp",
    githubUrl:
      "https://github.com/Noroff-FEU-Assignments/cross-course-project-donnybrilliant",
    liveUrl: "https://daniel-vier-cross-course-project.netlify.app/",
    primaryLanguage: "JavaScript",
    techStack: ["JavaScript", "WordPress REST API", "HTML", "CSS"],
    features: [
      "Product catalog with filtering",
      "Shopping cart system",
      "Checkout process",
      "Headless WordPress CMS",
    ],
    challenges: [
      "Building a complete e-commerce flow",
      "Integrating WordPress product data",
      "Managing cart state persistence",
    ],
    solutions: [
      "LocalStorage for cart persistence",
      "WordPress REST API for products",
      "Modular component architecture",
    ],
    reflections:
      "My first full e-commerce project. Learning to handle the complete user journey from browsing to checkout was a valuable experience.",
  },

];
