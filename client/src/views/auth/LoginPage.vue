<template>
  <div
    v-if="isLoginSucceed"
    role="alert"
    class="flex flex-col items-center gap-4 py-10 font-medium"
  >
    <div class="size-fit rounded-full bg-green-50 p-2">
      <IconSuccess />
    </div>
    <span class="flex items-center gap-1">
      Operation
      <span class="text-green-500">succeed</span>
    </span>
  </div>
  <div v-else class="m-auto w-[90%] max-w-md space-y-4 pt-10">
    <p class="text-xl font-bold">Welcome it's a pleasure to see you again</p>
    <form class="flex flex-col gap-2" @submit.prevent="doLogin">
      <TextField
        v-model="credential.email"
        :errors="v$.email.$errors"
        label="Enter your email"
        name="email"
      />
      <TextField
        v-model="credential.password"
        :errors="v$.password.$errors"
        label="Enter your password"
        name="password"
      />
      <ButtonComponent data-test="login-button" type="submit" class="mt-4 p-4" :isLoading="isLoading">
        Login
      </ButtonComponent>
    </form>
    <div class="flex gap-2 text-sm">
      <span>You don't yet have account</span>
      <RouterLink
        to="/auth/register"
        class="font-bold text-blue-500 underline underline-offset-4"
      >
        register
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

import { useClientApi } from "@/utils/api.ts";

import TextField from "@/components/TextField.vue";
import IconSuccess from "@/components/icons/IconSuccess.vue";
import ButtonComponent from '@/components/ButtonComponent.vue'

const api = useClientApi();
const router = useRouter();

const isLoading = ref<boolean>(false);
const isLoginSucceed = ref<boolean>(false);
const errorMessage = ref<string | unknown>(undefined);
const credential = ref({
  email: "",
  password: "",
});

const v$ = useVuelidate(
  {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  credential,
);

const doLogin = async () => {
  const canProcess = await v$.value.$validate();
  if (!canProcess) return;

  isLoading.value = true;
  const { error } = await api.login(credential.value);
  if (error) {
    isLoading.value = false;
    errorMessage.value = error;
    return;
  }
  isLoading.value = false;
  isLoginSucceed.value = true;
  const timeout = setTimeout(async () => {
    clearTimeout(timeout);
    await router.push("/");
  }, 2000);
};
</script>
