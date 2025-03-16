<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { useClientApi } from "@/utils/api";
import { useRelativeTime } from "@/utils/date.ts";
import { type PostDTO, Theme, type UserDTO } from "@/utils/types";

import { PencilIcon } from "@heroicons/vue/20/solid";
import ImageComponent from "@/components/ImageComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

const api = useClientApi();
const props = defineProps<{
  id: string;
}>();

const post = ref<PostDTO>();
const user = ref<UserDTO>();

const isLoading = ref<boolean>(false);
const isLoadingUserInfo = ref<boolean>(false);

const isDraftPending = ref<boolean>(false);
const isDeletePending = ref<boolean>(false);
const isPublishPending = ref<boolean>(false);

async function deletePost() {
  isDeletePending.value = true;
  await api.deletePost(props.id);
  isDeletePending.value = false;
}

async function draftPost() {
  isDraftPending.value = true;
  await api.draftPost(props.id);
  isDraftPending.value = false;
}

async function publishPost() {
  isPublishPending.value = true;
  await api.publishPost(props.id);
  isPublishPending.value = false;
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
            <span v-if="isLoadingUserInfo" class="loading loading-lg loading-spinner"></span>
            <template v-else>
              <span class="font-bold">Author:</span>
              <span>{{ user?.lastname + "" + user?.firstname }}</span>
              <span>{{ user?.email }}</span>
            </template>
          </h2>
          <h5 class="text-xs">added{{ useRelativeTime(post.createdAt) }}</h5>
        </div>
        <div class="flex items-center gap-2">
          <ButtonComponent
            :is-loading="isPublishPending"
            v-if="post.status === 'PUBLISH'"
            :theme="Theme.Yellow"
            @click="draftPost"
          >
            draft
          </ButtonComponent>
          <ButtonComponent
            :is-loading="isPublishPending"
            v-else
            :theme="Theme.Green"
            @click="publishPost"
          >
            publish
          </ButtonComponent>
          <RouterLink :to="`/post/${post.id}/edit`">
            <ButtonComponent :theme="Theme.Blue">
              <PencilIcon class="size-4" />
              <span>Edit</span>
            </ButtonComponent>
          </RouterLink>
          <ButtonComponent :is-loading="isDeletePending" @click="deletePost" :theme="Theme.Red"
            >delete</ButtonComponent
          >
        </div>
      </div>
      <div class="rounded-lg bg-white p-4">{{ post.content }}</div>
      <div
        v-if="post.medias && post.medias.length"
        :style="{ gridTemplateColumns: `repeat(${post.medias.length}, minmax(0, 1fr))` }"
      >
        <ImageComponent v-for="media in post.medias" :key="media" :is-local="false" :path="media" />
      </div>
    </template>
  </div>
</template>
