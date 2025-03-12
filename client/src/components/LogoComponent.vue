<script setup lang="ts">
import ImageComponent from "@/components/ImageComponent.vue";
</script>

<template>
  <RouterLink to="/">
    <h1 class="relative">
      <ImageComponent class="absolute -top-4 -left-7 size-10" path="pencil.png" />
      <span class="rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white">Pencil</span>
    </h1>
  </RouterLink>
</template>
