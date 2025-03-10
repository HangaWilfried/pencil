<script setup lang="ts">
const model = defineModel<string>();
defineProps<{
  name: string;
  label?: string;
  readonly?: boolean;
  placeholder?: string;
}>();
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
      class="resize-none rounded-md border p-2 outline-none placeholder:text-xs border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      :placeholder="placeholder"
      :data-test="`input-${name}`"
    />
  </div>
</template>
