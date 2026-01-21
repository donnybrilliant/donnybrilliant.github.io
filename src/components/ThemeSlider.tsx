import { useTheme } from "@/hooks/useTheme";

export const ThemeSlider = () => {
  const { hue, setHue, isGrayscale } = useTheme();

  return (
    <div className="theme-slider-container">
      <label htmlFor="theme-slider" className="sr-only">
        Theme Color Slider
      </label>
      <input
        type="range"
        id="theme-slider"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => setHue(parseInt(e.target.value, 10))}
        className={`theme-slider ${isGrayscale ? 'theme-slider-grayscale' : ''}`}
        aria-label="Theme color slider"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={hue}
      />
    </div>
  );
};
