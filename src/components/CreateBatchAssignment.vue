<script setup>
import { ref } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['close'])

const closeModal = () => {
    emits('close')
}

</script>

<template>
    <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div
            @click.self="closeModal"
            v-if="show"
            class="modal-overlay fixed inset-0 bg-overlay/70 flex items-center justify-center z-50 transition-opacity">
            <div
                class="modal-container bg-base w-xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto transition-all transform scale-95">
                <div class="modal-content py-4 px-6">
                    <!-- Header -->
                    <div class="flex items-center justify-between pb-3">
                        <h3 class="text-xl font-medium text-text">Buat Tugas Baru</h3>
                        <button @click="closeModal" class="modal-close p-1 rounded-full text-subtext">
                            <span class="text-subtext0 hover:text-text">&times;</span>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="my-4 h-[400px] overflow-y-auto">
                       

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>