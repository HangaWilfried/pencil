<template>
  <div>
    <header class="flex justify-between items-center bg-gray-100 p-4">
      <div class="pl-8">
        <LogoComponent />
      </div>
      <div class="flex items-center gap-2 place-self-end">
        <template v-if="session.isLoggedIn()">
          <ViewMoreAction>
            <template #default>
              <div class="flex items-center gap-2">
                <div class="rounded-md bg-blue-500 px-2 py-0.5 text-white">
                  <span>{{ user.lastname[0] }}</span>
                </div>
                <div class="text-xs">
                  <span>{{ user.lastname }} {{ user.firstname }}</span>
                </div>
              </div>
            </template>
          </ViewMoreAction>
        </template>
        <RouterLink
          v-else
          class="rounded bg-blue-500 px-2 py-1.5 text-white"
          to="/auth/login"
        >
          Get started
        </RouterLink>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useToken } from "@/utils/api.ts";

import ViewMoreAction from "@/components/ViewMoreAction.vue";
import LogoComponent from "@/components/LogoComponent.vue";

const session = useToken();
const user = session.info();
</script>
