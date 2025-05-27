<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Loading from '@/components/Loading.vue'
import Toast from '@/components/Toast.vue'

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const triggerToast = (message, type = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const closeToast = () => {
    showToast.value = false
}

const loading = ref(false)
const Iexpanded = ref(false)
const Pexpanded = ref(false)
const Aexpanded = ref(false)

const toggleIndividu = () => {
    Iexpanded.value = !Iexpanded.value
}
const toggleProxy = () => {
    Pexpanded.value = !Pexpanded.value
}
const toggleAngkatan = () => {
    Aexpanded.value = !Aexpanded.value
}

const onEnter = (el) => {
    el.style.height = '0'
    el.style.paddingTop = '0'
    el.style.paddingBottom = '0'
    el.style.overflow = 'hidden'

    el.offsetHeight

    el.style.height = el.scrollHeight + 'px'
    el.style.paddingTop = ''
    el.style.paddingBottom = ''
}

const onAfterEnter = (el) => {
    el.style.height = 'auto'
    el.style.overflow = 'visible'
}

const onLeave = (el) => {
    el.style.height = el.scrollHeight + 'px'
    el.style.paddingTop = ''
    el.style.paddingBottom = ''
    el.style.overflow = 'hidden'

    el.offsetHeight

    el.style.height = '0'
    el.style.paddingTop = '0'
    el.style.paddingBottom = '0'
}

const onAfterLeave = (el) => {
    el.style.height = 'auto'
    el.style.paddingTop = ''
    el.style.paddingBottom = ''
    el.style.overflow = 'visible'
}


</script>


<style scoped>
.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-content {
    transform-origin: top;
}

.collapse-enter-active .collapse-content>div,
.collapse-leave-active .collapse-content>div {
    transition: opacity 0.3s ease-in-out;
}

.collapse-enter-from .collapse-content>div {
    opacity: 0;
}

.collapse-leave-to .collapse-content>div {
    opacity: 0;
}

.icon-rotate {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    font-size: 16px;
}

.icon-rotate.rotated {
    transform: rotate(-90deg);
}
</style>


<template>
    <DashboardLayout>
        <Toast :show="showToast" :message="toastMessage" :type="toastType" :duration="3000" @close="closeToast" />
        <div class="bg-base flex justify-between mt-6 mx-6 text-text text-3xl font-bold">
            <h1>Daftar Tugas</h1>
            <button
                class="flex items-center gap-2 bg-mauve px-4 py-1 font-semibold text-lg text-base cursor-pointer hover:-translate-y-0.5 transition-all duration-300 rounded-md">
                <i class="pi pi-plus"></i>
                Tambah Tugas
            </button>
        </div>
        <Loading v-if="loading" class-tambahan="text-xl font-semibold" />
        <div class="flex flex-col items-center text-text p-6">
            <div @click="toggleIndividu"
                class="flex w-full text-lg bg-mantle rounded-t-md p-4 cursor-pointer justify-between border-b-3 border-surface items-center z-50 transition-all duration-300 hover:bg-opacity-80"
                :class="{ 'rounded-b-md': !Iexpanded }">
                Penugasan Individu
                <i class="pi pi-angle-down icon-rotate" :class="{ 'rotated': Iexpanded }"></i>
            </div>
            <transition name="collapse" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
                @after-leave="onAfterLeave">
                <div v-show="Iexpanded" class="collapse-content w-full bg-surface rounded-b-md overflow-hidden">
                    <div class="px-4 pb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-gray-300">
                                    <th class="text-left p-3 font-semibold">Nama Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deskripsi Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deadline</th>
                                    <th class="text-left p-3 font-semibold">Link Tugas</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </transition>

            <div @click="toggleProxy"
                class="flex w-full text-lg bg-mantle rounded-t-md p-4 cursor-pointer justify-between border-b-3 border-surface items-center z-50 transition-all duration-300 hover:bg-opacity-80 mt-4"
                :class="{ 'rounded-b-md': !Pexpanded }">
                Penugasan Proxy
                <i class="pi pi-angle-down icon-rotate" :class="{ 'rotated': Pexpanded }"></i>
            </div>
            <transition name="collapse" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
                @after-leave="onAfterLeave">
                <div v-show="Pexpanded" class="collapse-content w-full bg-surface rounded-b-md overflow-hidden">
                    <div class="px-4 pb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-gray-300">
                                    <th class="text-left p-3 font-semibold">Nama Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deskripsi Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deadline</th>
                                    <th class="text-left p-3 font-semibold">Link Tugas</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </transition>

            <div @click="toggleAngkatan"
                class="flex w-full text-lg bg-mantle rounded-t-md p-4 cursor-pointer justify-between border-b-3 border-surface items-center z-50 transition-all duration-300 hover:bg-opacity-80 mt-4"
                :class="{ 'rounded-b-md': !Aexpanded }">
                Penugasan Angkatan
                <i class="pi pi-angle-down icon-rotate" :class="{ 'rotated': Aexpanded }"></i>
            </div>
            <transition name="collapse" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
                @after-leave="onAfterLeave">
                <div v-show="Aexpanded" class="collapse-content w-full bg-surface rounded-b-md overflow-hidden">
                    <div class="px-4 pb-4">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-gray-300">
                                    <th class="text-left p-3 font-semibold">Nama Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deskripsi Tugas</th>
                                    <th class="text-left p-3 font-semibold">Deadline</th>
                                    <th class="text-left p-3 font-semibold">Link Tugas</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </transition>

        </div>
    </DashboardLayout>
</template>