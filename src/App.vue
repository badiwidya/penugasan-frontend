<script setup>
import { RouterView } from 'vue-router'
import { useAuth } from './stores/auth';
import { onMounted } from 'vue';

onMounted(async () => {
  await useAuth().checkAuth()
})

</script>

<template>
  <RouterView />
</template>