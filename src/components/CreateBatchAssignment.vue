<script setup>
import { useAssignmentsStore } from '@/stores/assignment'
import { computed, onMounted, reactive, ref } from 'vue'
import api from '@/services/api.js'
import { useCoursesStore } from '@/stores/course'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['close', 'success', 'error'])

const closeModal = () => {
    emits('close')
}

const sent = () => {
    emits('success')
}

const courseIds = ref([])

const assignment = useAssignmentsStore()

const courses = useCoursesStore()

const allProxy = courses.courses.map((c) => c.id)

const form = reactive({
    selectedProxies: [],
    name: '',
    description: '',
    maxPoints: 100,
    dueDate: undefined
})

const resetForm = () => {
    form.selectedProxies = []
    form.name = ''
    form.description = ''
    form.maxPoints = 100,
    form.dueDate = undefined
}

const isAllSelected = computed(() => {
    return form.selectedProxies.length === allProxy.length
})

const toggleAll = () => {
    if (isAllSelected.value) {
        form.selectedProxies = []
    } else {
        form.selectedProxies = [...allProxy]
    }
}

const loading = ref(false)

const createAssignment = async () => {
    loading.value = true
    try {
        const assignments = form.selectedProxies.map((c) => ({
            courseId: c,
            assignment: {
                title: form.name,
                description: form.description,
                maxPoints: form.maxPoints,
                dueDate: new Date(form.dueDate).toISOString()
            }
        }))

        const res = await api.post('/api/assignments/batch', { assignments: assignments })
        resetForm()
        emits('success')
    } catch (error) {
        emits('error', { message: error?.message })
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await courses.getData()
    courses.courses.forEach((course) => {
        courseIds.value.push({
            id: course.id,
            name: course.name
        })
    })
})

</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none !important;
}
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  opacity: 0.8;
  cursor: pointer;
}
</style>

<template>
    <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div @click.self="closeModal" v-if="show"
            class="modal-overlay fixed inset-0 bg-overlay/70 flex items-center justify-center z-50 transition-opacity">
            <div
                class="modal-container bg-base w-xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto transition-all transform scale-95">
                <div class="modal-content py-4 px-6">
                    <!-- Header -->
                    <div class="flex items-center justify-between pb-3 border-b border-surface">
                        <h3 class="text-xl font-medium text-text">Buat Tugas Baru</h3>
                        <button @click="closeModal" class="modal-close p-1 rounded-full text-subtext">
                            <span class="text-subtext0 hover:text-text">&times;</span>
                        </button>
                    </div>

                    <!-- Body -->
                    <div v-if="loading" class="my-4 h-[400px] flex text-text font-semibold p-2 justify-center items-center gap-2">
                        <i class="pi pi-spin pi-spinner"></i>
                        Mohon tunggu...
                    </div>
                    <div v-else class="my-4 h-[400px] overflow-y-auto hide-scrollbar p-2">
                        <form @submit.prevent="createAssignment" class="text-text">
                            <div class="flex flex-col justify-center mb-2">
                                <span>Proxy</span>
                                <label class="flex items-center gap-2">
                                    <input type="checkbox" :checked="isAllSelected" @change="toggleAll" class="form-checkbox h-4 w-4 text-mauve accent-mauve">
                                    Pilih Semua
                                </label>
                            </div>
                            <div
                                class="w-full flex flex-col h-[150px] rounded-md border-2 p-2 border-surface overflow-y-auto mb-4">
                                <label v-for="courseId in courseIds" :key="courseId.id" class="flex items-center gap-2">
                                    <input type="checkbox" :value="courseId.id" v-model="form.selectedProxies" class="form-checkbox h-4 w-4 text-mauve accent-mauve">
                                    {{ courseId.name }}
                                </label>
                            </div>

                            <div class="w-full flex flex-col gap-2 mb-4">
                                <label class="flex flex-col">
                                    Nama Tugas
                                    <input type="text" v-model="form.name" class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md">
                                </label>
    
                                <label class="flex flex-col">
                                    Deskripsi Tugas
                                    <textarea v-model="form.description" class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 rounded-md" rows="5"></textarea>
                                </label>

                                <label class="flex flex-col">
                                    Tenggat Waktu
                                    <input type="datetime-local" v-model="form.dueDate" class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md">
                                </label>

                                <label class="flex flex-col">
                                    Nilai Maksimal
                                    <input type="number" min="0" max="100" v-model="form.maxPoints" class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md text-text">
                                </label>
                            </div>


                            <button type="submit"
                                class=" py-1 px-2 bg-mauve rounded-md cursor-pointer hover:-translate-y-0.5 transition-transform duration-300 text-base">Buat
                                Tugas</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>