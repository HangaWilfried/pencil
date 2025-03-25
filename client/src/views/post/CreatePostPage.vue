<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

import { useClientApi } from "@/utils/api.ts";
import type { TagDTO } from "@/utils/types.ts";
import { toTagOption } from "@/utils/methods.ts";

import { toast } from "vue3-toastify";
import TextField from "@/components/TextField.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import DropdownComponent from "@/components/DropdownComponent.vue";
import CreateFileComponent from "@/components/CreateFileComponent.vue";
import { useRouter } from "vue-router";

const api = useClientApi();
const router = useRouter();

const isLoading = ref<boolean>(true);
const isPending = ref<boolean>(false);

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
  const { error, data: postId } = await api.createPost(post);
  isPending.value = false;

  if (error) toast.error("Error creating post " + error);
  else toast.success("Successfully created post");

  if (postId) {
    console.log("post id", postId);
    await router.push(`/post/${postId}/details`);
  }
};
</script>

<template>
  <form @submit.prevent="createPost" class="flex gap-4 rounded-lg bg-white p-5">
    <div class="flex grow flex-col gap-2">
      <TextField v-model="post.title" name="title" label="Title" />
      <DropdownComponent label="tags" v-model="post.tags" :options="tags.map(toTagOption)" />
      <TextAreaField class-name="h-24" v-model="post.content" name="content" label="Description" />
      <ButtonComponent class="mt-4 p-4" :is-loading="isPending" type="submit">Save</ButtonComponent>
    </div>
    <CreateFileComponent class="w-1/3" v-model="post.medias" />
  </form>
</template>
