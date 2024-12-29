<script setup lang="ts">
import type { ErrorObject } from "@vuelidate/core";
import { computed } from "vue";

const model = defineModel<string>();
const props = defineProps<{
  label: string;
  name: string;
  errors?: ErrorObject[];
}>();

const formControl = computed<string[]>(() => {
  const base = "rounded-md border p-2 outline-none";
  if (props.errors && props.errors.length) {
    return [
      base,
      "border-red-500 focus:border-red-300 focus:ring-2 focus:outline-none",
    ];
  }
  return [
    base,
    "border-slate-300 focus:border-blue-300 focus:ring-2 focus:outline-none",
  ];
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="name">{{ label }}</label>
    <input
      :id="name"
      v-model="model"
      type="text"
      :name="name"
      :class="formControl"
    />
    <div class="flex flex-col gap-0.5 text-sm text-red-500">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>
