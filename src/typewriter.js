// Function for typing effect
export function typeWriter(typeContainer, messageArray, textPosition, speed) {
  typeContainer.innerHTML =
    messageArray[0].substring(0, textPosition) + `<span class="blink">_</span>`;
  if (textPosition++ != messageArray[0].length) {
    setTimeout(
      () => typeWriter(typeContainer, messageArray, textPosition, speed),
      speed
    );
  }
}
