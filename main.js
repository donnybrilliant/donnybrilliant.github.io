import "./style.css";
const navigation = document.querySelector("#navigation");
const navToggle = document.querySelector("#nav-toggle");
const navIcon = document.querySelector("#nav-icon");
const navItems = document.querySelectorAll("#navigation li a");

function toggleMenu() {
  const isExpanded =
    navToggle.getAttribute("aria-expanded") === "true" || false;
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
}

navToggle.addEventListener("click", toggleMenu);

// Function to remove active class from all items
function removeActiveClasses() {
  navItems.forEach((item) => {
    item.classList.remove("active");
    item.removeAttribute("aria-current", "page");
  });
}

// Add click event to each navigation item
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navigation.classList.remove("active"); // Hide navigation menu
    navIcon.classList.remove("fa-close"); // Change icon back to hamburger
    navIcon.classList.add("fa-bars");
    removeActiveClasses(); // Remove active class from all items
    item.classList.add("active"); // Add active class to clicked item
    item.setAttribute("aria-current", "page");
  });
});
