<template>
  <div>
    <header class="grid grid-cols-2 bg-gray-100 p-4">
      <div class="flex items-center gap-8 place-self-end">
        <LogoComponent />
        <input
          v-if="route.name === 'home page'"
          v-model="queryText"
          type="text"
          placeholder="search over posts..."
          class="rounded border border-slate-300 p-1 outline-none focus:border-blue-400 focus:outline-none focus:ring-2"
        />
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
          class="rounded bg-indigo-600 px-2 py-1.5 text-white"
          to="/auth/login"
        >
          Get started
        </RouterLink>
      </div>
    </header>
    <div class="p-10">
      <RouterView v-slot="{ Component }">
        <component :is="Component" :query="queryText" />
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useToken } from "@/utils/api.ts";

import ViewMoreAction from "@/components/ViewMoreAction.vue";
import LogoComponent from "@/components/LogoComponent.vue";

const route = useRoute();

const session = useToken();
const user = session.info();

const queryText = ref<string>("");
</script>
