import "@fontsource/silkscreen";
import "@fontsource/dosis";

import "./style.css";
import initTerminal from "./src/terminal";
import { toggleMenu, setupNavItems } from "./src/navigation.js";
import { setupScrollspy } from "./src/scrollspy.js";
import {
  manualAvatarChange,
  startRegularInterval,
  updateAvatar,
} from "./src/avatar.js";
import { typeWriter } from "./src/typewriter.js";
import { fetchData, fetchFileSystemData } from "./src/api.js";
import { toggleTerminalVisibility } from "./src/terminalToggle.js";
import { initThemeSlider } from "./src/theme.js";
import { initFontAwesome } from "./src/fontawesome.js";

// Import avatar images
import avatar0 from "./assets/avatars/avatar.svg";
import avatar1 from "./assets/avatars/avatar1.svg";
import avatar2 from "./assets/avatars/avatar2.svg";
import avatar3 from "./assets/avatars/avatar3.svg";
import avatar4 from "./assets/avatars/avatar4.svg";
import avatar5 from "./assets/avatars/avatar5.svg";
import avatar6 from "./assets/avatars/avatar6.svg";

// Font loading detection
const loadFonts = async () => {
  // Define the fonts we're using
  const fonts = [
    { family: "Dosis", weight: 200 },
    { family: "Dosis", weight: 400 },
    { family: "Silkscreen", weight: 400 },
  ];

  try {
    // First, try to detect if fonts are already loaded
    const fontCheckPromises = fonts.map(async ({ family, weight }) => {
      try {
        // Check if font is already available
        const isLoaded = document.fonts.check(`${weight} 1em "${family}"`);
        if (isLoaded) {
          console.log(`✅ Font already loaded: ${family} ${weight}`);
          return Promise.resolve();
        }

        // Try to load the font
        await document.fonts.load(`${weight} 1em "${family}"`);
        console.log(`✅ Loaded: ${family} ${weight}`);
      } catch (fontError) {
        console.warn(`⚠️ Failed to load ${family} ${weight}:`, fontError);
        // Continue even if one font fails
      }
    });

    // Wait for all font loading attempts
    await Promise.allSettled(fontCheckPromises);

    // Add a small delay to ensure fonts are fully rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Add the fonts-loaded class to body
    document.body.classList.add("fonts-loaded");
    console.log("🎉 Font loading process completed!");
  } catch (error) {
    console.error("❌ Font loading failed:", error);
    // Still add the class to prevent infinite loading state
    document.body.classList.add("fonts-loaded");
  }
};

// Alternative approach: Use FontFace API as fallback
const loadFontsWithFallback = async () => {
  const fonts = [
    { family: "Dosis", weight: 200 },
    { family: "Dosis", weight: 400 },
    { family: "Silkscreen", weight: 400 },
  ];

  try {
    // Try the standard approach first
    await loadFonts();
  } catch (error) {
    console.log("🔄 Trying FontFace API fallback...");

    // Fallback: Use FontFace API
    const fontFacePromises = fonts.map(async ({ family, weight }) => {
      try {
        // Try to load from @fontsource paths
        const fontFace = new FontFace(
          family,
          `url(/node_modules/@fontsource/${family.toLowerCase()}/files/${family.toLowerCase()}-latin-${weight}-normal.woff2)`,
          {
            weight: weight.toString(),
            display: "swap",
          }
        );

        await fontFace.load();
        document.fonts.add(fontFace);
        console.log(`✅ FontFace loaded: ${family} ${weight}`);
      } catch (fontError) {
        console.warn(`⚠️ FontFace failed for ${family} ${weight}:`, fontError);
      }
    });

    await Promise.allSettled(fontFacePromises);
    document.body.classList.add("fonts-loaded");
  }
};

// DOM Elements
const navigation = document.querySelector("#navigation");
const navToggle = document.querySelector("#nav-toggle");
const navItems = document.querySelectorAll("#navigation li a");
const sections = document.querySelectorAll("section");
const typeContainer = document.querySelector("#home div p");
const togglePackageJson = document.querySelector("#toggle-package-json");
const packageJson = document.querySelector("#package-json");
const toggleTerminal = document.querySelector("#toggle-terminal");
const terminalElement = document.querySelector("#terminal");
const avatar = document.getElementById("avatar");
const avatars = [avatar0, avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

// Initialize modules
initFontAwesome();
setupNavItems(navItems, navigation, navToggle);
setupScrollspy(sections, navItems);

// Terminal variables
let fileSystemData = null;
let isTerminalInitialized = false;

// TypeWriter variables
let textPosition = 0;
const speed = 30;
let messageArray = [
  `My name is Daniel, I am a web developer. <br />
   Check out my <a href="#toggle-package-json">package.json</a> or browse my GitHub Projects through the <a href="#toggle-terminal">terminal</a>. <br />
   I like <a href="https://ragerrr.netlify.app/" target="_blank">random stuff</a>, like the theme slider in the lower right corner`,
];

// Avatar variables
let currentIndex = 0;
let direction = 1;

// Event listeners

// Toggle navigation menu
navToggle.addEventListener("click", () => toggleMenu(navigation, navToggle));
// Toggle package.json
togglePackageJson.addEventListener("click", () => {
  const isActive = packageJson.classList.contains("active");
  packageJson.classList.toggle("active");
  togglePackageJson.setAttribute("aria-expanded", !isActive);
});
// Toggle terminal
toggleTerminal.addEventListener("click", () => {
  toggleTerminalVisibility(
    terminalElement,
    isTerminalInitialized,
    initTerminal,
    fileSystemData
  );
  const isExpanded = toggleTerminal.getAttribute("aria-expanded") === "true";
  toggleTerminal.setAttribute("aria-expanded", !isExpanded);
});
// Hover effect for avatar
avatar.addEventListener("mouseover", () => (avatar.src = avatar6));
// Reset avatar after hover
avatar.addEventListener("mouseout", () =>
  updateAvatar(avatar, avatars, currentIndex, direction)
);

// Initialize modules on load
window.addEventListener("load", async () => {
  // Load fonts first with timeout
  const fontLoadingPromise = loadFontsWithFallback();
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second timeout

  try {
    await Promise.race([fontLoadingPromise, timeoutPromise]);
  } catch (error) {
    console.warn("⚠️ Font loading timed out, showing content anyway");
  }

  // Ensure fonts-loaded class is added even if loading failed
  if (!document.body.classList.contains("fonts-loaded")) {
    document.body.classList.add("fonts-loaded");
  }

  // Then initialize everything else
  fetchData(packageJson);
  fetchFileSystemData().then((data) => (fileSystemData = data));
  typeWriter(typeContainer, messageArray, textPosition, speed);
  initThemeSlider();
  manualAvatarChange(avatar, startRegularInterval, avatars);
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});
