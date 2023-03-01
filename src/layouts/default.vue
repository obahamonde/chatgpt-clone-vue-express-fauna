<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
const { state } = useStore();

const title = ref("ChatGPT");

const q = ref("");

const send = async () => {
  if (!q.value.length) return;
  state.messages.push({
    text: q.value,
    sender: "user",
    time: new Date().toLocaleTimeString(),
  });
  const { data } = await useFetch(`/api/completion?q=${q.value}&sub=${user.value.sub}&tokens=64`, {
    method: "GET",
  }).text();
  q.value = "";
  
  const characters = unref(data) as string;
    state.messages.push({
    text: "",
    sender: "bot",
    time: new Date().toLocaleTimeString(),
  }); 
  for (let i = 0; i < characters.length; i++) {
    state.messages[state.messages.length - 1]["text"] += characters[i];
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

};
const { getAccessTokenSilently, user, logout } = useAuth0();

onMounted(async () => {
  const token = await getAccessTokenSilently();
  await useFetch("/api/auth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).json();
  
});

</script>
<template>
  <VAppBar app color="#008080" dark>
    <VToolbarTitle class="ml-3 mr-5 text-title text-white" v-text="title" />
  </VAppBar>
  <VMain app>
    <RouterView />
  </VMain> 
  <VFooter app
   class="row center"
  > 
    <img class="rf sh x4" :src="user.picture ? user.picture : 'https://media.istockphoto.com/id/1167753373/vector/woman-avatar-isolated-on-white-background-vector-illustration-for-your-design.jpg'" />

    <VTextField
      v-model="q"
    
      :label="user.name"
      placeholder="Ask anything to ChatGPT"
      outlined
      dense
      rounded
      class="ml-3"
      @keydown.enter="send"
    />
    <VBtn
      title="Logout"
      class="bg-red-700 ml-3 text-white scale cp"
      @click="logout()"
      icon
    >
      <VIcon>mdi-exit-run</VIcon>
    </VBtn>
</VFooter> 
</template>
