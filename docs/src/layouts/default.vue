<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar class="w-full" client:load />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/internal/Navbar.vue";
</script>
