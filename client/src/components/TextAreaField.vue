<script setup lang="ts">
import type { ErrorObject } from "@vuelidate/core";
import { computed } from "vue";

const model = defineModel<string>();
const props = defineProps<{
  name: string;
  label?: string;
  className?: string;
  readonly?: boolean;
  placeholder?: string;
  errors?: ErrorObject[];
}>();

const formControl = computed<string>(() => {
  const base = "resize-none rounded-md border p-2 outline-none placeholder:text-xs";
  let appearance = "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none";
  if (props.errors && props.errors.length) {
    appearance = "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300 focus:outline-none"
  }

  return base+" "+appearance;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="name">{{ label }}</label>
    <textarea
      :id="name"
      v-model="model"
      type="text"
      :name="name"
      :readonly="readonly"
      :placeholder="placeholder"
      :data-test="`input-${name}`"
      :class="[formControl, className]"
    />
    <div :data-test="`error-${name}`" class="flex flex-col gap-0.5 text-sm text-red-500">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>
