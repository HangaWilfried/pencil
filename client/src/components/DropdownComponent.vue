<script setup lang="ts">
import { ref } from "vue";
import type { DropdownOption } from "@/utils/types.ts";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  isLoading?: boolean;
  options: Array<DropdownOption<unknown>>;
  defaultValues?: Array<DropdownOption<unknown>>;
}>();

const model = defineModel<Array<unknown>>();
const selectedOptions = ref<Array<DropdownOption<unknown>>>(props.defaultValues ?? []);

const handleOptionsChange = (option: DropdownOption<unknown>): void => {
  if (isSelected(option)) {
    selectedOptions.value = selectedOptions.value.filter((it) => it.getText !== option.getText);
  } else {
    selectedOptions.value.push(option);
  }
  model.value = selectedOptions.value.map((it: DropdownOption<unknown>) => it.getValue);
};

const isSelected = (option: DropdownOption<unknown>): boolean => {
  return selectedOptions.value.some((it) => it.getText === option.getText);
};

const show = ref<boolean>(false);
</script>

<template>
  <div class="relative" tabindex="0" @blur="show = false" @focus="show = true">
    <div class="flex items-center gap-4">
      <div class="flex flex-wrap gap-2 rounded-lg border p-1"></div>
      <span class="size-auto rounded-full p-1 hover:border">
        <ChevronDownIcon class="size-5" />
      </span>
    </div>
    <div class="absolute top-2 right-0 z-20 rounded-lg bg-white p-2 shadow">
      <div v-if="isLoading" class="flex items-center gap-2">
        <span class="loading-xs loading-spinner text-blue-300"></span>
        <span>Loading</span>
      </div>
      <template v-else>
        <label
          :key="option.getText"
          :for="option.getText"
          v-for="option in options"
          class="flex items-center gap-2 rounded-lg p-1 text-gray-900 hover:bg-blue-50 has-checked:bg-blue-100"
        >
          <span class="relative size-4 rounded-lg border">
            <input
              type="checkbox"
              :id="option.getText"
              :value="option.getValue"
              :checked="isSelected(option)"
              @change="handleOptionsChange(option)"
              class="absolute inset-0 size-full rounded-lg border-none outline-none"
            />
          </span>
          <span>{{ option.getText }}</span>
        </label>
      </template>
    </div>
  </div>
</template>
