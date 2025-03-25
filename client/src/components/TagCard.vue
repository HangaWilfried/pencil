<script setup lang="ts">
import { ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import type { PostDTO, TagDTO } from "@/utils/types.ts";

import PostCard from "@/components/PostCard.vue";

const api = useClientApi();
const props = defineProps<{ tag: TagDTO }>();

const id = props.tag.id;
const posts = ref<PostDTO[]>([]);
const isLoading = ref<boolean>(false);

if (id) {
  isLoading.value = true;
  api
    .getPostsByTag(id)
    .then((response) => {
      if (response.data) posts.value = response.data;
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
}
</script>

<template>
  <section class="divide-y divide-gray-100 rounded-lg bg-white">
    <h1 class="py-1">{{ tag.name }}</h1>
    <div class="p-4">
      <span v-if="isLoading" class="loading-spinner loading-lg text-gray-800"></span>
      <div v-else-if="posts.length" class="grid grid-cols-4">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
      <div v-else>There is no post created for this tag!</div>
    </div>
  </section>
</template>
