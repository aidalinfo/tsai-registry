import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Récupère tous les fichiers .yaml dans app/src/mastra/registry/**/**/*.yaml
export function getAllYamlItems() {
  const baseDir = path.resolve(import.meta.env.SITE_ROOT || '', '../app/src/mastra/registry');
  const items: { name: string, file: string, type: string }[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.yaml')) {
        // ex: agents/exa-agent/exa.yaml
        const rel = path.relative(baseDir, fullPath);
        const [type, name] = rel.split(path.sep);
        items.push({ name: name.replace('.yaml', ''), file: fullPath, type });
      }
    }
  }
  walk(baseDir);
  return items;
}

export function getYamlContent(file: string) {
  const raw = fs.readFileSync(file, 'utf-8');
  return yaml.load(raw);
}
