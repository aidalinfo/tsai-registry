#!/usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";

// Fonction pour charger les paramètres
async function loadSettings(settingsPath?: string): Promise<any> {
  let data: string;
  if (!settingsPath) {
    // Utiliser l'URL par défaut si aucun chemin n'est fourni
    settingsPath = "https://raw.githubusercontent.com/Killian-Aidalinfo/tsai-registry/refs/heads/main/settings.json";
  }
  if (settingsPath.startsWith("http://") || settingsPath.startsWith("https://")) {
    // Charger depuis une URL distante
    const res = await fetch(settingsPath);
    if (!res.ok) throw new Error(`Erreur lors du chargement distant: ${res.statusText}`);
    data = await res.text();
  } else {
    // Charger depuis un fichier local
    const resolvedPath = path.isAbsolute(settingsPath)
      ? settingsPath
      : path.join(process.cwd(), settingsPath);
    if (!fs.existsSync(resolvedPath)) throw new Error(`Fichier introuvable: ${resolvedPath}`);
    data = fs.readFileSync(resolvedPath, "utf-8");
  }
  return JSON.parse(data);
}

// Fonction pour charger le registry
async function loadRegistry(registryPath: string, settingsUrl?: string): Promise<any> {
  let data: string;
  // Si ce n'est pas une URL, mais settingsUrl est défini, on construit l'URL raw GitHub
  if (!registryPath.startsWith("http://") && !registryPath.startsWith("https://") && settingsUrl) {
    // On supporte les URLs GitHub classiques
    // Ex: https://github.com/Killian-Aidalinfo/tsai-registry => https://raw.githubusercontent.com/Killian-Aidalinfo/tsai-registry/refs/heads/main/registry.json
    let repo = settingsUrl.replace("https://github.com/", "");
    // Utilise la branche main par défaut
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

// Squelette de la CLI avec yargs

yargs(hideBin(process.argv))
  .command(
    'settings',
    'Affiche les paramètres de configuration',
    (yargs) => {
      return yargs.option('settings-path', {
        alias: 's',
        describe: 'Chemin local ou URL du fichier settings.json',
        type: 'string',
      });
    },
    async (argv) => {
      try {
        const settings = await loadSettings(argv["settings-path"] as string | undefined);
        console.log(JSON.stringify(settings, null, 2));
      } catch (e: any) {
        console.error("Erreur lors du chargement des settings:", e.message);
        process.exit(1);
      }
    }
  )
  .command(
    'list [type]',
    'Liste les objets disponibles (agents, workflows, tools, mcp)',
    (yargs) => {
      return yargs.positional('type', {
        describe: 'Type d\'objet à lister',
        choices: ['agents', 'workflows', 'tools', 'mcp'],
        type: 'string',
      }).option('settings-path', {
        alias: 's',
        describe: 'Chemin local ou URL du fichier settings.json',
        type: 'string',
      });
    },
    async (argv) => {
      try {
        const settings = await loadSettings(argv["settings-path"] as string | undefined);
        const registryPath = settings.settings?.registry;
        const settingsUrl = settings.settings?.url;
        if (!registryPath) throw new Error("Le chemin du registry n'est pas défini dans les settings.");
        const registry = await loadRegistry(registryPath, settingsUrl);
        const type = argv.type as string | undefined;
        const items = Object.entries(registry).filter(([_, v]: [string, any]) =>
          !type || v.type === type.slice(0, -1) // 'agents' => 'agent', etc.
        );
        if (items.length === 0) {
          console.log(type ? `Aucun objet de type ${type}` : "Aucun objet trouvé dans le registry.");
        } else {
          for (const [name, obj] of items) {
            const typedObj = obj as { type: string };
            console.log(`- ${name} [${typedObj.type}]`);
          }
        }
      } catch (e: any) {
        console.error("Erreur lors du listing:", e.message);
        process.exit(1);
      }
    }
  )
  .command(
    'add <name>',
    'Ajoute un objet du registry en local',
    (yargs) => {
      return yargs.positional('name', {
        describe: "Nom de l'objet à ajouter (ex: research-agent)",
        type: 'string',
      }).option('settings-path', {
        alias: 's',
        describe: 'Chemin local ou URL du fichier settings.json',
        type: 'string',
      });
    },
    async (argv) => {
      try {
        const name = argv.name as string;
        const settings = await loadSettings(argv["settings-path"] as string | undefined);
        const registryPath = settings.settings?.registry;
        const settingsUrl = settings.settings?.url;
        const localPath = settings.settings?.local;
        if (!registryPath || !localPath) throw new Error("Le chemin du registry ou du dossier local n'est pas défini dans les settings.");
        const registry = await loadRegistry(registryPath, settingsUrl);
        const entry = registry[name];
        if (!entry) {
          console.error(`L'objet '${name}' n'existe pas dans le registry.`);
          process.exit(1);
        }
        // Création du dossier cible
        const targetDir = path.join(process.cwd(), localPath, entry.type, name);
        if (fs.existsSync(targetDir)) {
          const prompt = require('readline-sync');
          const overwrite = prompt.question(`Le dossier ${targetDir} existe déjà. Overwrite ? (y/N): `);
          if (overwrite.toLowerCase() !== 'y') {
            console.log('Abandon.');
            process.exit(0);
          }
          fs.rmSync(targetDir, { recursive: true, force: true });
        }
        fs.mkdirSync(targetDir, { recursive: true });
        // Téléchargement des fichiers
        for (const file of entry.files) {
          let fileUrl = file;
          if (!file.startsWith('http')) {
            // Générer l'URL raw GitHub
            let repo = settingsUrl.replace("https://github.com/", "");
            const branch = "main";
            fileUrl = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${file}`;
          }
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error(`Erreur lors du téléchargement de ${fileUrl}: ${res.statusText}`);
          const content = await res.text();
          const localFile = path.join(targetDir, path.basename(file));
          fs.writeFileSync(localFile, content, 'utf-8');
          console.log(`Fichier téléchargé: ${localFile}`);
        }
        // Installation des dépendances
        if (entry.dependencies && entry.dependencies.length > 0) {
          console.log('Installation des dépendances:', entry.dependencies.join(', '));
          // Détection du package manager
          let pkgManager = 'bun';
          if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) pkgManager = 'pnpm';
          else if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) pkgManager = 'npm';
          else if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) pkgManager = 'yarn';
          let installCmd = '';
          if (pkgManager === 'bun') installCmd = `bun add ${entry.dependencies.join(' ')}`;
          else if (pkgManager === 'pnpm') installCmd = `pnpm add ${entry.dependencies.join(' ')}`;
          else if (pkgManager === 'npm') installCmd = `npm install ${entry.dependencies.join(' ')}`;
          else if (pkgManager === 'yarn') installCmd = `yarn add ${entry.dependencies.join(' ')}`;
          const { execSync } = require('child_process');
          execSync(installCmd, { stdio: 'inherit' });
        }
        // Affichage des variables d'environnement
        if (entry.envs && entry.envs.length > 0) {
          console.log('\nVariables d\'environnement à ajouter dans votre .env :');
          for (const env of entry.envs) {
            console.log(`${env}=`);
          }
        }
        console.log(`Ajout de '${name}' terminé.`);
      } catch (e: any) {
        console.error("Erreur lors de l'ajout:", e.message);
        process.exit(1);
      }
    }
  )
  .command(
    'build [registryPath]',
    'Génère le fichier registry.json à partir du dossier registry',
    (yargs) => {
      return yargs.positional('registryPath', {
        describe: 'Chemin vers le dossier registry',
        type: 'string',
        default: 'app/src/mastra/registry',
      });
    },
    async (argv) => {
      try {
        const { spawn } = require('child_process');
        const buildScript = path.join(__dirname, 'build.ts');
        const proc = spawn('bun', [buildScript], { stdio: 'inherit', env: process.env });
        proc.on('close', (code: number) => process.exit(code));
      } catch (e: any) {
        console.error('Erreur lors de la génération du registry:', e.message);
        process.exit(1);
      }
    }
  )
  .demandCommand(1, 'Vous devez spécifier une commande.')
  .help()
  .strict()
  .parse();