<script setup lang="ts">
import { ref, useId } from "vue";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";

import { useClientApi } from "@/utils/api.ts";

import TextField from "@/components/TextField.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

const id = useId();
const api = useClientApi();

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

const createTag = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  isLoading.value = true;
  const { error } = await api.createTag({
    name: tagForm.value.name,
    description: tagForm.value.description,
  });

  if (error) {
    errorMessage.value = error;
    isLoading.value = false;
  }

  isLoading.value = false;
};
</script>

<template>
  <ButtonComponent class="btn p-1" onclick="id.showModal()">
    <span>Add</span>
    <PlusCircleIcon class="size-5" />
  </ButtonComponent>
  <dialog :id="id" class="modal">
    <div class="modal-box">
      <div class="modal-action">
        <form @submit.prevent="createTag" class="flex flex-col gap-3" method="dialog">
          <span class="text-xs text-red-500">{{ errorMessage }}</span>
          <TextField name="name" label="Provide a name" v-model="tagForm.name" />
          <TextAreaField
            v-model="tagForm.description"
            label="Provide description"
            name="description"
          />
          <div class="flex items-center gap-2 py-4">
            <ButtonComponent class="btn" :disabled="isLoading">cancel</ButtonComponent>
            <ButtonComponent type="submit" :is-loading="isLoading">save</ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
