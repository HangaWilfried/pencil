<script setup lang="ts">
import { computed, ref } from "vue";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import type { TagDTO } from "@/utils/types.ts";
import { useClientApi, useToken } from "@/utils/api.ts";

import TextField from "@/components/TextField.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import IconInfoBulle from "@/components/icons/IconInfoBulle.vue";

const api = useClientApi();

const props = defineProps<{
  tag: TagDTO;
}>();

const tagForm = ref({
  name: "",
  description: "",
});

const v$ = useVuelidate(
  {
    name: {
      required,
    },
  },
  tagForm,
);

const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

const editTag = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  isLoading.value = true;
  const { error } = await api.editTag({
    ...props.tag,
    name: tagForm.value.name,
    description: tagForm.value.description,
  });

  if (error) {
    errorMessage.value = error;
    isLoading.value = false;
  }

  isLoading.value = false;
};

const userId = useToken().info().id;
const isCreatedByMe = computed<boolean>(() => props.tag.userId === userId);
</script>

<template>
  <tr>
    <td>{{ tag.name }}</td>
    <td>{{ tag.description }}</td>
    <td>
      <span class="flex gap-2">
        <button class="btn" onclick="tag.id.showModal()">views details</button>
        <dialog :id="tag.id" class="modal">
          <div class="modal-box">
            <div v-if="!isCreatedByMe" role="alert" class="alert alert-info text-blue-300">
              <IconInfoBulle />
              <span>New software update available.</span>
            </div>
            <div class="modal-action">
              <form @submit.prevent="editTag" class="flex flex-col gap-3" method="dialog">
                <span class="text-xs text-red-500">{{ errorMessage }}</span>
                <TextField
                  name="name"
                  label="Provide a name"
                  v-model="tagForm.name"
                  :readonly="!isCreatedByMe"
                />
                <TextAreaField
                  v-model="tagForm.description"
                  label="Provide description"
                  :readonly="!isCreatedByMe"
                  name="description"
                />
                <div v-if="isCreatedByMe" class="flex items-center gap-2 py-4">
                  <ButtonComponent class="btn" :disabled="isLoading"> cancel </ButtonComponent>
                  <ButtonComponent type="submit" :is-loading="isLoading"> save </ButtonComponent>
                </div>
              </form>
            </div>
          </div>
        </dialog>
        <button class="btn" onclick="tag.name.showModal()">views details</button>
        <dialog :id="tag.name" class="modal">
          <div class="modal-box">
            <div v-if="!isCreatedByMe" role="alert" class="alert alert-info text-blue-300">
              <IconInfoBulle />
              <span>New software update available.</span>
            </div>
            <div class="modal-action">
              <form @submit.prevent="editTag" class="flex flex-col gap-3" method="dialog">
                <span class="text-xs text-red-500">{{ errorMessage }}</span>
                <TextField
                  name="name"
                  label="Provide a name"
                  v-model="tagForm.name"
                  :readonly="!isCreatedByMe"
                />
                <TextAreaField
                  v-model="tagForm.description"
                  label="Provide description"
                  :readonly="!isCreatedByMe"
                  name="description"
                />
                <div v-if="isCreatedByMe" class="flex items-center gap-2 py-4">
                  <ButtonComponent class="btn" :disabled="isLoading"> cancel </ButtonComponent>
                  <ButtonComponent type="submit" :is-loading="isLoading"> save </ButtonComponent>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </span>
    </td>
  </tr>
</template>
