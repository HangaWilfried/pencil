<script setup lang="ts">
import { ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import type { PostDTO, TagDTO } from "@/utils/types.ts";

import PostCard from "@/components/PostCard.vue";

const api = useClientApi();
const props = defineProps<{ tag: TagDTO }>();

const posts = ref<PostDTO[]>([]);

api
  .getPostsByTag(props.tag.id)
  .then((response) => {
    console.log("RESPONSE", response);
    if (response.data) posts.value = response.data;
  });
</script>

<template>
  <div class="divide-y divide-gray-100 rounded-lg bg-white">
    <h1 class="py-1">{{ tag.name }}</h1>
    <div class="grid grid-cols-4">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
