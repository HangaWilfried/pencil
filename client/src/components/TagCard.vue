<script setup lang="ts">
import { ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import type { PostDTO, TagDTO } from "@/utils/types.ts";

const api = useClientApi();
const props = defineProps<{ tag: TagDTO }>();

const posts = ref<PostDTO[]>([]);

api.getPostsByTag(props.tag.id).then((response) => {
  if (response.data) posts.value = response.data;
});
</script>

<template>
  <div class="divide-y divide-gray-100 rounded-lg bg-white p-4">
    <h1 class="py-1">
      {{ tag.name }}
    </h1>
    <PostDTO v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>
