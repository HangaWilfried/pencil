<template>
  <div>
    <header class="grid grid-cols-2 bg-gray-100 p-4">
      <div class="flex items-center gap-8 place-self-end">
        <LogoComponent />
        <input
          type="text"
          class="rounded border border-slate-300 p-1 outline-none focus:border-blue-400 focus:outline-none focus:ring-2"
        />
      </div>
      <div class="flex items-center gap-2 place-self-end">
        <template v-if="session.isLoggedIn()">
          <ViewMoreAction>
            <template #default>
              <div class="flex items-center gap-2">
                <div class="rounded-md bg-blue-500 px-2 py-0.5 text-white">
                  <span>{lastname[0]}</span>
                </div>
                <div class="flex flex-col text-xs">
                  <span>{lastname}</span>
                  <span>{firstname}</span>
                </div>
              </div>
            </template>
            <template #submenus></template>
          </ViewMoreAction>
        </template>
        <RouterLink
          v-else
          class="rounded bg-indigo-600 px-2 py-1.5 text-white"
          to="/auth/login"
        >
          Get started
        </RouterLink>
      </div>
    </header>
    <div class="p-10">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToken } from "@/utils/api.ts";
import ViewMoreAction from "@/components/ViewMoreAction.vue";
import LogoComponent from "@/components/LogoComponent.vue";

const session = useToken();
</script>
