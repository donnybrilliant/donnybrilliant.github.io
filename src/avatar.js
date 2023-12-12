// Function for animations before the regular interval starts
export function manualAvatarChange(avatar, startRegularInterval, avatars) {
  let switchCount = 0;
  const totalSwitches = 6;
  const manualChangeInterval = setInterval(() => {
    avatar.src = switchCount % 2 === 0 ? avatars[0] : avatars[6];
    switchCount++;
    if (switchCount >= totalSwitches) {
      clearInterval(manualChangeInterval);
      startRegularInterval(avatar, avatars);
    }
  }, 500);
}

// Function to start the regular interval
export function startRegularInterval(avatar, avatars) {
  let currentIndex = 0;
  let direction = 1;
  const updateAvatarInterval = () =>
    updateAvatar(avatar, avatars, currentIndex, direction, (index, dir) => {
      currentIndex = index;
      direction = dir;
    });
  setInterval(updateAvatarInterval, 800);
}

// Function to update the avatar
export function updateAvatar(
  avatar,
  avatars,
  currentIndex,
  direction,
  updateIndexDirection
) {
  avatar.src = avatars[currentIndex];
  currentIndex += direction;
  if (currentIndex >= avatars.length - 1 || currentIndex <= 0) {
    direction *= -1;
  }
  if (typeof updateIndexDirection === "function") {
    updateIndexDirection(currentIndex, direction);
  }
}
