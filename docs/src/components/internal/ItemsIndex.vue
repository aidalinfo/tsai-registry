<template>
  <section class="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white py-16">
    <div class="max-w-3xl w-full mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <Input
        v-model="search"
        type="text"
        placeholder="Search by name..."
        class="w-full md:w-1/2"
      />
      
      <Select v-model="author">
        <SelectTrigger class="w-full md:w-1/4">
          <SelectValue placeholder="All authors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All authors</SelectItem>
          <SelectItem v-for="a in authors" :key="a" :value="a">{{ a }}</SelectItem>
        </SelectContent>
      </Select>
      
      <Select v-model="tag">
        <SelectTrigger class="w-full md:w-1/4">
          <SelectValue placeholder="All tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tags</SelectItem>
          <SelectItem v-for="t in tags" :key="t" :value="t">{{ t }}</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="max-w-3xl w-full mx-auto grid gap-6 mt-0">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.name"
        :item="item"
      />
      <div v-if="filteredItems.length === 0" class="text-center text-muted-foreground py-12">
        No items found.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import ItemCard from './ItemCard.vue';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const props = defineProps<{ items: any[] }>();

const search = ref('');
const author = ref('all');
const tag = ref('all');

const authors = ref<string[]>([]);
const tags = ref<string[]>([]);

watchEffect(() => {
  if (props.items && props.items.length > 0) {
    authors.value = Array.from(new Set(props.items.map(i => i.author).filter(Boolean)));
    tags.value = Array.from(new Set(props.items.flatMap(i => i.tags)));
  }
});

const filteredItems = computed(() => {
  return props.items.filter(item => {
    const matchesName = item.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesAuthor = author.value === 'all' || item.author === author.value;
    const matchesTag = tag.value === 'all' || item.tags.includes(tag.value);
    return matchesName && matchesAuthor && matchesTag;
  });
});
</script>