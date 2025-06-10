<template>
  <section class="flex flex-col items-center justify-center min-h-[60vh] w-full text-center py-16">
    <h1 class="text-4xl md:text-6xl font-bold mb-6">
      Discover <span class="text-primary">tsai-registry</span>
    </h1>
    <p class="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
      More than just a tool, tsai-registry is a community of passionate creators. Access an open catalog of Mastra agents, workflows, and tools, share your contributions, and get inspired by the community.
    </p>
    <div class="flex flex-col md:flex-row gap-4 justify-center">
      <Button class="font-bold px-8 py-3 text-base" href="/items">Browse items</Button>
      <Button as-child variant="secondary" class="font-bold px-8 py-3 text-base">
        <a href="https://github.com/aidalinfo/tsai-registry" target="_blank">View GitHub repository</a>
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>
