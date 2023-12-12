// src/api.js
export async function fetchData(packageJson) {
  const url = "https://packagejson.onrender.com/package.json";
  const loadingMessage = "Loading...";
  const errorMessage = "Failed to load data. Try again";

  packageJson.textContent = loadingMessage;

  try {
    const response = await fetch(url);
    const data = await response.json();
    packageJson.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    packageJson.textContent = errorMessage;
  }
}

export async function fetchFileSystemData() {
  try {
    const response = await fetch("https://packagejson.onrender.com/files", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}
