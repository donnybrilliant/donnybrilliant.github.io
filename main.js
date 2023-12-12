import "@fontsource/silkscreen";
import "@fontsource/dosis";
import "./style.css";
import initTerminal from "./terminal";

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
const avatars = [
  "avatar.svg",
  "avatar1.svg",
  "avatar2.svg",
  "avatar3.svg",
  "avatar4.svg",
  "avatar5.svg",
];

let fileSystemData = null;
let isTerminalInitialized = false;

// Toggle navigation menu
const toggleMenu = () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
};

// Close the navigation menu when a link is clicked
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (navigation.classList.contains("active")) {
      toggleMenu();
    }
  });
});

// Scrollspy functionality
const onScroll = () => {
  const headerHeight = document.querySelector("header").offsetHeight;
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    if (link.getAttribute("href").includes(currentSection)) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
};

// Avatar variables
let currentIndex = 0;
let direction = 1;

// Function to switch between avatar0 and avatar6
function manualAvatarChange() {
  let switchCount = 0;
  const totalSwitches = 6; // Total number of times to switch
  const manualChangeInterval = setInterval(() => {
    avatar.src =
      switchCount % 2 === 0
        ? "./assets/avatars/avatar.svg"
        : "./assets/avatars/avatar6.svg";
    switchCount++;
    if (switchCount >= totalSwitches) {
      clearInterval(manualChangeInterval);
      startRegularInterval();
    }
  }, 500); // Time between manual changes
}

// Function to start regular interval for avatar changes
function startRegularInterval() {
  currentIndex = 0; // Reset the index if needed
  setInterval(updateAvatar, 800); // Regular interval
}

// Function to update the avatar image
function updateAvatar() {
  avatar.src = `./assets/avatars/${avatars[currentIndex]}`;
  currentIndex += direction;
  if (currentIndex >= avatars.length - 1 || currentIndex <= 0) {
    direction *= -1;
  }
}

// TypeWriter variables
let textPosition = 0;
const speed = 30;

// TypeWriter message
let messageArray = [
  `My name is Daniel, I am a web developer. <br />
 Check out my <a href="#toggle-package-json">package.json</a> or browse my GitHub Projects through the <a href="#toggle-terminal">terminal</a>. <br />
 I like <a href="https://ragerrr.netlify.app/" target="_blank">random stuff</a>`,
];

// Type out the message in the typeContainer
const typeWriter = () => {
  typeContainer.innerHTML =
    messageArray[0].substring(0, textPosition) + `<span class="blink">_</span>`;
  if (textPosition++ != messageArray[0].length) setTimeout(typeWriter, speed);
};

// Function to fetch and display package.json
async function fetchData() {
  const url = "https://packagejson.onrender.com/package.json";
  const loadingMessage = "Loading...";
  const errorMessage = "Failed to load data. Try again";

  // Display loading message
  packageJson.textContent = loadingMessage;

  try {
    const response = await fetch(url);
    const data = await response.json();
    packageJson.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    packageJson.textContent = errorMessage;
  }
}

// Function to fetch file system data for terminal
async function fetchFileSystemData() {
  try {
    const response = await fetch("https://packagejson.onrender.com/files", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    fileSystemData = await response.json();
    return fileSystemData;
  } catch (error) {
    fileSystemData = null;
    return null;
  }
}

// Initialize terminal on toggler click
const toggleTerminalVisibility = () => {
  terminalElement.classList.toggle("active");
  if (!isTerminalInitialized) {
    initTerminal("#terminal", fileSystemData);
    isTerminalInitialized = true;
  }
};

// Event listeners
navToggle.addEventListener("click", toggleMenu);
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (navigation.classList.contains("active")) {
      toggleMenu();
    }
  });
});
window.addEventListener("scroll", onScroll);
window.addEventListener("load", fetchData);
window.addEventListener("load", fetchFileSystemData);
window.addEventListener("load", typeWriter);
window.addEventListener("load", () => {
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});
togglePackageJson.addEventListener("click", () => {
  packageJson.classList.toggle("active");
});
toggleTerminal.addEventListener("click", toggleTerminalVisibility);

// Display avatar6 on hover
avatar.addEventListener("mouseover", () => {
  avatar.src = "./assets/avatars/avatar6.svg";
});

avatar.addEventListener("mouseout", () => {
  updateAvatar();
});

// Start with manual changes
manualAvatarChange();
