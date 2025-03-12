<template>
  <div class="space-y-4 rounded-lg border bg-white p-4 shadow">
    <div class="flex gap-2">
      <div class="flex flex-col gap-1">
        <h2 class="font-semibold">{{ post.title }}</h2>
        <span class="text-sm">{{ post.content }}</span>
      </div>
      <div class="size-20 shrink-0 rounded-lg border">
        <img :src="primaryImage" alt="picture" class="size-full rounded-lg object-cover" />
      </div>
    </div>
    <div class="flex items-center gap-0.5 text-xs">
      <span>{{ useRelativeTime(post.createdAt) }}</span>
      <span class="font-medium">by {{ user }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { useClientApi } from "@/utils/api.ts";
import type { PostDTO } from "@/utils/types.ts";
import { useRelativeTime } from "../utils/date.ts";

const api = useClientApi();
const props = defineProps<{ post: PostDTO }>();

const isLoading = ref(false);
const user = ref<string>("");
const primaryImage = ref<string>("");

const fetchUserData = async () => {
  const { data } = await api.getUserById(props.post.userId);
  if (data) user.value = data.lastname + " " + data.firstname;
};

const fetchPrimaryImage = async () => {
  const { data } = await api.getFileById(props.post.medias[0]);
  if (data) primaryImage.value = data;
};

onBeforeMount(async () => {
  isLoading.value = true;
  await Promise.all([fetchPrimaryImage(), fetchUserData()]);
  isLoading.value = false;
});

api.getUserById(props.post.userId).then((response) => {
  const { data } = response;
  if (data) user.value = data.lastname + " " + data.firstname;
  isLoading.value = false;
});
</script>
