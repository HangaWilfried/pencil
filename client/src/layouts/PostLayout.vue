<template>
  <div>
    <header>
      <h1>Pencil</h1>
      <div class="flex items-center justify-between">
        <input type="text" />
        <div class="flex items-center gap-2">
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
          <template v-else>
            <RouterLink to="/auth/register"> Create account </RouterLink>
            <RouterLink to="/auth/login"> Login </RouterLink>
          </template>
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useToken } from "@/utils/api.ts";
import ViewMoreAction from "@/components/ViewMoreAction.vue";

const session = useToken();
</script>
