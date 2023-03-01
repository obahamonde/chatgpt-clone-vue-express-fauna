<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
const { isAuthenticated, loginWithRedirect } = useAuth0();
</script>
<template>
  <div v-if="isAuthenticated">
  <VApp app>
    <RouterView />
  </VApp>
  </div>
  <div v-else col center p-12 gap-8>
    <h1 text-title>Please Login</h1>
    <button btn-post @click="loginWithRedirect()">Login</button>
  </div>
</template>