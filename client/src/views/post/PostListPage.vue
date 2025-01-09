<template>
  <span v-if="isLoading" class="text-4xl font-bold">Loading...</span>
  <div v-else-if="tags.length" class="flex flex-col gap-4 p-4">
    <TagCard v-for="tag in tags" :key="tag.id" :tag="tag" />
  </div>
  <span v-else>No Post has been added for now.</span>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useClientApi } from "@/utils/api.ts";
import type { TagDTO } from "@/utils/types.ts";
import TagCard from "@/components/TagCard.vue";

const props = defineProps<{
  query: string;
}>();

const api = useClientApi();

const tags = ref<TagDTO[]>([]);
const isLoading = ref(true);

api.getAllTags().then((response) => {
  if (response.data) tags.value = response.data;
  isLoading.value = false;
});

// const posts = ref<PostDTO[]>([]);
// const isLoading = ref<boolean>(true);
// api.getAllPosts().then((response) => {
//   if (response.data) posts.value = response.data;
//   isLoading.value = false;
// });

// const availablePosts = computed<PostDTO[]>(() => {
//   if (props.query) {
//     return posts.value.filter(
//       (post) =>
//         post.title === props.query || post.content.includes(props.query),
//     );
//   }
//   return posts.value;
// });
</script>
