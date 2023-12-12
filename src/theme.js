let originalColors = {};

function parseHSL(hslString) {
  const match = hslString.match(
    /hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/i
  );
  if (match) {
    return [
      Math.round(parseFloat(match[1])),
      Math.round(parseFloat(match[2])),
      Math.round(parseFloat(match[3])),
    ];
  }
  return null;
}

function adjustHue(hslString, hueShift) {
  if (hueShift === 360) {
    return "hsl(0, 0%, 100%)";
  }

  const parsedHSL = parseHSL(hslString);

  let [h, s, l] = parsedHSL;
  h = (h + hueShift) % 360;
  if (h < 0) h += 360;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function storeOriginalColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const customProperties = [
    "--primary-color",
    "--secondary-color",
    "--tertiary-color",
    "--quad-color",
  ];

  customProperties.forEach((prop) => {
    originalColors[prop] = style.getPropertyValue(prop).trim();
  });
}

export function adjustThemeColors(hueShift) {
  const root = document.documentElement;

  for (let prop in originalColors) {
    const adjustedColor = adjustHue(originalColors[prop], hueShift);
    root.style.setProperty(prop, adjustedColor);
  }
}

export function initThemeSlider() {
  storeOriginalColors(); // Store the original colors on initialization

  const themeSlider = document.getElementById("theme-slider");
  if (!themeSlider) return;

  themeSlider.addEventListener("input", (e) => {
    const hueShift = parseInt(e.target.value);
    localStorage.setItem("themeHueShift", hueShift);
    adjustThemeColors(hueShift);
  });

  const savedHueShift = localStorage.getItem("themeHueShift") || 0;
  themeSlider.value = savedHueShift;
  adjustThemeColors(parseInt(savedHueShift));
}
