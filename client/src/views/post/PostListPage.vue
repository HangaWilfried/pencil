<template>
  <span v-if="isLoading" class="text-4xl font-bold"> Loading... </span>
  <div v-else-if="availablePosts.length" class="grid grid-cols-4 gap-4">
    <RouterLink
      v-for="post in availablePosts"
      :key="post.id"
      :to="`/post/${post.id}`"
    >
      <PostCard :post="post" />
    </RouterLink>
  </div>
  <span v-else>No Post has been added for now.</span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useClientApi } from "@/utils/api.ts";
import type { PostDTO } from "@/utils/types.ts";
import PostCard from "@/components/PostCard.vue";

const props = defineProps<{
  query: string;
}>();

const posts = ref<PostDTO[]>([]);
const isLoading = ref<boolean>(true);

const api = useClientApi();
api.getAllPosts().then((response) => {
  if (response.data) posts.value = response.data;
  isLoading.value = false;
});

const availablePosts = computed<PostDTO[]>(() => {
  if (props.query) {
    return posts.value.filter(
      (post) =>
        post.title === props.query || post.content.includes(props.query),
    );
  }
  return posts.value;
});
</script>
