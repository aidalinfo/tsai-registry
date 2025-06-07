import fs from 'fs';
import path from 'path';

export async function loadSettings(settingsPath?: string): Promise<any> {
  let data: string;
  if (!settingsPath) {
    settingsPath = "https://raw.githubusercontent.com/Killian-Aidalinfo/tsai-registry/refs/heads/main/settings.json";
  }
  if (settingsPath.startsWith("http://") || settingsPath.startsWith("https://")) {
    const res = await fetch(settingsPath);
    if (!res.ok) throw new Error(`Erreur lors du chargement distant: ${res.statusText}`);
    data = await res.text();
  } else {
    const resolvedPath = path.isAbsolute(settingsPath)
      ? settingsPath
      : path.join(process.cwd(), settingsPath);
    if (!fs.existsSync(resolvedPath)) throw new Error(`Fichier introuvable: ${resolvedPath}`);
    data = fs.readFileSync(resolvedPath, "utf-8");
  }
  return JSON.parse(data);
}

export async function loadRegistry(registryPath: string, settingsUrl?: string): Promise<any> {
  let data: string;
  if (!registryPath.startsWith("http://") && !registryPath.startsWith("https://") && settingsUrl) {
    let repo = settingsUrl.replace("https://github.com/", "");
    const branch = "main";
    registryPath = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${registryPath}`;
  }
  if (registryPath.startsWith("http://") || registryPath.startsWith("https://")) {
    const res = await fetch(registryPath);
    if (!res.ok) throw new Error(`Erreur lors du chargement du registry: ${res.statusText}`);
    data = await res.text();
  } else {
    const resolvedPath = path.isAbsolute(registryPath)
      ? registryPath
      : path.join(process.cwd(), registryPath);
    if (!fs.existsSync(resolvedPath)) throw new Error(`Registry introuvable: ${resolvedPath}`);
    data = fs.readFileSync(resolvedPath, "utf-8");
  }
  return JSON.parse(data);
}
