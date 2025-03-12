<template>
  <div>
    <header class="flex items-center justify-between bg-gray-100 p-4">
      <div class="pl-8"><LogoComponent /></div>
      <div class="flex items-center gap-2 place-self-end">
        <HeaderMenu :user="user" />
        <RouterLink
          to="/auth/login"
          data-test="startBtn"
          class="rounded bg-blue-500 px-2 py-1.5 text-white"
        >
          <span>Get started</span>
        </RouterLink>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useToken } from "@/utils/api.ts";

import HeaderMenu from "@/components/HeaderMenu.vue";
import LogoComponent from "@/components/LogoComponent.vue";

const session = useToken();
const user = session.info();
</script>
