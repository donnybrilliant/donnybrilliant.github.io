// Function to toggle the navigation menu
export function toggleMenu(navigation, navToggle) {
  const navIconBars = document.getElementById("nav-icon-bars");
  const navIconClose = document.getElementById("nav-icon-close");
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !isExpanded);
  navigation.classList.toggle("active");
  const isNavIconBarsVisible = navIconBars.style.display !== "none";
  navIconBars.style.display = isNavIconBarsVisible ? "none" : "block";
  navIconClose.style.display = isNavIconBarsVisible ? "block" : "none";
}

// Function to handle clicks on navigation items
export function setupNavItems(navItems, navigation, navToggle) {
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navigation.classList.contains("active")) {
        toggleMenu(navigation, navToggle);
      }
    });
  });
}
