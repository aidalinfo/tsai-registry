<template>
  <div class="p-6 bg-white rounded-lg shadow flex flex-col gap-4">
    <h1 class="text-2xl font-bold">{{ item.name }}</h1>
    <p class="text-muted-foreground text-base mb-2">{{ item.description }}</p>
    <div class="flex flex-wrap gap-2 mb-2">
      <Badge v-for="tag in item.tags" :key="tag">{{ tag }}</Badge>
    </div>
    <div v-if="item.author" class="flex items-center gap-2 mb-2">
      <img :src="`https://github.com/${item.author}.png`" :alt="`${item.author} GitHub avatar`" class="w-6 h-6 rounded-full border" />
      <a :href="`https://github.com/${item.author}`" target="_blank" class="text-blue-600 hover:underline text-sm">{{ item.author }}</a>
    </div>
    <div class="bg-gray-50 rounded p-4 text-sm">
      <span class="font-semibold">Install:</span>
      <code class="ml-2">npx tsai-registry add {{ item.folder }}</code>
    </div>
    <div v-if="item.exports && item.exports.length" class="bg-gray-50 rounded p-4 text-sm">
      <span class="font-semibold">Exports:</span>
      <ul class="list-disc pl-6 mt-1">
        <li v-for="exp in item.exports" :key="exp">
          <code>{{ exp }}</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
const props = defineProps<{
  item: {
    name: string;
    description: string;
    tags: string[];
    author?: string;
    folder: string;
    exports?: string[];
  }
}>();
</script>
