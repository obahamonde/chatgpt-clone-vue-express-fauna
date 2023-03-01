<script setup lang="ts">

import { useAuth0 } from '@auth0/auth0-vue';

const { state } = useStore();

const { user } = useAuth0();


</script>
<template>
<VContainer 
    class="col gap-4"
    >
    <VCard v-for="msg in state.messages"
    :key="msg"
    :class="msg.sender === 'user' ? 'col start' : 'col end'"
    >
    <div row center gap-2 mx-2>
    <div col center gap-1 v-if="msg.sender==='user'">
    <img  :src="user.picture" class="rf cp x2 sh" />
    <p class="text-caption" v-text="msg.time" />
</div>
<VCardText v-text="msg.text" w-full />
<div v-if="msg.sender==='bot'" col center gap-1>
<img  src="/logo.svg" class="rf cp x2 sh" />
<p class="text-caption" v-text="msg.time" />
</div>
</div>    
    </VCard>
</VContainer>
</template>