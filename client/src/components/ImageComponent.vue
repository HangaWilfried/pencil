<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    path: string;
    isLocal?: boolean;
  }>(),
  {
    isLocal: true,
  },
);

const source = computed<string>(() => {
  if (props.isLocal) {
    const url = `../assets/${props.path}`;
    return new URL(url, import.meta.url).href;
  }
  return props.path;
});
</script>

<template>
  <div class="overflow-hidden">
    <img class="size-full object-cover" :src="source" :alt="`placeholder for ${path} image`" />
  </div>
</template>
