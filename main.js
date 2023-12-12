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

// Toggle navigation menu
const toggleMenu = () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
};

// Event listener for navigation toggle
navToggle.addEventListener("click", toggleMenu);

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

// TypeWriter variables
let textPosition = 0;
const speed = 30;

// TypeWriter message
let messageArray = [
  `My name is <span class="hover">Daniel</span>, I am a
    <span class="hover">front end developer</span>. <br />I like
    <span class="hover random"><a href="https://ragerrr.netlify.app/" target="_blank">random
            stuff</a></span>`,
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

// Call fetchData when the window loads
window.addEventListener("load", fetchData);

// Event listener for typeWriter effect
window.addEventListener("load", typeWriter);

// Event listener for scroll
window.addEventListener("scroll", onScroll);

// Initialize image transition after page load
window.addEventListener("load", () => {
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});

// Event listener for package.json toggle
togglePackageJson.addEventListener("click", () => {
  packageJson.classList.toggle("active");
});

async function fetchFileSystemData() {
  try {
    const response = await fetch("https://packagejson.onrender.com/files", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function initializeTerminal() {
  const fileSystemData = await fetchFileSystemData();
  initTerminal("#terminal", fileSystemData);
}

initializeTerminal();
