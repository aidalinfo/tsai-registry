# Contributing to tsai-registry

Want to contribute to the community registry for Mastra agents, workflows, and tools? This comprehensive guide will walk you through the project structure, setup process, and contribution workflow.

## Project Overview

**tsai-registry** is a community-driven registry inspired by shadcn/ui, designed to make Mastra agents, workflows, and tools easily shareable and reusable. The project is structured as a monorepo with multiple interconnected components.

### 🏗️ Project Structure

The repository is organized into several key directories:

```
tsai-registry/
├── app/                    # Main Mastra application for testing agents
│   ├── src/mastra/
│   │   ├── index.ts       # Main Mastra configuration
│   │   ├── agents/        # Local agents for testing
│   │   ├── registry/      # 📦 REGISTRY SOURCE - agents distributed via CLI
│   │   │   ├── agents/    # Community agents
│   │   │   ├── workflows/ # Community workflows
│   │   │   └── tools/     # Community tools
│   │   ├── tools/         # Local tools for testing
│   │   └── workflows/     # Local workflows for testing
│   ├── package.json       # Mastra dependencies
│   └── pnpm-lock.yaml
├── cli/                    # 📦 NPM PACKAGE - CLI tool for registry interaction
│   ├── index.ts           # Main CLI logic
│   ├── build.ts           # Registry builder script
│   ├── utils.ts           # Shared utilities
│   ├── package.json       # CLI package configuration
│   └── bun.lockb          # Bun lockfile
├── docs/                   # 📚 DOCUMENTATION SITE - Astro with Vue/Tailwind
│   ├── src/
│   │   ├── pages/docs/    # Documentation markdown files
│   │   ├── components/    # Vue components with shadcn/ui
│   │   └── layouts/       # Astro layouts
│   ├── astro.config.mjs   # Astro configuration
│   ├── package.json       # Documentation dependencies
│   └── pnpm-lock.yaml
├── test/                   # 🧪 CLI TESTING ENVIRONMENT
│   ├── src/mastra/        # Test Mastra setup
│   ├── package.json       # Test dependencies
│   └── pnpm-lock.yaml
├── registry.json           # 📋 GENERATED REGISTRY INDEX
└── settings.json           # ⚙️ CLI DEFAULT SETTINGS
```

### 🎯 How Components Work Together

1. **`/app/src/mastra/registry/`** - The source of truth for all community agents, workflows, and tools
2. **CLI (`/cli/`)** - Published npm package that reads from `registry.json` and GitHub repository
3. **Registry Builder** - Scans `/app/src/mastra/registry/` and generates `registry.json`
4. **Documentation (`/docs/`)** - Astro site with Vue components and Tailwind CSS
5. **Test Environment (`/test/`)** - Isolated environment for testing CLI commands

## 🚀 Development Setup

### Prerequisites

- **Node.js** >= 20.9.0
- **pnpm** (for app, docs, test directories)
- **Bun** (for CLI development)
- **Git** for version control

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/aidalinfo/tsai-registry.git
   cd tsai-registry
   ```

2. **Install Dependencies**
   ```bash
   # Install CLI dependencies
   cd cli
   bun install
   cd ..

   # Install app dependencies
   cd app
   pnpm install
   cd ..

   # Install docs dependencies
   cd docs
   pnpm install
   cd ..

   # Install test dependencies
   cd test
   pnpm install
   cd ..
   ```

### Package Managers by Directory

- **`/cli/`** - Uses **Bun** (`bun.lockb`)
- **`/app/`** - Uses **pnpm** (`pnpm-lock.yaml`)
- **`/docs/`** - Uses **pnpm** (`pnpm-lock.yaml`)  
- **`/test/`** - Uses **pnpm** (`pnpm-lock.yaml`)

## 🛠️ Development Workflow

### Working with the CLI

The CLI is the core tool for interacting with the registry:

```bash
cd cli

# Run CLI commands during development
bun index.ts list
bun index.ts add weather-agent
bun index.ts build ../app/src/mastra/registry

# Build the CLI for distribution
bun run build

# Test the built CLI
bun dist/index.js list
```

### Working with the App

The app contains the registry source and testing environment:

```bash
cd app

# Start Mastra development server
pnpm dev

# Build the application
pnpm build

# Start production server
pnpm start
```

### Working with Documentation

The documentation is built with Astro, Vue, and Tailwind CSS:

```bash
cd docs

# Start development server
pnpm dev

# Build documentation
pnpm build

# Preview built documentation
pnpm preview
```

### Testing CLI Changes

Use the test directory to validate CLI functionality:

```bash
cd test

# Test CLI commands (using relative path to CLI)
bun ../cli/index.ts list
bun ../cli/index.ts add weather-agent

# Test Mastra integration
pnpm dev
```

## 📦 Adding New Agents

### 1. Create Agent Structure

Navigate to the registry directory and create your agent:

```bash
cd app/src/mastra/registry/agents/
mkdir your-agent-name
cd your-agent-name
```

### 2. Implement Your Agent

Create the required files:

**`your-agent.ts`** - Main implementation:
```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

const mainModel = openai("gpt-4o-mini");

export const yourAgent = new Agent({
  name: "Your Agent Name",
  instructions: `
    Detailed instructions for your agent.
    Explain what the agent does and how it behaves.
  `,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
  model: mainModel,
  tools: {
    // Add your tools here
  }
});
```

**`index.ts`** - Export file:
```typescript
import { yourAgent } from './your-agent'

