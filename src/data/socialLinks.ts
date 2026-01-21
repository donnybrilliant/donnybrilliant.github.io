import type { IconifyIcon } from "@iconify/react";
import githubIcon from "@iconify-icons/fa6-brands/github";
import globeIcon from "@iconify-icons/fa6-solid/globe";
import linkedinIcon from "@iconify-icons/fa6-brands/linkedin";
import envelopeIcon from "@iconify-icons/fa6-solid/envelope";

export interface SocialLink {
  icon: IconifyIcon;
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: githubIcon,
    label: "GitHub",
    url: "https://github.com/donnybrilliant",
  },
  {
    icon: globeIcon,
    label: "Website",
    url: "https://www.vierweb.com",
  },
  {
    icon: linkedinIcon,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/daniel-vier",
  },
  {
    icon: envelopeIcon,
    label: "Email",
    url: "mailto:daniel.vier@gmail.com",
  },
];
