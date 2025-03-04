<script setup lang="ts">
import { Theme } from '@/utils/types.ts'

withDefaults(defineProps<{
  theme?: Theme;
  isLoading?: boolean;
}>(), {
  theme: Theme.Blue,
  isLoading: false,
})

const classname = {
  blue: "text-white bg-blue-500 active:ring-1 active:ring-blue-500"
}
</script>

<template>
  <button :disabled="isLoading" :class="classname[theme]">
    <span class="loading loading-ring loading-xs" v-if="isLoading"></span>
    <slot v-else />
  </button>
</template>
