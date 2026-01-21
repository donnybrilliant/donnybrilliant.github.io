import { calculateAge } from "@/utils";

// ANSI escape character (ESC)
export const ESC = String.fromCharCode(27);

// ANSI color codes for terminal styling
export const COLORS = {
  reset: `${ESC}[0m`,
  red: `${ESC}[31m`,
  green: `${ESC}[32m`,
  yellow: `${ESC}[33m`,
  blue: `${ESC}[34m`,
  magenta: `${ESC}[35m`,
  cyan: `${ESC}[36m`,
  white: `${ESC}[37m`,
  bold: `${ESC}[1m`,
  dim: `${ESC}[2m`,
};

// ASCII art for VIERWEB
export const ASCII_VIERWEB = [
  "██╗   ██╗██╗███████╗██████╗ ██╗    ██╗███████╗██████╗ ",
  "██║   ██║██║██╔════╝██╔══██╗██║    ██║██╔════╝██╔══██╗",
  "██║   ██║██║█████╗  ██████╔╝██║ █╗ ██║█████╗  ██████╔╝",
  "╚██╗ ██╔╝██║██╔══╝  ██╔══██╗██║███╗██║██╔══╝  ██╔══██╗",
  " ╚████╔╝ ██║███████╗██║  ██║╚███╔███╔╝███████╗██████╔╝",
  "  ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚═════╝ ",
];

// File system item interface
export interface FileSystemItem {
  name: string;
  type: "file" | "directory";
  content?: string;
  url?: string;
  children?: FileSystemItem[];
}

// User profile data
export const userProfile = {
  username: "daniel",
  name: "Daniel",
  age: calculateAge(),
  location: "Norway",
  role: "Web Developer",
  email: "daniel.vier@gmail.com",
  github: "https://github.com/donnybrilliant",
  linkedin: "https://linkedin.com/in/daniel-vier",
  skills:
    "React, TypeScript, JavaScript, HTML, CSS, Node.js, PHP, WordPress, Python",
  education: "Full Stack Development + Sociology BA",
};

// Create the static file system structure
export const createStaticFileSystem = (): FileSystemItem => ({
  name: "~",
  type: "directory",
  children: [
    {
      name: "github",
      type: "directory",
      children: [], // Will be populated with repos
    },
    {
      name: "projects",
      type: "directory",
      children: [], // Will be populated with repos (duplicate for convenience)
    },
    {
      name: "about",
      type: "directory",
      children: [
        {
          name: "me.txt",
          type: "file",
          content: `${userProfile.name} - ${userProfile.age} years old web developer based in ${userProfile.location}`,
        },
        {
          name: "skills.txt",
          type: "file",
          content: userProfile.skills,
        },
        {
          name: "education.txt",
          type: "file",
          content: userProfile.education,
        },
      ],
    },
    {
      name: "contact",
      type: "directory",
      children: [
        {
          name: "github.txt",
          type: "file",
          content: userProfile.github,
          url: userProfile.github,
        },
        {
          name: "linkedin.txt",
          type: "file",
          content: userProfile.linkedin,
          url: userProfile.linkedin,
        },
        {
          name: "email.txt",
          type: "file",
          content: userProfile.email,
          url: `mailto:${userProfile.email}`,
        },
      ],
    },
    {
      name: "readme.md",
      type: "file",
      content:
        "Welcome to Daniel's portfolio! Type 'help' for commands.\n\nNavigate to ~/github or ~/projects to explore my work!",
    },
  ],
});

// Music tracks for the music command
export interface MusicTrack {
  artist: string;
  song: string;
  mood: string;
}

export const musicTracks: MusicTrack[] = [
  { artist: "Daft Punk", song: "Digital Love", mood: "💾 Retro vibes" },
  { artist: "Boards of Canada", song: "Roygbiv", mood: "🌈 Nostalgic" },
  { artist: "Aphex Twin", song: "Xtal", mood: "🌙 Late night coding" },
  { artist: "Tycho", song: "Awake", mood: "☀️ Focus mode" },
  { artist: "C418", song: "Sweden", mood: "🟩 Blocky feelings" },
];

