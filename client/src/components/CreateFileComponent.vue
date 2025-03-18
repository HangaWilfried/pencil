<script setup lang="ts">
import { ref } from "vue";

import { useClientApi } from "@/utils/api.ts";

import ImageComponent from "@/components/ImageComponent.vue";
import { PhotoIcon } from "@heroicons/vue/24/solid";

const api = useClientApi();

const sources = ref<string[]>([]);
const model = defineModel<string[]>({ default: [] });

const saveFile = async (file: File) => {
  const { data: id, error } = await api.createFile(file);
  if (error) return;
  if (id) {
    sources.value.unshift(URL.createObjectURL(file));
    model.value.push(id);
  }
};

const handleFileChange = async (e: Event): Promise<void> => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  await Promise.all([...files].map(saveFile));
};
</script>

<template>
  <div class="grid grid-cols-2 gap-2 rounded-lg border border-gray-300 bg-gray-100 p-2">
    <label
      for="image"
      class="relative flex h-32 flex-col items-center justify-center gap-1 rounded-lg border border-gray-300 p-2"
    >
      <PhotoIcon class="size-8 text-gray-600" />
      <span class="text-xs">No file chosen</span>
      <input
        id="image"
        type="file"
        name="image"
        @change="handleFileChange"
        class="absolute inset-0 size-full opacity-0"
      />
    </label>
    <template v-if="sources.length">
      <ImageComponent
        class="h-32"
        :is-local="false"
        :key="source"
        :path="source"
        v-for="source in sources"
      />
    </template>
  </div>
</template>
