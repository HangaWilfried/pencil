<script setup lang="ts">
import { PlusCircleIcon } from "@heroicons/vue/24/solid"
import ImageComponent from '@/components/ImageComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

withDefaults(
  defineProps<{
    message: string;
    handleAddButtonClicked?: VoidFunction;
  }>(), {
    message: "No Post has been added for now."
  })
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center pt-20">
    <ImageComponent class="size-[150px]" path="folder.png" />
    <div class="text-sm flex flex-col gap-2 items-center font-bold">
      <span>{{ message }}</span>
      <ButtonComponent v-if="handleAddButtonClicked" class="p-1" @click="handleAddButtonClicked">
        <span>Add</span>
        <PlusCircleIcon class="size-5" />
      </ButtonComponent>
    </div>
  </div>
</template>