// Secret facts for the secret command
export const secretFacts = [
  "First computer: Commodore 64 (still misses it)",
  "Favorite error: 418 I'm a teapot",
  'Biggest fear: "It works on my machine"',
  "Superpower: Finding bugs at 2 AM",
  "Kryptonite: CSS centering (div not found)",
  "Dream project: An OS that runs on coffee",
];

// Hack simulation messages
export interface HackMessage {
  text: string;
  delay: number;
}

export const hackMessages: HackMessage[] = [
  {
    text: `${COLORS.green}Initiating connection to remote node...${COLORS.reset}`,
    delay: 500,
  },
  { text: `${COLORS.cyan}Connection established.${COLORS.reset}`, delay: 600 },
  {
    text: `${COLORS.yellow}Decrypting node access...${COLORS.reset}`,
    delay: 900,
  },
  { text: `${COLORS.green}Decryption successful.${COLORS.reset}`, delay: 700 },
  {
    text: `${COLORS.magenta}Accessing mainframe...${COLORS.reset}`,
    delay: 800,
  },
  {
    text: `${COLORS.red}Running exploit scripts...${COLORS.reset}`,
    delay: 1200,
  },
  {
    text: `${COLORS.green}${COLORS.bold}Exploit successful! Node compromised.${COLORS.reset}`,
    delay: 1000,
  },
  { text: `${COLORS.cyan}Gathering data...${COLORS.reset}`, delay: 1500 },
  {
    text: `${COLORS.green}Data downloaded. Disconnecting...${COLORS.reset}`,
    delay: 700,
  },
  {
    text: `${COLORS.white}Disconnected. Operation successful.${COLORS.reset}`,
    delay: 500,
  },
];

// Help command output generator
export const getHelpText = (): string => {
  return (
    `${COLORS.red}${COLORS.bold}📖 Available commands:${COLORS.reset}\n` +
    `${COLORS.green}  ls [-l]${COLORS.reset}              📂 List directory contents\n` +
    `${COLORS.green}  cd <dir>${COLORS.reset}             📁 Change directory\n` +
    `${COLORS.green}  cat <file>${COLORS.reset}           📄 Display file contents\n` +
    `${COLORS.green}  open <file>${COLORS.reset}          🔗 Open URL from file\n` +
    `${COLORS.green}  pwd${COLORS.reset}                  📍 Print working directory\n` +
    `${COLORS.green}  find <name>${COLORS.reset}          🔍 Search for files/dirs\n` +
    `${COLORS.green}  tree${COLORS.reset}                 🌳 Show directory structure\n` +
    `${COLORS.green}  clear${COLORS.reset}                🧹 Clear terminal\n` +
    `${COLORS.green}  whoami${COLORS.reset}               👤 Display user info\n` +
    `${COLORS.green}  date${COLORS.reset}                 📅 Show current date\n` +
    `${COLORS.green}  about${COLORS.reset}                🖥️  System info\n` +
    `${COLORS.green}  browser${COLORS.reset}              💻 Display browser info\n` +
    `${COLORS.cyan}  repos${COLORS.reset}                📊 List GitHub repos\n` +
    `${COLORS.cyan}  matrix${COLORS.reset}               🔢 Start Matrix animation\n` +
    `${COLORS.cyan}  hack${COLORS.reset}                 🔓 Simulate hacking\n` +
    `${COLORS.cyan}  snake${COLORS.reset}                🐍 Play Snake game\n` +
    `${COLORS.magenta}  music${COLORS.reset}               🎵 Now playing`
  );
};

