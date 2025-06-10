// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';

// Plugins Markdown
import remarkGfm from 'remark-gfm';
import remarkCodeTitles from 'remark-code-titles';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()]
	},

  integrations: [
    vue(), 
    mdx({
      // Configuration pour appliquer automatiquement le layout aux MDX
      extendMarkdownConfig: false,
      remarkPlugins: [
        remarkGfm,
        remarkCodeTitles,
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behavior: 'wrap',
          properties: {
            className: ['anchor-link'],
            ariaLabel: 'Lien vers cette section'
          }
        }],
        rehypeCodeTitles,
      ],
      // Appliquer le layout automatiquement
      optimize: true,
    })
  ],
  // Configuration globale pour Astro
  markdown: {
    // Configuration globale pour Markdown et MDX
    remarkPlugins: [
      remarkGfm, // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
      remarkCodeTitles, // Titres pour les blocs de code
    ],
    rehypePlugins: [
      rehypeSlug, // Ajoute des IDs aux headings
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor-link'],
          ariaLabel: 'Lien vers cette section'
        }
      }], // Liens automatiques sur les headings
      rehypeCodeTitles, // Titres stylés pour les blocs de code
    ],
    syntaxHighlight: 'prism', // Coloration syntaxique avec Prism
    shikiConfig: {
      // Configuration alternative avec Shiki (commentée)
      theme: 'github-dark',
      wrap: true
    }
  }
});