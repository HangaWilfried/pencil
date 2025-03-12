<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { useClientApi } from "@/utils/api.ts";
import type { TagDTO } from "@/utils/types.ts";

import TagDetailsModal from "@/components/TagDetailsModal.vue";
import TagCreateModal from "@/components/TagCreateModal.vue";

const tags = ref<TagDTO[]>([]);
const isLoading = ref<boolean>(false);

const api = useClientApi();

onBeforeMount(async () => {
  isLoading.value = true;
  const { data } = await api.getAllTags();
  if (data) {
    tags.value = data;
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <h1>Tag</h1>
        <span>Discover amazing tags that users like you create</span>
      </div>
      <TagCreateModal />
    </div>
    <div v-if="isLoading" class="p-10">
      <span class="loading loading-lg loading-spinner"></span>
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>name</th>
          <th>description</th>
          <th>action</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tags.length">
          <TagDetailsModal v-for="tag in tags" :key="tag.id" :tag="tag" />
        </template>
        <tr>
          <td colspan="3" class="py-2 text-center">No tag has been created.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
