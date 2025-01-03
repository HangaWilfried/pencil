<template>
  <div class="space-y-4">
    <template v-if="post">
      <ul>
        <li class="text-gray-400"><RouterLink to="/">Posts</RouterLink></li>
        <li class="font-bold text-gray-900">{{ post.title }}</li>
      </ul>
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h1 class="text-lg font-bold">{{ post.title }}</h1>
          <h2 class="flex flex-col gap-1 text-sm">
            <span v-if="isLoadingUserInfo">Loading...</span>
            <template v-else>
              <span class="font-bold">Author:</span>
              <span>{{ user?.lastname + "" + user?.firstname }}</span>
              <span>{{ user?.email }}</span>
            </template>
          </h2>
          <h5 class="text-xs">added{{ useRelativeTime(post.createdAt) }}</h5>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="post.status === 'PUBLISH'"
            class="bg-yellow-500 text-white"
            @click="draftPost"
          >
            draft
          </button>
          <button v-else class="bg-green-500 text-white" @click="publishPost">
            publish
          </button>
          <button v-else class="bg-blue-500 text-white" @click="publishPost">
            <PencilIcon class="size-4" />
            <span>Edit</span>
          </button>
          <button class="bg-red-500 text-white" @click="deletePost">
            delete
          </button>
        </div>
      </div>
      <div class="rounded-lg bg-white p-4">{{ post.content }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { useClientApi } from "@/utils/api";
import type { PostDTO, UserDTO } from "@/utils/types";
import { useRelativeTime } from "@/utils/method";
import { PencilIcon } from "@heroicons/vue/20/solid";

const api = useClientApi();
const props = defineProps<{
  id: string;
}>();

const post = ref<PostDTO>();
const user = ref<UserDTO>();

const isLoading = ref<boolean>(false);
const isLoadingUserInfo = ref<boolean>(false);

const isDraftProcessing = ref<boolean>(false);
const isDeleteProcessing = ref<boolean>(false);
const isPublishProcessing = ref<boolean>(false);

async function deletePost() {
  isDeleteProcessing.value = true;
  await api.deletePost(props.id);
  isDeleteProcessing.value = false;
}

async function draftPost() {
  isDraftProcessing.value = true;
  await api.draftPost(props.id);
  isDraftProcessing.value = false;
}

async function publishPost() {
  isPublishProcessing.value = true;
  await api.publishPost(props.id);
  isPublishProcessing.value = false;
}

async function loadPost() {
  isLoading.value = true;
  const { data: postData } = await api.getPostById(props.id);
  post.value = postData;
  isLoading.value = false;
  if (postData) {
    isLoadingUserInfo.value = true;
    const { data: userData } = await api.getUserById(postData.userId);
    user.value = userData;
  }
  isLoadingUserInfo.value = false;
}

onBeforeMount(loadPost);
</script>
