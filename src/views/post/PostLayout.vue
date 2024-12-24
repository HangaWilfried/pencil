<template>
  <div>
    <header>
      <h1>Pencil</h1>
      <div class="flex items-center justify-between">
        <input type="text" />
        <div class="flex items-center gap-2">
          <template>
            <RouterLink to="/auth/register"> Create account </RouterLink>
            <RouterLink to="/auth/login"> Login </RouterLink>
          </template>
          <template>
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
                  <IconCursor />
                </div>
              </template>
              <template #submenus></template>
            </ViewMoreAction>
          </template>
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ViewMoreAction from "@/components/ViewMoreAction.vue";
</script>
