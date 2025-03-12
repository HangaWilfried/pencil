<script setup lang="ts">
import ImageComponent from "@/components/ImageComponent.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 pt-20">
    <ImageComponent class="size-[150px]" path="folder.png" />
    <slot />
  </div>
</template>
