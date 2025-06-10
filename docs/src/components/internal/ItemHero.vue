<template>
  <section class="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white py-16">
    <div class="max-w-2xl w-full mx-auto flex flex-col items-center text-center gap-6">
      <h1 class="text-3xl md:text-5xl font-bold">{{ item.name }}</h1>
      <p class="text-lg md:text-xl text-muted-foreground mb-2">{{ item.description }}</p>
      <div class="flex flex-wrap gap-2 justify-center mb-2">
        <Badge v-for="tag in item.tags" :key="tag">{{ tag }}</Badge>
      </div>
      <div v-if="item.author" class="flex items-center gap-2 justify-center mb-2">
        <img :src="`https://github.com/${item.author}.png`" :alt="`${item.author} GitHub avatar`" class="w-6 h-6 rounded-full border" />
        <a :href="`https://github.com/${item.author}`" target="_blank" class="text-blue-600 hover:underline text-sm">{{ item.author }}</a>
      </div>
      <Card class="w-full flex flex-col items-start gap-2">
        <CardHeader class="flex flex-row items-center justify-between w-full">
          <CardTitle class="text-base">Install</CardTitle>
          <button @click="copyCommand" class="ml-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs font-mono">Copy</button>
        </CardHeader>
        <CardContent>
          <code class="block font-mono text-sm">npx tsai-registry add {{ item.folder }}</code>
        </CardContent>
      </Card>
      <Card v-if="item.exports && item.exports.length" class="w-full flex flex-col items-start gap-2">
        <CardHeader>
          <CardTitle class="text-base">Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="list-disc pl-6 mt-1 text-left">
            <li v-for="exp in item.exports" :key="exp">
              <code>{{ exp }}</code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ref } from 'vue';
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

const copyCommand = () => {
  navigator.clipboard.writeText(`npx tsai-registry add ${props.item.folder}`);
};
</script>
