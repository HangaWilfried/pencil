<script setup lang="ts">
import { ref } from "vue";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";

import { toast } from "vue3-toastify";
import { useClientApi } from "@/utils/api.ts";

import TextField from "@/components/TextField.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

const api = useClientApi();
const showModal = ref<boolean>(false);

const emit = defineEmits(["completed"]);

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
    toast.error("Error creating tag");
  } else {
    isLoading.value = false;
    showModal.value = false;

    emit("completed");
    toast.success("Tag created successfully.");
  }
};
</script>

<template>
  <ButtonComponent class="btn p-1" @click="showModal = true">
    <span>Add</span>
    <PlusCircleIcon class="size-5" />
  </ButtonComponent>

  <ModalWrapper @close="showModal = false" :is-closable="!isLoading" v-if="showModal">
    <form @submit.prevent="createTag" class="flex flex-col gap-3" method="dialog">
      <span class="text-xs text-red-500">{{ errorMessage }}</span>
      <TextField
        :errors="v$.name.$errors"
        name="name"
        label="Provide a name"
        v-model="tagForm.name"
      />
      <TextAreaField v-model="tagForm.description" label="Provide description" name="description" />
      <div class="flex items-stretch gap-2 py-4">
        <ButtonComponent
          @click="showModal = false"
          type="button"
          class="h-10 !bg-black"
          :disabled="isLoading"
          >cancel</ButtonComponent
        >
        <ButtonComponent class="h-10" type="submit" :is-loading="isLoading">save</ButtonComponent>
      </div>
    </form>
  </ModalWrapper>
</template>
