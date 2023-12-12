// src/scrollspy.js
export function setupScrollspy(sections, navItems) {
  const onScroll = () => {
    const headerHeight = document.querySelector("header").offsetHeight;
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
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

  window.addEventListener("scroll", onScroll);
}
