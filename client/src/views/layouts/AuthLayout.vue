<template>
  <div class="p-10">
    <div class="flex justify-center">
      <LogoComponent />
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import LogoComponent from "@/components/LogoComponent.vue";
</script>
