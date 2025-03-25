<script setup lang="ts">
import { ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import { toast } from "vue3-toastify";
import { PhotoIcon } from "@heroicons/vue/24/solid";
import ImageComponent from "@/components/ImageComponent.vue";

defineProps<{ modelValue: string[] }>()
const emit = defineEmits(["update:modelValue"]);

const api = useClientApi();
const sources = ref<{id: string; path: string}[]>([]);

const saveFile = async (file: File) => {
  const { data: id, error } = await api.createFile(file);
  if (error) {
    toast.error(error);
    return;
  }
  if (id) {
    console.log("file created", id);
    sources.value.unshift({
      path: URL.createObjectURL(file),
      id: id,
    });
    emit("update:modelValue", sources.value.map((file) => file.id));
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
        :key="source.id"
        :path="source.path"
        v-for="source in sources"
      />
    </template>
  </div>
</template>
