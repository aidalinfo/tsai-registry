import fs from 'fs';
import path from 'path';

export async function loadSettings(settingsPath?: string): Promise<any> {
  let data: string;
  let overrideLocalPath: string | undefined;

  if (!settingsPath) {
    const localOverride = path.join(process.cwd(), 'settings-registry.json');
    if (fs.existsSync(localOverride)) {
      overrideLocalPath = JSON.parse(fs.readFileSync(localOverride, 'utf-8')).settings?.local;
    }
    settingsPath = process.env.TSAR_SETTINGS_URL ||
      "https://raw.githubusercontent.com/aidalinfo/tsai-registry/refs/heads/main/settings.json";
  }

  if (settingsPath.startsWith('http://') || settingsPath.startsWith('https://')) {
    const res = await fetch(settingsPath);
    if (!res.ok) throw new Error(`Erreur lors du chargement distant: ${res.statusText}`);
    data = await res.text();
  } else {
    const resolvedPath = path.isAbsolute(settingsPath)
      ? settingsPath
      : path.join(process.cwd(), settingsPath);
    if (!fs.existsSync(resolvedPath)) throw new Error(`Fichier introuvable: ${resolvedPath}`);
    data = fs.readFileSync(resolvedPath, 'utf-8');
  }

  const base = JSON.parse(data);
  if (overrideLocalPath) {
    base.settings = base.settings || {};
    base.settings.local = overrideLocalPath;
  }
  // Si settings.local n'est pas défini, on tente de le récupérer dans le settings distant
  if (!base.settings) base.settings = {};
  if (!base.settings.local) {
    // Charger le settings distant (si settingsPath est local, alors settings distant = settings.json officiel)
    let distantSettingsUrl = process.env.TSAR_SETTINGS_URL || "https://raw.githubusercontent.com/aidalinfo/tsai-registry/refs/heads/main/settings.json";
    try {
      let distantData: string;
      if (distantSettingsUrl.startsWith('http://') || distantSettingsUrl.startsWith('https://')) {
        const res = await fetch(distantSettingsUrl);
        if (res.ok) {
          distantData = await res.text();
          const distantJson = JSON.parse(distantData);
          if (distantJson.settings && distantJson.settings.local) {
            base.settings.local = distantJson.settings.local;
          }
        }
      } else if (fs.existsSync(distantSettingsUrl)) {
        distantData = fs.readFileSync(distantSettingsUrl, 'utf-8');
        const distantJson = JSON.parse(distantData);
        if (distantJson.settings && distantJson.settings.local) {
          base.settings.local = distantJson.settings.local;
        }
      }
    } catch (e) {
      // ignore fetch/read error, fallback below
    }
    // Fallback si toujours rien
    if (!base.settings.local) base.settings.local = 'src/mastra/registry';
  }
  return base;
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
