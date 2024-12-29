<template>
  <div
    class="relative flex flex-col gap-1 rounded-lg border bg-white hover:shadow"
  >
    <div class="flex justify-between p-4">
      <h1>{{ post.title }}</h1>
      <span class="absolute -right-2 -top-2 rounded-xl bg-white p-1 text-xs">
        Posted {{ useRelativeTime(post.createdAt) }}
      </span>
    </div>
    <span v-if="isLoading">loading...</span>
    <template v-if="user">
      <p class="p-4">
        {{ post.content }}
      </p>
      <span class="border-t px-4 py-2">
        By {{ `${user.lastname} ${user.firstname}` }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PostDTO, UserDTO } from "@/utils/types.ts";
import { useClientApi } from "@/utils/api.ts";
import { ref } from "vue";
import { useRelativeTime } from "../utils/method.ts";

const props = defineProps<{
  post: PostDTO;
}>();

const user = ref<UserDTO>();
const api = useClientApi();

const isLoading = ref<boolean>(true);

api.getUserById(props.post.userId).then((response) => {
  if (response.data) user.value = response.data;
  isLoading.value = false;
});
</script>
