// src/terminal.js
export function toggleTerminalVisibility(
  terminalElement,
  isTerminalInitialized,
  initTerminalFunc,
  fileSystemData
) {
  terminalElement.classList.toggle("active");
  if (!isTerminalInitialized) {
    initTerminalFunc("#terminal", fileSystemData);
    isTerminalInitialized = true;
  }
}
