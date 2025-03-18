<script setup lang="ts">
import { ref } from "vue";
import type { DropdownOption } from "@/utils/types.ts";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  isLoading?: boolean;
  label: string;
  options: Array<DropdownOption<unknown>>;
  defaultValues?: Array<DropdownOption<unknown>>;
}>();

const model = defineModel<Array<unknown>>();
const selectedOptions = ref<Array<DropdownOption<unknown>>>(props.defaultValues ?? []);

const handleOptionsChange = (option: DropdownOption<unknown>): void => {
  if (isSelected(option)) {
    selectedOptions.value = selectedOptions.value.filter((it) => it.getText() !== option.getText());
  } else {
    selectedOptions.value.push(option);
  }
  model.value = selectedOptions.value.map((it: DropdownOption<unknown>) => it.getValue());
};

const isSelected = (option: DropdownOption<unknown>): boolean => {
  return selectedOptions.value.some((it) => it.getText() === option.getText());
};

const show = ref<boolean>(false);
</script>

<template>
  <section class="flex flex-col gap-2">
    <span>{{ label }}</span>
    <div
      tabindex="0"
      @mousedown="show = true"
      @mouseleave="show = false"
      class="relative w-full rounded-md border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-300"
    >
      <div class="flex items-center justify-between p-2">
        <div class="flex flex-wrap gap-x-2">
          <span
            class="rounded-lg border px-1"
            v-for="option in selectedOptions"
            :key="option.getText()"
          >
            {{ option.getText() }}
          </span>
        </div>
        <span
          :class="[
            'size-auto rounded-full p-1 transition ease-linear hover:border',
            show ? 'rotate-180' : 'rotate-0',
          ]"
        >
          <ChevronDownIcon class="size-5" />
        </span>
      </div>
      <div
        v-if="show"
        class="absolute right-0 z-20 w-full rounded-lg border border-slate-300 bg-white p-2 shadow-lg"
      >
        <div v-if="isLoading" class="flex items-center gap-2">
          <span class="loading-xs loading-spinner text-blue-300"></span>
          <span>Loading</span>
        </div>
        <div class="space-y-2" v-else>
          <label
            :key="option.getText()"
            :for="option.getText()"
            v-for="option in options"
            class="flex items-center gap-2 rounded p-2 text-gray-900 hover:bg-blue-50 has-checked:bg-blue-50"
          >
            <input
              type="checkbox"
              :id="option.getText()"
              :value="option.getValue()"
              :checked="isSelected(option)"
              @change="handleOptionsChange(option)"
              class="size-4 rounded-lg border"
            />
            <span>{{ option.getText() }}</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>
