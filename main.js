import "./style.css";

// DOM Elements
const navigation = document.querySelector("#navigation");
const navToggle = document.querySelector("#nav-toggle");
const navIcon = document.querySelector("#nav-icon");
const navItems = document.querySelectorAll("#navigation li a");
const sections = document.querySelectorAll("section");

// Toggle navigation menu
function toggleMenu() {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
}

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
function onScroll() {
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
}

// Event listener for scroll
window.addEventListener("scroll", onScroll);

// Initialize image transition after page load
window.addEventListener("load", () => {
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});
