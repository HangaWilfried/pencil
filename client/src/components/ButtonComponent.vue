<script setup lang="ts">
import { Theme } from "@/utils/types.ts";

withDefaults(
  defineProps<{
    theme?: Theme;
    isLoading?: boolean;
  }>(),
  {
    theme: Theme.Blue,
    isLoading: false,
  },
);

const classname = {
  red: "bg-red-500 text-black active:ring-1 active:ring-red-500",
  blue: "text-white bg-blue-500 active:ring-1 active:ring-blue-500",
  green: "text-black bg-green-500 active:ring-1 active:ring-green-500",
  yellow: "text-black bg-yellow-500 active:ring-1 active:ring-yellow-500",
};
</script>

<template>
  <button :disabled="isLoading" :class="classname[theme]">
    <span class="loading loading-spinner loading-lg" v-if="isLoading"></span>
    <slot v-else />
  </button>
</template>
