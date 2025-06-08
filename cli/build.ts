import { loadSettings } from './utils';
import fs from 'fs';
import path from 'path';
import { write } from 'bun';

(async () => {
  // Charger les settings via la fonction mutualisée
  const settings = await loadSettings();
  const ignoreExtensions: string[] = settings.build?.ignoreExtensions || [];

  // Racine du dossier registry
  const REGISTRY_ROOT = path.join(process.cwd(), 'app', 'src', 'mastra', 'registry');
  const OUTPUT_PATH = path.join(process.cwd(), 'registry.json');

  // Types supportés
  const SUPPORTED_TYPES = ['agents', 'workflows', 'tools', 'mcp'];

  // Utilitaire pour lister tous les fichiers d'un dossier récursivement
  function listFilesRecursive(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file: string) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(listFilesRecursive(filePath));
      } else {
        // Filtrer selon ignoreExtensions
        if (!ignoreExtensions.some(ext => filePath.endsWith(ext))) {
          results.push(filePath);
        }
      }
    });
    return results;
  }

  // Utilitaire pour extraire les imports externes d'un fichier
  function extractDependencies(fileContent: string): string[] {
    const importRegex = /import\s+(?:[^'\"]+from\s+)?["']([^"']+)["']/g;
    const deps = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(fileContent))) {
      const dep = match[1];
      if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
        const depParts = dep.split('/');
        if (depParts[0]) {
          if (depParts[0].startsWith('@')) {
            if (depParts[1]) deps.add(depParts.slice(0, 2).join('/'));
          } else {
            deps.add(depParts[0]);
          }
        }
      }
    }
    return Array.from(deps);
  }

  // Utilitaire pour extraire les process.env utilisés
  function extractEnvs(fileContent: string): string[] {
    const envRegex = /process\.env\.([A-Z0-9_]+)/g;
    const envs = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = envRegex.exec(fileContent))) {
      if (match[1]) envs.add(match[1]);
    }
    return Array.from(envs);
  }

  // Construction du registry
  const registry: Record<string, any> = {};

  for (const type of SUPPORTED_TYPES) {
    const typeDir = path.join(REGISTRY_ROOT, type);
    if (!fs.existsSync(typeDir)) continue;
    const names = fs.readdirSync(typeDir);
    for (const name of names) {
      const objDir = path.join(typeDir, name);
      if (!fs.statSync(objDir).isDirectory()) continue;
      const files = listFilesRecursive(objDir);
      const relFiles = files.map(f => path.relative(process.cwd(), f));
      let allDeps: string[] = [];
      let allEnvs: string[] = [];
      for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf-8');
        allDeps = allDeps.concat(extractDependencies(content));
        allEnvs = allEnvs.concat(extractEnvs(content));
      }
      allDeps = Array.from(new Set(allDeps));
      allEnvs = Array.from(new Set(allEnvs));
      registry[name] = {
        type,
        name,
        files: relFiles,
        dependencies: allDeps,
        envs: allEnvs
      };
    }
  }

  await write(OUTPUT_PATH, JSON.stringify(registry, null, 2));
  console.log('registry.json generate with success.');
})();
