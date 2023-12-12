import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import processCommand from "./commandProcessor.js";
import handleKeyInput from "./keyInputHandler.js";
import ascii from "./ascii.js";
import { populateFileSystem } from "./fileSystem.js";

export const term = new Terminal();

// Create and apply the fit addon
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Create and apply the web links addon
const webLinksAddon = new WebLinksAddon();
term.loadAddon(webLinksAddon);

// Export a function to initialize the terminal
export default function initTerminal(container, fileSystemData) {
  // Populate the file system
  populateFileSystem(fileSystemData);
  const containerElement =
    typeof container === "string"
      ? document.querySelector(container)
      : container;
  term.open(containerElement);
  term.focus();
  fitAddon.fit();

  // Refit on window resize
  window.addEventListener("resize", () => {
    fitAddon.fit();
  });

  // Handle key input
  term.onKey((eventData) => handleKeyInput(eventData, term, processCommand));

  // Print the ascii art
  ascii(term);
}
