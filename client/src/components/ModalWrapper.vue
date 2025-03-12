<script setup lang="ts">
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/vue";

const props = withDefaults(defineProps<{ isClosable?: boolean }>(), {
  isClosable: true,
});
const isOpen = ref<boolean>(false);

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function closeWhenClosable() {
  if (props.isClosable) {
    isOpen.value = false;
  }
}

defineExpose({
  close,
});
</script>

<template>
  <span @click="{ open }">{Component}</span>
  <Dialog
    :open="isOpen"
    as="div"
    class="relative z-10 focus:outline-none"
    @close="closeWhenClosable"
  >
    <DialogBackdrop class="fixed inset-0 bg-black/30" />
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel transition class="panel">
          <div
            v-if="isClosable"
            class="absolute top-4 right-4 cursor-pointer"
            @click="closeWhenClosable"
          >
            <XMarkIcon />
          </div>
          <slot />
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.panel {
  @apply relative w-full max-w-lg rounded-xl bg-white backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0;
}
</style>
