<template>
  <a :href="item.link" class="block">
    <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer group border-2 border-gray-200 hover:border-primary">
      <!-- Left: Github Avatar and author link -->
      <div class="flex flex-col items-center justify-center min-w-12">
        <img
          :src="`https://github.com/${item.author}.png`"
          :alt="`${item.author} GitHub avatar`"
          class="w-8 h-8 rounded-full border border-gray-200 group-hover:border-primary transition mb-1"
        />
        <span class="text-xs text-muted-foreground mt-1">{{ item.author }}</span>
      </div>

      <!-- Center: Name, tags, description -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold truncate">{{ item.name }}</h2>
        </div>
        <div class="flex flex-wrap gap-1 my-1">
          <Badge v-for="tag in item.tags" :key="tag" class="text-xs">{{ tag }}</Badge>
        </div>
        <p class="text-sm text-muted-foreground line-clamp-2">{{ item.description }}</p>
      </div>

      <!-- Right: Arrow -->
      <div class="ml-4 flex items-center">
        <svg class="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
// import GithubIcon from '@/components/icons/GithubIcon.vue';

const props = defineProps<{
  item: {
    name: string;
    description: string;
    tags: string[];
    author: string;
    link: string;
  }
}>();
</script>
