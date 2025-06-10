import { FileText, Home, BookOpen, Settings, Wrench, Users, Code } from 'lucide-vue-next'

export interface NavigationItem {
  title: string
  url?: string
  icon: any
  items?: NavigationItem[]
}

// Fonction pour convertir un nom de fichier en titre lisible
function formatTitle(filename: string): string {
  return filename
    .replace(/^\d+-/, '') // Supprimer les préfixes numériques (01-, 02-, etc.)
    .replace(/[-_]/g, ' ') // Remplacer tirets et underscores par des espaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Fonction pour obtenir l'icône appropriée selon le nom du fichier/dossier
function getIcon(name: string) {
  const lowerName = name.toLowerCase()
  
  if (lowerName.includes('install') || lowerName.includes('getting-start')) {
    return Code
  }
  if (lowerName.includes('config') || lowerName.includes('setting')) {
    return Settings
  }
  if (lowerName.includes('agent') || lowerName.includes('team')) {
    return Users
  }
  if (lowerName.includes('tool') || lowerName.includes('util')) {
    return Wrench
  }
  
  return FileText
}

// Structure de navigation statique - vous pouvez l'étendre selon vos besoins
export const getNavigationItems = (): NavigationItem[] => [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Documentation",
    icon: BookOpen,
    items: [
      {
        title: "Introduction",
        url: "/docs",
        icon: FileText,
      },
      // Ces sections peuvent être ajoutées quand vous créez les pages correspondantes
      {
        title: "Installation",
        url: "/docs/installation",
        icon: Code,
      },
      {
        title: "Configuration",
        url: "/docs/configuration", 
        icon: Settings,
      },
      {
        title: "Agents",
        icon: Users,
        items: [
          {
            title: "Introduction aux Agents",
            url: "/docs/agents",
            icon: FileText,
          },
          {
            title: "Weather Agent",
            url: "/docs/agents/weather-agent",
            icon: FileText,
          },
          {
            title: "Exa Agent",
            url: "/docs/agents/exa-agent", 
            icon: FileText,
          },
          {
            title: "Firecrawl Agent",
            url: "/docs/agents/firecrawl-agent",
            icon: FileText,
          }
        ]
      },
      {
        title: "Outils",
        icon: Wrench,
        items: [
          {
            title: "Introduction aux Outils",
            url: "/docs/tools",
            icon: FileText,
          },
          {
            title: "Weather Tool", 
            url: "/docs/tools/weather-tool",
            icon: FileText,
          }
        ]
      },
      {
        title: "Workflows",
        icon: BookOpen,
        items: [
          {
            title: "Introduction aux Workflows",
            url: "/docs/workflows",
            icon: FileText,
          },
          {
            title: "Weather Workflow",
            url: "/docs/workflows/weather-workflow", 
            icon: FileText,
          }
        ]
      }
    ]
  }
]

// Fonction pour vérifier si une page existe (utile pour le développement)
export const pageExists = (url: string): boolean => {
  // Dans un vrai environnement, vous pourriez vérifier si le fichier existe
  // Pour l'instant, on retourne true pour toutes les URLs
  return true
}

// Fonction pour obtenir le chemin de la page actuelle
export const getCurrentPath = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname
  }
  return '/'
}