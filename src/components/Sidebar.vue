<script setup>
    import { RouterLink } from 'vue-router'

</script>

<template>
    <aside class="bg-crust min-h-full w-82 flex flex-col p-8 top-0 left-0">
        <h1 class="font-bold text-mauve mb-4 text-2xl">Dashboard</h1>
        <nav class="w-full flex flex-col gap-1">
            <RouterLink to="/dashboard" :class="{ 'bg-surface': $route.path === '/dashboard' }" class="pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Beranda</RouterLink>
            <RouterLink to="/assignments" :class="{ 'bg-surface': $route.path === '/assignments' }" class="pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Tugas</RouterLink>
        </nav>
    </aside>
</template>
