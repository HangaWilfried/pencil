<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                <slot name="title"></slot>
              </DialogTitle>
              <slot></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const isOpen = ref(true);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}
</script>

<!--<script setup lang="ts">-->
<!--import { ref } from "vue";-->
<!--import { XMarkIcon } from "@heroicons/vue/24/outline";-->
<!--import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/vue";-->

<!--const props = withDefaults(defineProps<{ isClosable?: boolean }>(), {-->
<!--  isClosable: true,-->
<!--});-->
<!--const isOpen = ref<boolean>(false);-->

<!--function open() {-->
<!--  isOpen.value = true;-->
<!--}-->

<!--function close() {-->
<!--  isOpen.value = false;-->
<!--}-->

<!--function closeWhenClosable() {-->
<!--  if (props.isClosable) {-->
<!--    isOpen.value = false;-->
<!--  }-->
<!--}-->

<!--defineExpose({-->
<!--  close,-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <span @click="{ open }">{Component}</span>-->
<!--  <Dialog-->
<!--    :open="isOpen"-->
<!--    as="div"-->
<!--    class="relative z-10 focus:outline-none"-->
<!--    @close="closeWhenClosable"-->
<!--  >-->
<!--    <DialogBackdrop class="fixed inset-0 bg-black/30" />-->
<!--    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">-->
<!--      <div class="flex min-h-full items-center justify-center">-->
<!--        <DialogPanel-->
<!--          transition-->
<!--          class="relative w-full max-w-lg rounded-xl bg-white backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"-->
<!--        >-->
<!--          <div-->
<!--            v-if="isClosable"-->
<!--            class="absolute top-4 right-4 cursor-pointer"-->
<!--            @click="closeWhenClosable"-->
<!--          >-->
<!--            <XMarkIcon />-->
<!--          </div>-->
<!--          <slot />-->
<!--        </DialogPanel>-->
<!--      </div>-->
<!--    </div>-->
<!--  </Dialog>-->
<!--</template>-->
