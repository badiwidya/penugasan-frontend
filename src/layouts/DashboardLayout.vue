<script setup>
    import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
    <div class="bg-base min-h-screen flex">
        <Sidebar />
        <div class="w-full">
            <slot />
        </div>
    </div>
</template>