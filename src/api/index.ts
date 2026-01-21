// Centralized API configuration and fetch functions

export const GITHUB_API_URL =
  "https://api.github.com/users/donnybrilliant/repos?per_page=100&sort=updated";

export const PACKAGE_JSON_API = "https://packagejson.onrender.com/package.json";

// GitHub Repos types and fetch
export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  fork: boolean;
}

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const response = await fetch(GITHUB_API_URL);
  if (!response.ok) throw new Error("Failed to fetch GitHub repos");
  return response.json();
};

// Package JSON types and fetch
export type PackageData = Record<
  string,
  {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }
>;

export const fetchPackageData = async (): Promise<PackageData> => {
  const response = await fetch(PACKAGE_JSON_API);
  if (!response.ok) throw new Error("Failed to fetch package data");
  return response.json();
};
