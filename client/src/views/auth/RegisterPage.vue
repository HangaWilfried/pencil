<template>
  <div
    v-if="isCreationSucceed"
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
    <span class="text-xl font-bold">
      Welcome it's a pleasure have you among us.
    </span>
    <form class="flex flex-col gap-2" @submit.prevent="doRegister">
      <TextField
        v-model="user.lastname"
        :errors="v$.lastname.$errors"
        label="Enter your lastname"
        name="lastname"
      />
      <TextField
        v-model="user.firstname"
        label="Enter your firstname"
        name="firstname"
      />
      <TextField
        v-model="user.email"
        :errors="v$.email.$errors"
        label="Enter your email"
        name="email"
      />
      <TextField
        v-model="user.password"
        :errors="v$.password.$errors"
        label="Enter your password"
        name="password"
      />
      <button
        :disabled="isLoading"
        type="submit"
        class="mt-4 bg-blue-500 text-white"
      >
        {{ isLoading ? "in progress..." : "Register" }}
      </button>
    </form>
    <div class="flex gap-2 text-sm">
      <span>Do you already have account</span>
      <RouterLink
        to="/auth/login"
        class="font-bold text-blue-500 underline underline-offset-4"
      >
        login
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import { useClientApi } from "@/utils/api.ts";
import TextField from "@/components/TextField.vue";
import IconSuccess from "@/components/icons/IconSuccess.vue";

const api = useClientApi();
const router = useRouter();

const isLoading = ref<boolean>(false);
const isCreationSucceed = ref<boolean>(false);

const errorMessage = ref<string | unknown>(undefined);
const user = ref({
  email: "",
  password: "",
  lastname: "",
  firstname: "",
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
    lastname: {
      required,
    },
  },
  user,
);

const doRegister = async () => {
  const canProcess = await v$.value.$validate();
  if (!canProcess) return;

  isLoading.value = true;
  const { error } = await api.createAccount(user.value);
  if (error) {
    isLoading.value = false;
    errorMessage.value = error;
    return;
  }
  isLoading.value = false;
  isCreationSucceed.value = true;
  const timeout = setTimeout(async () => {
    clearTimeout(timeout);
    await router.push("/auth/login");
  }, 2000);
};
</script>
