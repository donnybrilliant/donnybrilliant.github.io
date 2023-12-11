import "./style.css";

// DOM Elements
const navigation = document.querySelector("#navigation");
const navToggle = document.querySelector("#nav-toggle");
const navIcon = document.querySelector("#nav-icon");
const navItems = document.querySelectorAll("#navigation li a");

// Toggle navigation menu
function toggleMenu() {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
}

// Remove active class from all navigation items
function removeActiveClasses() {
  navItems.forEach((item) => {
    item.classList.remove("active");
    item.removeAttribute("aria-current");
  });
}

// Set a navigation item as active
function setActiveNavItem(item) {
  removeActiveClasses();
  item.classList.add("active");
  item.setAttribute("aria-current", "page");
}

// Event listeners
navToggle.addEventListener("click", toggleMenu);
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (navigation.classList.contains("active")) {
      toggleMenu(); // Close the menu if it's open
    }
    setActiveNavItem(item);
  });
});

window.addEventListener("load", () => {
  document.querySelectorAll(".project-card img").forEach((img) => {
    img.style.transition = "object-position 4s ease";
  });
});
