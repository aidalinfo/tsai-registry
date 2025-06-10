<script setup lang="ts">
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import DocsSidebar from '@/components/DocsSidebar.vue'
import { onMounted } from 'vue'

interface Props {
  title?: string
}

const { title = "Documentation" } = defineProps<Props>()

// Ajouter des boutons de copie à tous les blocs de code
onMounted(() => {
  const codeBlocks = document.querySelectorAll('.prose pre');
  
  codeBlocks.forEach(pre => {
    // Ne pas ajouter de bouton si c'est déjà un CodeBlock avec bouton
    if (pre.querySelector('.copy-button')) return;
    
    const code = pre.querySelector('code');
    if (!code) return;
    
    const button = document.createElement('button');
    button.innerHTML = '📋 Copier';
    button.className = 'copy-button absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground border border-border rounded px-2 py-1 text-xs font-medium';
    
    button.addEventListener('click', () => {
      const text = code.textContent || code.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copié !';
        button.style.background = 'var(--color-primary)';
        button.style.color = 'var(--color-primary-foreground)';
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = '';
          button.style.color = '';
        }, 2000);
      }).catch(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '❌ Erreur';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      });
    });
    
    // Ajouter les classes nécessaires au pre pour le hover
    pre.classList.add('group', 'relative');
    pre.appendChild(button);
  });
})
</script>

<template>
  <div class="fixed top-16 left-0 right-0 bottom-0 flex">
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset class="flex-1 flex flex-col overflow-hidden">
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger class="-ml-1" />
          <div class="flex flex-1 items-center gap-2">
            <h1 class="text-lg font-semibold">{{ title }}</h1>
          </div>
        </header>
        <main class="flex-1 overflow-auto p-4">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>