// Whoami command output generator
export const getWhoamiText = (): string => {
  return (
    `${COLORS.cyan}${COLORS.bold}${userProfile.username}${COLORS.reset}\n` +
    `${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n` +
    `${COLORS.yellow}Role:${COLORS.reset}      ${userProfile.role} & Terminal Enthusiast\n` +
    `${COLORS.yellow}Age:${COLORS.reset}       ${userProfile.age} (born in the year of Tetris)\n` +
    `${COLORS.yellow}Location:${COLORS.reset}  ${userProfile.location} 🇳🇴 (land of trolls & fjords)\n` +
    `${COLORS.yellow}Fuel:${COLORS.reset}      Coffee ☕ (critical dependency)\n` +
    `${COLORS.yellow}Status:${COLORS.reset}    Probably debugging something\n` +
    `${COLORS.yellow}Mood:${COLORS.reset}      🟢 if (coffee) { happy } else { 😴 }\n` +
    `${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n` +
    `${COLORS.dim}Fun fact: Has strong opinions about tabs vs spaces${COLORS.reset}`
  );
};

// Music command output generator
export const getMusicText = (track: MusicTrack): string => {
  return (
    `${COLORS.magenta}${COLORS.bold}🎵 Now Playing:${COLORS.reset}\n` +
    `${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n` +
    `${COLORS.cyan}♫${COLORS.reset}  ${track.artist} - ${track.song}\n` +
    `${COLORS.dim}${track.mood}${COLORS.reset}\n` +
    `${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n` +
    `${COLORS.dim}[▶ advancement not supported in this terminal]${COLORS.reset}`
  );
};

// Secret command output generator
export const getSecretText = (): string => {
  const facts = secretFacts
    .map((fact) => `${COLORS.cyan}•${COLORS.reset} ${fact}`)
    .join("\n");
  return `${COLORS.red}${COLORS.bold}🔐 ACCESS GRANTED${COLORS.reset}
${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}
${COLORS.yellow}Hidden facts about ${userProfile.name}:${COLORS.reset}

${facts}

${COLORS.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}
${COLORS.dim}Try: sudo, coffee, 42${COLORS.reset}`;
};

// About command output generator
export const getAboutText = (repoCount: number): string => {
  return `
${COLORS.cyan}      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄${COLORS.reset}
${COLORS.cyan}      █                     █${COLORS.reset}   ${COLORS.green}${userProfile.username}@portfolio${COLORS.reset}
${COLORS.cyan}      █   ██████╗ ██╗   ██╗ █${COLORS.reset}   ----------------
${COLORS.cyan}      █   ██╔══██╗██║   ██║ █${COLORS.reset}   ${COLORS.yellow}OS:${COLORS.reset} Portfolio OS v2.0
${COLORS.cyan}      █   ██║  ██║██║   ██║ █${COLORS.reset}   ${COLORS.yellow}Shell:${COLORS.reset} custom-bash
${COLORS.cyan}      █   ██║  ██║╚██╗ ██╔╝ █${COLORS.reset}   ${COLORS.yellow}Theme:${COLORS.reset} Retro Pixel
${COLORS.cyan}      █   ██████╔╝ ╚████╔╝  █${COLORS.reset}   ${COLORS.yellow}Terminal:${COLORS.reset} React Terminal
${COLORS.cyan}      █   ╚═════╝   ╚═══╝   █${COLORS.reset}   ${COLORS.yellow}Repos:${COLORS.reset} ${repoCount} projects
${COLORS.cyan}      ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀${COLORS.reset}   ${COLORS.yellow}Memory:${COLORS.reset} ${userProfile.age} years
`;
};

// Fun command responses
export const funCommands = {
  sudo: `${COLORS.red}Nice try. This incident will be reported. 🚨${COLORS.reset}`,
  coffee:
    `${COLORS.yellow}☕ Brewing...${COLORS.reset}\n` +
    `${COLORS.green}████████████████████${COLORS.reset} 100%\n\n` +
    `${COLORS.cyan}Coffee ready!${COLORS.reset} Energy +100 ⚡\n` +
    `${COLORS.dim}Side effects: may cause excessive coding${COLORS.reset}`,
  "42": `${COLORS.cyan}The Answer to the Ultimate Question of Life, the Universe, and Everything.${COLORS.reset}\n${COLORS.dim}Don't forget your towel.${COLORS.reset}`,
};
