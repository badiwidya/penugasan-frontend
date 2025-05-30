<script setup>
import router from '@/router'
import api from '@/services/api.js'
import { RouterLink } from 'vue-router'

const logout = async () => {
    try {
        const res = await api.post('/auth/logout')
        console.log(res.data)
        router.push('/')
    } catch (error) {
        console.log('Gagal keluar', error?.message)
    }
}
</script>

<template>
    <aside class="bg-crust min-h-full w-82 flex flex-col p-8 top-0 left-0">
        <div class="max-h-screen fixed w-52 h-screen">
            <h1 class="font-bold text-mauve mb-4 text-2xl">Dashboard</h1>
            <nav class="w-full flex flex-col justify-between max-h-screen">
                <div class="w-full flex flex-col gap-1">
                    <RouterLink to="/dashboard" :class="{ 'bg-surface': $route.path === '/dashboard' }" class="pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Beranda</RouterLink>
                    <RouterLink to="/assignments" :class="{ 'bg-surface': $route.path === '/assignments' }" class="pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Tugas</RouterLink>
                    <RouterLink to="/materials" :class="{ 'bg-surface': $route.path === '/materials' }" class="pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Materi</RouterLink>
                </div>
                <button @click="logout" class="text-left pl-4 py-2 text-text font-semibold rounded-md hover:bg-surface">Logout</button>
            </nav>
        </div>
    </aside>
</template>
