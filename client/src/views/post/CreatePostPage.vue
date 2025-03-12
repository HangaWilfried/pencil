<script setup lang="ts">
import { reactive, ref } from "vue";
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

const isLoading = ref(true);
const isPending = ref(true);

const tags = ref<TagDTO[]>([]);

api.getAllTags().then((response) => {
  if (response.data) tags.value = response.data;
  isLoading.value = false;
});

const post = reactive<{
  title: string;
  tags: string[];
  medias: string[];
  content: string;
}>({
  tags: [],
  title: "",
  medias: [],
  content: "",
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

const createPost = async (): Promise<void> => {
  const isFormOk = await v$.value.$validate();
  if (!isFormOk) return;

  isPending.value = true;
  await api.createPost(post);
  isPending.value = false;
};
</script>

<template>
  <form @submit.prevent="createPost" class="flex flex-col gap-4 rounded-lg bg-white p-5">
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