export { yourAgent }
```

### 3. Update the Registry

Build the registry to include your new agent:

```bash
# From project root
bun cli/index.ts build app/src/mastra/registry
```

**⚠️ Known Issue**: The CLI currently has a bug with `npx` execution. Use the direct Bun command instead:
```bash
# This doesn't work yet:
# npx tsai-registry build app/src/mastra/registry

# Use this instead:
bun cli/index.ts build app/src/mastra/registry
```

### 4. Test Your Agent

```bash
cd test
bun ../cli/index.ts add your-agent-name
pnpm dev
```

## 🔧 Configuration Files

### TypeScript Configurations

Each directory has its own TypeScript configuration:

- **`/cli/tsconfig.json`** - Modern ESNext setup for CLI
- **`/app/tsconfig.json`** - ES2022 with bundler resolution
- **`/docs/tsconfig.json`** - Astro strict configuration
- **`/test/tsconfig.json`** - ES2022 with bundler resolution

### Package Configurations

- **`/cli/package.json`** - NPM package for CLI distribution
- **`/app/package.json`** - Mastra application with required dependencies
- **`/docs/package.json`** - Astro documentation site
- **`/test/package.json`** - Testing environment

### Settings Configuration

**`/settings.json`** - Default CLI settings:
```json
{
  "settings": {
    "url": "https://github.com/aidalinfo/tsai-registry",
    "registry": "registry.json",
    "local": "src/mastra/registry"
  },
  "build": {
    "ignoreExtensions": [".md", ".yaml"]
  }
}
```

## 🏗️ Build and CI Process

### Current Build Process

1. **Manual Registry Build**: Run `bun cli/index.ts build app/src/mastra/registry`
2. **NPM Package**: Built automatically on git tag via GitHub Actions
3. **Documentation**: Deployed via standard Astro build process

### Registry Generation

The `cli/build.ts` script:
- Scans supported types: `agents`, `workflows`, `tools`, `mcp`
- Extracts dependencies from import statements
- Extracts environment variables from `process.env` usage
- Generates `registry.json` with metadata for each component
- Ignores files based on `settings.json` configuration

### Planned Improvements

- **Automated CI**: Set up GitHub Actions for registry building
- **CLI Fix**: Resolve npx execution issues
- **Code Quality**: Consider tools like CodeRabbit for automated reviews
- **Monorepo Tools**: Potential migration to modern monorepo tools

## 🤝 Contribution Guidelines

### Getting Started

1. **Open PR Early**: Create a draft PR even before finishing your work so maintainers can see what you're working on
2. **Fork First**: Always work from a fork rather than direct repository access
3. **Small Changes**: Break large features into smaller, reviewable chunks

### Code Standards

- **TypeScript**: Use proper typing throughout
- **Dependencies**: Only add necessary dependencies
- **Environment Variables**: Document all required API keys and configuration
- **Error Handling**: Include proper error handling and fallbacks
- **Testing**: Test your agents in the test environment before submitting

### Documentation

- **README**: Add documentation for complex agents
- **Examples**: Provide usage examples
- **Environment Setup**: Document how to obtain required API keys
- **Dependencies**: List and explain all external dependencies

### Commit Guidelines

Use conventional commit format:
```
feat: add email automation agent
fix: resolve weather API timeout issue
docs: update agent installation guide
chore: update dependencies
```

### PR Process

1. **Create Feature Branch**: `git checkout -b feature/your-agent-name`
2. **Implement Agent**: Follow the agent creation guidelines
3. **Update Registry**: Run the build command to update registry.json
4. **Test Thoroughly**: Use the test environment to validate functionality
5. **Open Draft PR**: Create PR early for feedback
6. **Address Reviews**: Respond to maintainer feedback promptly
7. **Final Review**: Wait for approval before merging

## 🐛 Known Issues & Workarounds

### CLI NPX Issue

**Problem**: `npx tsai-registry build` doesn't work correctly

**Workaround**: Use direct Bun execution:
```bash
bun cli/index.ts build app/src/mastra/registry
```

### Monorepo Package Management

**Current State**: Mixed package managers (pnpm + Bun)

**Future**: Consider unified monorepo tooling for better dependency management

## 📋 Registry Format

The generated `registry.json` contains entries like:

```json
{
  "agent-name": {
    "type": "agents",
    "name": "agent-name", 
    "files": [
      "app/src/mastra/registry/agents/agent-name/agent.ts",
      "app/src/mastra/registry/agents/agent-name/index.ts"
    ],
    "dependencies": [
      "@mastra/core",
      "@ai-sdk/openai"
    ],
    "envs": [
      "OPENAI_API_KEY"
    ]
  }
}
```

## 🎯 Agent Ideas

Looking for inspiration? The community would love to see:

- **Email Automation**: Gmail/Outlook integration agents
- **Social Media**: Twitter/LinkedIn content agents  
- **Developer Tools**: Code review and analysis agents
- **Data Processing**: CSV/JSON transformation agents
- **Communication**: Slack/Discord bot agents
- **Content Creation**: Blog writing and SEO agents
- **E-commerce**: Product management agents
- **Analytics**: Data visualization and reporting agents

## 🆘 Getting Help

- **GitHub Issues**: Ask questions or report bugs
- **Discussions**: Join community discussions
- **Documentation**: Check existing docs and examples
- **Code Review**: Study existing agents for patterns

## 📈 Roadmap

### Short Term
- Fix CLI npx build execution bug
- Implement automated CI for registry builds
- Improve monorepo tooling

### Medium Term  
- Add agent versioning system


---

**Ready to contribute?** Start by exploring existing agents, then create your own following this guide. The community is excited to see what you'll build! 🚀