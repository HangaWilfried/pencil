<template>
  <div
    class="space-y-4 rounded-lg border bg-white py-1 hover:shadow"
  >
    <div class="flex gap-2 items-center">
      <div class="flex flex-col gap-1">
        <h2>{{ post.title }}</h2>
        <span>{{ post.content }}</span>
      </div>
      <div class="size-8 shrink-0 rounded-lg">
        <img
          :src="primaryImage"
          alt="picture"
        />
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <span>{{ useRelativeTime(post.createdAt) }}</span>
      <span>By {{ user }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { useClientApi } from "@/utils/api.ts";
import type { PostDTO } from "@/utils/types.ts";
import { useRelativeTime } from "../utils/method.ts";

const api = useClientApi();
const props = defineProps<{ post: PostDTO }>();

const isLoading = ref(false);
const user = ref<string>("");
const primaryImage = ref<string>("");

const fetchUserData = async () => {
  const {data} = await api.getUserById(props.post.userId);
  if( data) user.value = data.lastname + " " + data.firstname;
}

const fetchPrimaryImage = async () => {
  const {data} = await api.getFileById(props.post.medias[0]);
  if(data) primaryImage.value = data;
}

onBeforeMount(async () => {
  isLoading.value = true;
  await Promise.all([fetchPrimaryImage(), fetchUserData()]);
  isLoading.value = false;
})

api.getUserById(props.post.userId).then((response) => {
  const { data } = response;
  if (data) user.value = data.lastname + " " + data.firstname;
  isLoading.value = false;
});
</script>
