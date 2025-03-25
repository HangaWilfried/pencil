<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import { toast } from "vue3-toastify";

const props = withDefaults(
  defineProps<{
    path: string;
    isLocal?: boolean;
  }>(),
  {
    isLocal: true,
  },
);

const api = useClientApi();
const source = ref<string>();
const isLoading = ref<boolean>(false);

onBeforeMount(async () => {
  isLoading.value = true;
  if (props.isLocal) {
    const url = `../assets/${props.path}`;
    source.value = new URL(url, import.meta.url).href;
  } else {
    const {data, error} = await api.getFileById(props.path);
    if(error) toast.error(error);
    if (data) source.value = data;
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="overflow-hidden">
    <span class="loading loading-ring text-yellow-500" v-if="isLoading"></span>
    <img v-else class="size-full object-cover" :src="source" :alt="`placeholder for ${path} image`" />
  </div>
</template>
