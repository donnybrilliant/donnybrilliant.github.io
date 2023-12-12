// Function to toggle the terminal visibility and initialize it if not already initialized
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
