#!/usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { loadSettings, loadRegistry } from "./utils";

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return await new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function handleEnvVariables(envs: string[] | undefined) {
  if (!envs || envs.length === 0) return;
  const envFiles = fs
    .readdirSync(process.cwd())
    .filter((f) => f.startsWith('.env'));
  if (envFiles.length === 0) {
    fs.writeFileSync(path.join(process.cwd(), '.env'), '');
    envFiles.push('.env');
  }

  for (const env of envs) {
    const existingFiles: string[] = [];
    for (const file of ['.env.development', '.env']) {
      const fp = path.join(process.cwd(), file);
      if (fs.existsSync(fp)) {
        const content = fs.readFileSync(fp, 'utf-8');
        if (new RegExp(`^${env}=`, 'm').test(content)) {
          existingFiles.push(file);
        }
      }
    }

    if (existingFiles.length === 0) {
      console.log(
        `The environment variable '${env}' is used but not found in .env.development or .env.`
      );
      const add = (await prompt('Add it? (y/N): ')).trim().toLowerCase();
      if (add !== 'y') continue;
    } else {
      console.log(
        `The environment variable '${env}' already exists in: ${existingFiles.join(', ')}`
      );
      const update = (await prompt('Update its value? (y/N): ')).trim().toLowerCase();
      if (update !== 'y') continue;
    }

    console.log('Select the .env file to update:');
    envFiles.forEach((f, idx) => console.log(`${idx + 1}. ${f}`));
    const idxInput = await prompt(`Choice [1-${envFiles.length}]: `);
    const idx = parseInt(idxInput, 10);
    const target =
      !isNaN(idx) && idx >= 1 && idx <= envFiles.length ? envFiles[idx - 1] : envFiles[0];

    const value = await prompt(`Value for ${env}: `);
    const filePath = path.join(process.cwd(), target);
    let content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    const line = `${env}=${value}`;
    if (new RegExp(`^${env}=`, 'm').test(content)) {
      content = content.replace(new RegExp(`^${env}=.*`, 'm'), line);
    } else {
      if (content && !content.endsWith('\n')) content += '\n';
      content += line + '\n';
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`${env} set in ${target}`);
  }
}

yargs(hideBin(process.argv))
  .command(
    'init',
    'Create a local settings-registry.json file',
    () => {},
    async () => {
      const defaultPath = 'src/mastra/registry';
      const input = await prompt(`Local registry path [${defaultPath}]: `);
      const localPath = input.trim() || defaultPath;
      const filePath = path.join(process.cwd(), 'settings-registry.json');
      if (fs.existsSync(filePath)) {
        const overwrite = (await prompt('settings-registry.json already exists. Overwrite? (y/N): ')).trim().toLowerCase();
        if (overwrite !== 'y') {
          console.log('Aborted.');
          return;
        }
      }
      fs.writeFileSync(filePath, JSON.stringify({ settings: { local: localPath } }, null, 2));
      console.log(`settings-registry.json written to ${filePath}`);
    }
  )
  .command(
    'settings',
    'Affiche les paramètres de configuration',
    () => {},
    async () => {
      try {
        const settings = await loadSettings();
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
      });
    },
    async (argv) => {
      try {
        const settings = await loadSettings();
        const registryPath = settings.settings?.registry;
        const settingsUrl = settings.settings?.url;
        if (!registryPath) throw new Error("Le chemin du registry n'est pas défini dans les settings.");
        const registry = await loadRegistry(registryPath, settingsUrl);
        const type = argv.type as string | undefined;
        const items = Object.entries(registry).filter(([_, v]: [string, any]) =>
          !type || v.type === type.slice(0, -1)
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
    'Add a registry object locally',
    (yargs) => {
      return yargs.positional('name', {
        describe: "Name of the object to add (e.g., research-agent)",
        type: 'string',
      });
    },
    async (argv) => {
      try {
        const name = argv.name as string;
        const settings = await loadSettings();
        const registryPath = settings.settings?.registry;
        const settingsUrl = settings.settings?.url;
        const localPath = settings.settings?.local;
        if (!registryPath || !localPath) throw new Error("Registry path or local folder path is not defined in settings.");
        const registry = await loadRegistry(registryPath, settingsUrl);
        const entry = registry[name];
        if (!entry) {
          console.error(`The object '${name}' does not exist in the registry.`);
          process.exit(1);
        }
        // Target directory creation
        const targetDir = path.join(process.cwd(), localPath, entry.type, name);
        if (fs.existsSync(targetDir)) {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl.question(`The folder ${targetDir} already exists. Overwrite? (y/N): `, (answer: string) => {
            rl.close();
            if (answer.trim().toLowerCase() === 'y') {
              fs.rmSync(targetDir, { recursive: true, force: true });
              fs.mkdirSync(targetDir, { recursive: true });
              proceed();
            } else {
              console.log('Aborted.');
              process.exit(0);
            }
          });
          function proceed() {
            // Download files
            (async () => {
              for (const file of entry.files) {
                let fileUrl = file;
                if (!file.startsWith('http')) {
                  // Generate raw GitHub URL
                  let repo = settingsUrl.replace("https://github.com/", "");
                  const branch = "main";
                  fileUrl = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${file}`;
                }
                const res = await fetch(fileUrl);
                if (!res.ok) throw new Error(`Error downloading ${fileUrl}: ${res.statusText}`);
                const content = await res.text();
                const localFile = path.join(targetDir, path.basename(file));
                fs.writeFileSync(localFile, content, 'utf-8');
                console.log(`Downloaded file: ${localFile}`);
              }
              // Install dependencies
              if (entry.dependencies && entry.dependencies.length > 0) {
                console.log('Installing dependencies:', entry.dependencies.join(', '));
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
              await handleEnvVariables(entry.envs);
              console.log(`'${name}' added successfully.`);
            })().catch((e: any) => {
              console.error("Error while adding:", e.message);
              process.exit(1);
            });
          }
          return;
        }
        fs.mkdirSync(targetDir, { recursive: true });
        // Download files
        for (const file of entry.files) {
          let fileUrl = file;
          if (!file.startsWith('http')) {
            // Generate raw GitHub URL
            let repo = settingsUrl.replace("https://github.com/", "");
            const branch = "main";
            fileUrl = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${file}`;
          }
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error(`Error downloading ${fileUrl}: ${res.statusText}`);
          const content = await res.text();
          const localFile = path.join(targetDir, path.basename(file));
          fs.writeFileSync(localFile, content, 'utf-8');
          console.log(`Downloaded file: ${localFile}`);
        }
        // Install dependencies
        if (entry.dependencies && entry.dependencies.length > 0) {
          console.log('Installing dependencies:', entry.dependencies.join(', '));
          // Detect package manager
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
        await handleEnvVariables(entry.envs);
        console.log(`'${name}' added successfully.`);
      } catch (e: any) {
        console.error("Error while adding:", e.message);
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
        // Déterminer le chemin du script build selon le contexte d'exécution
        const currentDir = path.dirname(import.meta.url.replace('file://', ''));
        const isTypeScript = import.meta.url.endsWith('.ts');
        const buildScript = path.join(currentDir, isTypeScript ? 'build.ts' : 'build.js');
        const registryArg = argv.registryPath as string;
        const proc = spawn('bun', [buildScript, registryArg], {
          stdio: 'inherit',
          env: process.env,
        });
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