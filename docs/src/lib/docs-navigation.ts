import { FileText, Home, BookOpen, Settings, Wrench, Users, Code } from 'lucide-vue-next'

export interface NavigationItem {
  title: string
  url?: string
  icon: any
  items?: NavigationItem[]
  order?: number
}

// Interface pour le frontmatter des pages
interface PageFrontmatter {
  title?: string
  description?: string
  navbar_title?: string
  order?: number
  [key: string]: any
}

// Interface pour les données de page importées
interface PageData {
  frontmatter?: PageFrontmatter
}

// Fonction pour convertir un nom de fichier en titre lisible
function formatTitle(filename: string): string {
  return filename
    .replace(/^\d+-/, '') // Supprimer les préfixes numériques (01-, 02-, etc.)
    .replace(/[-_]/g, ' ') // Remplacer tirets et underscores par des espaces
    .replace(/\.(mdx?|astro)$/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Fonction pour obtenir l'icône appropriée selon le nom du fichier/dossier
function getIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('install') || lowerName.includes('getting-start')) return Code
  if (lowerName.includes('config') || lowerName.includes('setting')) return Settings
  if (lowerName.includes('agent') || lowerName.includes('team')) return Users
  if (lowerName.includes('tool') || lowerName.includes('util')) return Wrench
  if (lowerName.includes('workflow')) return BookOpen
  return FileText
}

// Fonction pour construire la navigation dynamiquement à partir des fichiers docs
export const getNavigationItems = (): NavigationItem[] => {
  // Astro/Vite only: récupère tous les fichiers MDX/Markdown/Astro dans pages/docs
  const pages = import.meta.glob('/src/pages/docs/**/*.{md,mdx,astro}', { eager: true, import: 'frontmatter' }) as Record<string, PageFrontmatter>

  // Construction d'un arbre à partir des chemins
  const tree: any = {}
  Object.keys(pages).forEach((fullPath) => {
    // Ex: /src/pages/docs/agents/weather-agent.mdx
    const relPath = fullPath.replace(/^.*\/pages\/docs\//, '')
    const parts = relPath.split('/')
    let current = tree
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const name = part.replace(/\.(mdx?|astro)$/, '')
      if (!current[name]) {
        current[name] = isFile
          ? { __file: true, path: '/docs/' + relPath.replace(/\.(mdx?|astro)$/, ''), filename: part, frontmatter: pages[fullPath] || {} }
          : {}
      }
      current = current[name]
    }
  })

  // Fonction récursive pour transformer l'arbre en items de navigation
  function treeToNav(node: any, parentPath = '/docs'): any[] {
    return Object.entries(node)
      .filter(([k]) => k !== '__file' && k !== 'filename' && k !== 'path' && k !== 'frontmatter')
      .map(([key, value]: [string, any]) => {
        if (value.__file) {
          // Si c'est la racine de /docs ou un index, on affiche "Introduction"
          const isRootIndex = value.path === '/docs' || value.path === '/docs/index';
          const navTitle = value.frontmatter.navbar_title ||
            (isRootIndex
              ? 'Introduction'
              : formatTitle(key === 'index' ? (parentPath.split('/').pop() || 'Index') : key));
          return {
            title: navTitle,
            url: value.path === '/docs/index' ? '/docs' : value.path,
            icon: getIcon(key),
            order: value.frontmatter.order ?? 9999,
          }
        } else {
          // Dossier
          const children = treeToNav(value, parentPath + '/' + key)
          return {
            title: formatTitle(key),
            icon: getIcon(key),
            items: children,
            order: children[0]?.order ?? 9999,
          }
        }
      })
      .sort((a, b) => (a.order - b.order) || a.title.localeCompare(b.title))
  }

  // Racine de la navigation
  return [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Documentation',
      icon: BookOpen,
      items: treeToNav(tree),
    }
  ]
}

export const pageExists = (url: string): boolean => true
export const getCurrentPath = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname
  }
  return '/'
}