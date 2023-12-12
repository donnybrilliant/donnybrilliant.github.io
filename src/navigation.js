// src/navigation.js
export function toggleMenu(navigation, navToggle, navIcon) {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  navIcon.classList.toggle("fa-bars");
  navIcon.classList.toggle("fa-close");
}

export function setupNavItems(navItems, navigation, navToggle, navIcon) {
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navigation.classList.contains("active")) {
        toggleMenu(navigation, navToggle, navIcon);
      }
    });
  });
}
