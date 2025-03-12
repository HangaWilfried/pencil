<script setup lang="ts">
import { ref } from "vue";

import { useClientApi } from "@/utils/api.ts";

import ImageComponent from "@/components/ImageComponent.vue";
import { PlusCircleIcon, PhoneIcon } from "@heroicons/vue/24/solid";

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
  <div class="grid auto-cols-max grid-flow-col gap-2">
    <label
      for="image"
      class="relative flex h-32 flex-col items-center justify-center gap-2 rounded-lg p-2"
    >
      <PhoneIcon class="size-8" />
      <PlusCircleIcon class="size-5" />
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
