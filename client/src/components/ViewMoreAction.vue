<template>
  <Menu as="div" class="relative">
    <MenuButton class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
      <slot></slot>
      <ChevronDownIcon class="size-6 text-gray-400" aria-hidden="true" />
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems v-if="$slots.submenus" class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
        <slot name="submenus"></slot>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
</script>
