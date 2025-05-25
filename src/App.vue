<script setup>
import { RouterView } from 'vue-router'
import { useAuth } from './stores/auth';
import { onMounted, computed } from 'vue';

const auth = useAuth()

onMounted(async () => {
  await auth.checkAuth()
})

const isLoading = computed(() => auth.loading)

</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-base z-50">
    <div class="flex items-center justify-center gap-2 font-semibold text-text">
      <i class="pi pi-spin pi-spinner font-semibold"></i> Loading...
    </div>
  </div>
  <RouterView v-else/>
</template>