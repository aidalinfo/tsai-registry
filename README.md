# tsai-registry

## 🇬🇧 Motivation & Vision

The AI ecosystem is moving fast, and many Python frameworks (LangChain, CrewAI, etc.) already offer prebuilt, reusable, and shareable agents. But there was no simple, open, community-driven equivalent for TypeScript/JavaScript.

**tsai-registry** is inspired by the shadcn/ui experience:
- Let any developer explore, add, and share Mastra agents, workflows, and tools, with no hard dependency on the core framework.
- Encourage reuse, customization, and community contribution.
- Provide a "copy-paste" or "add agent" experience, customizable and (eventually) versioned.

## 🚀 Main features

- **Community catalog** of ready-to-use Mastra agents, workflows, and tools.
- **Simple CLI** to list, import, and configure agents in your project.
- **No hard dependency**: agents are copied into your code, fully editable.
- **Auto-generated registry.json** to centralize agent descriptions.
- **Extensible**: anyone can propose new agents via PRs on this repo.

## 🔥 Why use tsai-registry?

- Save time: reuse proven agents, get inspired by the community.
- Customize: freely edit imported code, just like shadcn/ui components.
- Contribute: share your agents to enrich the Mastra/AI ecosystem.
- Stay independent: no lock-in, no hidden dependency.

## ⚡️ Quick usage

- **List available agents:**
  ```sh
  npx tsai-registry list
  npx tsai-registry list agents
  ```
- **Add an agent to your project:**
  ```sh
  npx tsai-registry add <agent-name>
  ```
- **Show the current configuration:**
  ```sh
  npx tsai-registry settings
  ```

> The default registry is this open source repository. The whole community can contribute and share their agents!

## 🛠️ Add an agent to the registry

1. Create a folder in `<path/to/registry>/agents/<your-agent-name>`
2. Add your TypeScript files in this folder
3. Run the build command to update the registry:
   ```sh
   npx tsai-registry build <path/to/registry>
   ```
4. Your agent will be automatically referenced in `registry.json`
5. Open a Pull Request on this repo to share it with the community!

## 📝 Generating the registry (advanced)

To generate or update the `registry.json` file (useful if you want to host your own registry):

```sh
npx tsai-registry build <path/to/registry>
```

- `<path/to/registry>` is **required**.

This script will:
- Scan all agent, workflow, tool, etc. folders in the given path
- List files (excluding ignored extensions, see `settings.json`)
- Extract external dependencies and used environment variables
- Generate a `registry.json` file at the project root

## ⚙️ Configuration

- Extensions to ignore during build are set in `settings.json` under `build.ignoreExtensions`.
- The registry path and local folder are also configurable in `settings.json`.

## 🤝 Contributing

- Fork this repo, add your agents, open a Pull Request!
- Document each agent well (README, examples, dependencies, environment variables).
- Get inspired by the Python ecosystem and shadcn/ui for an "open, modular, customizable" philosophy.

---

## 🌟 Motivation & Vision

L'écosystème de l'IA évolue rapidement, et de nombreux frameworks Python (LangChain, CrewAI, etc.) proposent déjà des agents préconçus, facilement réutilisables et partageables. Pourtant, il n'existait pas d'équivalent simple, ouvert et communautaire pour l'écosystème TypeScript/JavaScript. 

**tsai-registry** s'inspire de l'expérience shadcn/ui :
- Permettre à tout développeur d'explorer, d'ajouter et de partager des agents, workflows et outils Mastra, sans dépendance forte au cœur du framework.
- Favoriser la réutilisation, la personnalisation et la contribution communautaire.
- Offrir une expérience "copier-coller" ou "add agent" simple, personnalisable, et à terme versionnable.

## 🚀 Fonctionnalités principales

- **Catalogue communautaire** d'agents, workflows et outils Mastra prêts à l'emploi.
- **CLI simple** pour lister, importer et configurer des agents dans votre projet.
- **Aucune dépendance forte** : les agents sont copiés dans votre code, modifiables à volonté.
- **Fichier registry.json** généré automatiquement pour centraliser la description des agents.
- **Extensible** : tout le monde peut proposer de nouveaux agents via des PR sur ce dépôt.

## 🔥 Pourquoi utiliser tsai-registry ?

- Gagnez du temps : réutilisez des agents éprouvés, inspirez-vous de la communauté.
- Personnalisez : modifiez librement le code importé, comme pour un composant shadcn/ui.
- Contribuez : partagez vos agents pour enrichir l'écosystème Mastra/AI.
- Restez indépendant : pas de lock-in, pas de dépendance cachée.

## ⚡️ Utilisation rapide

- **Lister les agents disponibles :**
  ```sh
  npx tsai-registry list
  npx tsai-registry list agents
  ```
- **Ajouter un agent dans votre projet :**
  ```sh
  npx tsai-registry add <nom-agent>
  ```
- **Afficher la configuration utilisée :**
  ```sh
  npx tsai-registry settings
  ```

> Le registry par défaut est ce dépôt open source. Toute la communauté peut y contribuer pour partager ses agents !

## 🛠️ Ajouter un agent au registry

1. Créez un dossier dans `<chemin/vers/registry>/agents/<nom-de-ton-agent>`
2. Ajoutez vos fichiers TypeScript dans ce dossier
3. Lancez la commande de build pour mettre à jour le registry :
   ```sh
   npx tsai-registry build <chemin/vers/registry>
   ```
4. Votre agent sera automatiquement référencé dans `registry.json`
5. Proposez une Pull Request sur ce dépôt pour le partager à la communauté !

## 📝 Génération du registry (avancé)

Pour générer ou mettre à jour le fichier `registry.json` (utile si vous souhaitez héberger votre propre registry) :

```sh
npx tsai-registry build <chemin/vers/registry>
```

- `<chemin/vers/registry>` est **obligatoire**.

Ce script va :
- Parcourir tous les dossiers d’agents, workflows, tools, etc. dans le chemin indiqué
- Lister les fichiers (hors extensions ignorées, voir `settings.json`)
- Extraire les dépendances externes et variables d’environnement utilisées
- Générer un fichier `registry.json` à la racine du projet

## ⚙️ Configuration

- Les extensions à ignorer lors du build sont définies dans `settings.json` sous la clé `build.ignoreExtensions`.
- Le chemin du registry et du dossier local sont aussi configurables dans `settings.json`.

## 🤝 Contribuer

- Forkez ce repo, ajoutez vos agents, ouvrez une Pull Request !
- Documentez bien chaque agent (README, exemples, dépendances, variables d'environnement).
- Inspirez-vous de l'écosystème Python et de shadcn/ui pour la philosophie "open, modulaire, personnalisable".

## 🛠️ Développement (dev)

Pour développer ou tester la CLI en local :

- Depuis le dossier `cli/`, installe les dépendances :
  ```sh
  bun install
  ```
- Pour lancer une commande en local (exemple pour lister les agents) :
  ```sh
  bun run index.ts list
  ```
- Pour builder la CLI localement :
  ```sh
  bun run build
  ```
- Pour tester une commande sur le build :
  ```sh
  bun run dist/index.js list
  ```

> Tu peux aussi utiliser `bun run index.ts ...` pour toutes les commandes disponibles.
