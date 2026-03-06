// Centralized API configuration and fetch functions (packagejson API)
const PACKAGEJSON_BASE =
  "https://packagejson.onrender.com";

const PACKAGE_JSON_API = `${PACKAGEJSON_BASE}/package.json`;

// Package JSON types and fetch (aggregated across all repos from packagejson API)
export interface PackageData {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export const fetchPackageData = async (): Promise<PackageData> => {
  const response = await fetch(PACKAGE_JSON_API);
  if (!response.ok) throw new Error("Failed to fetch package data");
  return response.json();
};

// Terminal VFS: GET /files?format=terminal returns a FileSystemItem tree (github + projects from API)
export interface TerminalFileSystemItem {
  name: string;
  type: "file" | "directory";
  content?: string;
  url?: string;
  children?: TerminalFileSystemItem[];
}

export const fetchTerminalFileSystem = async (): Promise<TerminalFileSystemItem> => {
  const response = await fetch(`${PACKAGEJSON_BASE}/files?format=terminal`);
  if (!response.ok)
    throw new Error("Failed to fetch terminal file system from packagejson API");
  return response.json();
};
