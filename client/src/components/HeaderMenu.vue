<script setup lang="ts">
import type { JwtPayload } from "@/utils/types.ts";

defineProps<{
  user: JwtPayload;
}>();
</script>

<template>
  <div class="flex items-center gap-10">
    <div class="flex items-center gap-2">
      <RouterLink to="/" class="p-4" exact-active-class="bg-black text-white">Post</RouterLink>
      <RouterLink to="/tags" class="p-4" exact-active-class="bg-black text-white">Tag</RouterLink>
    </div>
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="cursor-pointer rounded-md bg-blue-500 px-2 py-0.5 text-white"
      >
        <span>{{ user.lastname?.[0] }}</span>
      </div>
      <ul
        tabindex="0"
        class="menu dropdown-content bg-base-200 rounded-box z-1 mt-2 w-52 p-2 text-xs shadow-sm"
      >
        <li>
          <span>{{ user.lastname }} {{ user.firstname }}</span>
        </li>
        <li>
          <span class="text-red-500 hover:bg-red-100 hover:text-red-600">deconnexion</span>
        </li>
      </ul>
    </div>
  </div>
</template>
