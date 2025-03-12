<template>
  <div v-if="isLoading" class="flex items-center justify-center p-10">
    <span class="loading loading-xl loading-ring text-gray-900"></span>
  </div>
  <div v-else-if="tags.length" class="flex flex-col gap-4 p-4">
    <TagCard v-for="tag in tags" :key="tag.id" :tag="tag" />
  </div>
  <NoItemsComponent v-else>
    <div class="flex flex-col items-center gap-2 text-sm font-bold">
      <span>No Post has been added for now.</span>
      <RouterLink to="/post/create">
        <ButtonComponent class="p-1">
          <span>Add</span>
          <PlusCircleIcon class="size-5" />
        </ButtonComponent>
      </RouterLink>
    </div>
  </NoItemsComponent>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useClientApi } from "@/utils/api.ts";
import type { TagDTO } from "@/utils/types.ts";

import TagCard from "@/components/TagCard.vue";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
import ButtonComponent from "@/components/ButtonComponent.vue";
import NoItemsComponent from "@/components/NoItemsComponent.vue";

const api = useClientApi();

const isLoading = ref(true);
const tags = ref<TagDTO[]>([]);

api.getAllTags().then((response) => {
  if (response.data) tags.value = response.data;
  isLoading.value = false;
});
</script>
