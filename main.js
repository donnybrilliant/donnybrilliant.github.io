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

// Import avatar images
import avatar0 from "./assets/avatars/avatar.svg";
import avatar1 from "./assets/avatars/avatar1.svg";
import avatar2 from "./assets/avatars/avatar2.svg";
import avatar3 from "./assets/avatars/avatar3.svg";
import avatar4 from "./assets/avatars/avatar4.svg";
import avatar5 from "./assets/avatars/avatar5.svg";
import avatar6 from "./assets/avatars/avatar6.svg";

// DOM Elements
const navigation = document.querySelector("#navigation");
const navToggle = document.querySelector("#nav-toggle");
const navIcon = document.querySelector("#nav-icon");
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
setupNavItems(navItems, navigation, navToggle, navIcon);
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
   I like <a href="https://ragerrr.netlify.app/" target="_blank">random stuff</a>`,
];

// Avatar variables
let currentIndex = 0;
let direction = 1;

// Event listeners

// Toggle navigation menu
navToggle.addEventListener("click", () =>
  toggleMenu(navigation, navToggle, navIcon)
);
// Toggle package.json
togglePackageJson.addEventListener("click", () =>
  packageJson.classList.toggle("active")
);
// Toggle terminal
toggleTerminal.addEventListener("click", () =>
  toggleTerminalVisibility(
    terminalElement,
    isTerminalInitialized,
    initTerminal,
    fileSystemData
  )
);
// Hover effect for avatar
avatar.addEventListener("mouseover", () => (avatar.src = avatar6));
// Reset avatar after hover
avatar.addEventListener("mouseout", () =>
  updateAvatar(avatar, avatars, currentIndex, direction)
);

// Initialize modules on load
window.addEventListener("load", () => {
  fetchData(packageJson);
  fetchFileSystemData().then((data) => (fileSystemData = data));
  typeWriter(typeContainer, messageArray, textPosition, speed);
  initThemeSlider();
  manualAvatarChange(avatar, startRegularInterval, avatars);
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});
