<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

import { useClientApi } from "@/utils/api.ts";
import type { TagDTO } from "@/utils/types.ts";
import { toTagOption } from "@/utils/methods.ts";

import TextField from "@/components/TextField.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import DropdownComponent from "@/components/DropdownComponent.vue";
import CreateFileComponent from "@/components/CreateFileComponent.vue";

const api = useClientApi();
const props = defineProps<{
  id: string;
}>();

const isLoading = ref(true);
const isPending = ref(true);

const tags = ref<TagDTO[]>([]);

const post = reactive<{
  id: string;
  title: string;
  tags: string[];
  medias: string[];
  content: string;
}>({
  tags: [],
  title: "",
  medias: [],
  content: "",
  id: props.id,
});

const hasSomeTags = () => {
  return post.tags.length > 0;
};

const rules = {
  content: {
    required: helpers.withMessage("content is required", required),
  },
  title: {
    required: helpers.withMessage("title is required", required),
  },
  tags: {
    required: helpers.withMessage("select at least on tag", hasSomeTags),
  },
};

const v$ = useVuelidate(rules, post);

const editPost = async (): Promise<void> => {
  const isFormOk = await v$.value.$validate();
  if (!isFormOk) return;

  isPending.value = true;
  await api.editPost(post);
  isPending.value = false;
};

const fetchAllTags = async () => {
  const { data } = await api.getAllTags();
  if (data) {
    tags.value = data;
  }
};

const fetchPostById = async () => {
  const { data } = await api.getPostById(props.id);
  if (data) {
    post.tags = data.tags;
    post.title = data.title;
    post.medias = data.medias;
    post.content = data.content;
  }
};

onBeforeMount(async () => {
  isLoading.value = true;
  await Promise.all([fetchAllTags(), fetchPostById()]);
  isLoading.value = false;
});
</script>

<template>
  <div class="flex items-center justify-center p-10" v-if="isLoading">
    <span class="loading loading-lg loading-spinner text-black"></span>
  </div>
  <form v-else @submit.prevent="editPost" class="flex flex-col gap-4 rounded-lg bg-white p-5">
    <div class="flex gap-2">
      <div class="flex grow flex-col gap-2">
        <TextField v-model="post.title" name="title" label="Title" />
        <TextAreaField v-model="post.content" name="content" label="Description" />
        <DropdownComponent v-model="post.tags" :options="tags.map(toTagOption)" />
      </div>
      <CreateFileComponent v-model="post.medias" />
    </div>
    <ButtonComponent :is-loading="isPending" type="submit">Save</ButtonComponent>
  </form>
</template>
