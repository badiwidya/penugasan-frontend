<template>
    <main class="min-h-screen bg-base flex justify-center items-center">
        <div class="bg-surface rounded-md p-8 shadow-overlay flex flex-col max-w-120">
            <h1 class="text-2xl font-semibold text-mauve mb-4 text-center">Penugasan PI 61</h1>
            <p class="text-text text-wrap text-justify mb-4">Sebuah dashboard sederhana yang dibuat untuk mengelola penugasan Pekan Ilkomerz 61.</p>
            <button @click="login" class="bg-green hover:-translate-y-0.5 flex gap-3 justify-center items-center text-surface py-2 rounded-md font-bold cursor-pointer transition-all duration-300"><i class="pi pi-google font-bold"></i>Masuk Dengan Google</button>
        </div>
    </main>
</template>

<script setup>
    function login() {
        window.location.href = 'http://localhost:3000/auth/google'
    }
</script>