import type { ReactNode } from "react";

interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export const DesktopIcon = ({ icon, label, onClick, color = "bg-primary" }: DesktopIconProps) => {
  return (
    <button
      className="desktop-icon group hover-scale-lg animate-fade-in"
      onClick={onClick}
      aria-label={`Open ${label}`}
    >
      <div
        className={`desktop-icon-image ${color} rounded-lg shadow-lg group-hover:shadow-xl transition-shadow`}
      >
        {icon}
      </div>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
};
