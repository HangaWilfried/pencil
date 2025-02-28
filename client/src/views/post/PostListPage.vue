<template>
  <div v-if="isLoading" class="flex p-10 justify-center items-center">
    <span class="text-gray-900 loading loading-xl loading-ring"></span>
  </div>
  <div v-else-if="tags.length" class="flex flex-col gap-4 p-4">
    <TextField placeholder="search over posts..." name="search" />
    <TagCard v-for="tag in tags" :key="tag.id" :tag="tag" />
  </div>
  <NoItemsComponent v-else :handle-add-button-clicked="() => null" />
<!--  <template v-else>-->
<!--    <NoItemsComponent v-else />-->
<!--  </template>-->
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useClientApi, useToken } from '@/utils/api.ts'
import type { TagDTO } from "@/utils/types.ts";
import TagCard from "@/components/TagCard.vue";
import TextField from '@/components/TextField.vue'
import NoItemsComponent from '@/components/NoItemsComponent.vue'

const api = useClientApi();
const session = useToken();

const query = ref<string>();
const isLoading = ref(true);
const tags = ref<TagDTO[]>([]);

api
  .getAllTags()
  .then((response) => {
    if (response.data) tags.value = response.data;
    isLoading.value = false;
  });
</script>
