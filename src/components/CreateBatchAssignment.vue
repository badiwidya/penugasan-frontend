<script setup>
import { useAssignmentsStore } from '@/stores/assignment'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
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

const courseIds = ref([])

const assignment = useAssignmentsStore()

const courses = useCoursesStore()

const allProxy = courses.courses.map((c) => c.id)

const form = reactive({
    selectedProxies: [],
    name: '',
    description: '',
    maxPoints: 100,
    dueDate: undefined,
    topic: '',
    state: 'DRAFT',
})

const resetForm = () => {
    form.selectedProxies = []
    form.name = ''
    form.description = ''
    form.maxPoints = 100,
        form.dueDate = undefined
    form.topic = '',
        form.state = 'DRAFT'
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

const errorMessage = ref('')

const createAssignment = async () => {
    loading.value = true

    const isDuplicate = Object.values(assignment.assignments).some((topic) => {
        return topic.find((t) => t.name === form.name.trim())
    })

    if (isDuplicate) {
        loading.value = false
        errorMessage.value = 'Nama tugas sudah ada'
        return
    }

    if (
        form.selectedProxies.length === 0 ||
        !form.name.trim() ||
        !form.description.trim() ||
        !form.topic.trim() ||
        !form.dueDate
    ) {
        loading.value = false
        errorMessage.value = 'Semua field wajib diisi'
        return
    }

    try {
        const assignments = form.selectedProxies.map((c) => ({
            courseId: c,
            assignment: {
                title: form.name,
                description: form.description,
                maxPoints: form.maxPoints,
                dueDate: new Date(form.dueDate).toISOString(),
                topicId: assignment.pairIds[c][form.topic],
                state: form.state
            }
        }))

        const res = await api.post('/api/assignments/batch', { assignments: assignments })
        if (!res.data.status) {
            throw new Error(res.data.message)
        }
        resetForm()

        await assignment.forceFetch()

        emits('success', 'Tugas')
    } catch (error) {
        emits('error', { message: error?.message })
    } finally {
        loading.value = false
    }
}

const topicAvailable = computed(() => Object.keys(assignment.assignments))

const showTopicCreation = ref(false)

const newTopic = ref('')

const cancelTopicCreation = () => {
    showTopicCreation.value = false
    newTopic.value = ''
}

const createTopic = async () => {
    loading.value = true

    const isDuplicate = Object.keys(assignment.assignments).some(topic => topic === newTopic.value.trim())

    console.log(isDuplicate)

    if (isDuplicate) {
        loading.value = false
        errorMessage.value = 'Nama topik sudah ada'
        return
    }

    if (!newTopic.value.trim()) {
        loading.value = false
        errorMessage.value = 'Nama topik wajib diisi'
        return
    }

    try {
        const topics = allProxy.map((proxy) => ({
            courseId: proxy,
            topic: newTopic.value
        }))

        const res = await api.post('/api/topics/batch', { topics: topics })
        if (!res.data.status) {
            throw new Error(res.data.message)
        }

        await assignment.forceFetch()

        showTopicCreation.value = false
        form.topic = newTopic.value
        newTopic.value = ''
        emits('success', 'Topic')
    } catch (error) {
        emits('error', { message: error?.message })
    } finally {
        loading.value = false
    }
}

const showDropdown = ref(false)
const dropdownRef = ref(null)

// Method untuk handle click outside
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false
    }
}

// Method untuk handle escape key
const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        showDropdown.value = false
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
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
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
                    <div v-if="loading"
                        class="my-4 h-[400px] flex text-text font-semibold p-2 justify-center items-center gap-2">
                        <i class="pi pi-spin pi-spinner"></i>
                        Mohon tunggu...
                    </div>
                    <div v-else class="my-4 h-[400px] overflow-y-auto hide-scrollbar p-2">
                        <form @submit.prevent="createAssignment" class="text-text">
                            <div class="flex flex-col justify-center mb-2">
                                <span>Proxy</span>
                                <label class="flex items-center gap-2">
                                    <input type="checkbox" :checked="isAllSelected" @change="toggleAll"
                                        class="form-checkbox h-4 w-4 text-mauve accent-mauve">
                                    Pilih Semua
                                </label>
                            </div>
                            <div
                                class="w-full flex flex-col h-[150px] rounded-md border-2 p-2 border-surface overflow-y-auto mb-4">
                                <label v-for="courseId in courseIds" :key="courseId.id" class="flex items-center gap-2">
                                    <input type="checkbox" :value="courseId.id" v-model="form.selectedProxies"
                                        class="form-checkbox h-4 w-4 text-mauve accent-mauve">
                                    {{ courseId.name }}
                                </label>
                            </div>

                            <div class="w-full flex flex-col mb-4">
                                <label class="flex flex-col mb-4">
                                    Nama Tugas
                                    <input type="text" v-model="form.name"
                                        class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md">
                                </label>

                                <label class="flex flex-col mb-4">
                                    Deskripsi Tugas
                                    <textarea v-model="form.description"
                                        class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 rounded-md"
                                        rows="5"></textarea>
                                </label>

                                <label class="flex flex-col mb-4">
                                    Tenggat Waktu
                                    <input type="datetime-local" v-model="form.dueDate"
                                        class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md">
                                </label>

                                <label>
                                    Topik Tugas
                                </label>

                                <div class="relative mb-4" ref="dropdownRef">
                                    <button type="button" @click="showDropdown = !showDropdown"
                                        class="w-full flex items-center justify-between border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md bg-base text-left cursor-pointer">
                                        <span class="text-text">{{ form.topic || 'Pilih Topik' }}</span>
                                        <i class="pi pi-chevron-down transition-transform duration-200"
                                            :class="{ '-rotate-90': showDropdown }"></i>
                                    </button>
                                    <div v-if="showDropdown"
                                        class="absolute z-10 w-full mt-1 bg-base border border-surface rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        <div v-if="topicAvailable.length === 0"
                                            class="w-full text-left px-2 py-1 text-subtext italic">
                                            Belum ada topik
                                        </div>
                                        <button type="button" v-for="topic in topicAvailable" :key="topic"
                                            @click="form.topic = topic; showDropdown = false"
                                            class="w-full text-left px-2 py-1 hover:bg-mauve hover:text-base transition-colors duration-200 text-text">
                                            {{ topic }}
                                        </button>
                                    </div>
                                </div>

                                <button type="button" v-if="!showTopicCreation"
                                    @click.stop="showTopicCreation = true"
                                    class="flex items-center justify-center cursor-pointer gap-2 py-1 bg-mauve rounded-md text-sm text-base hover:-translate-y-0.5 transition duration-300"><i
                                        class="pi pi-plus"></i> Buat Topik Baru</button>
                                <div class="flex" v-else @click.stop>
                                    <div class="flex items-center gap-1" @click.stop>
                                        <input type="text" v-model="newTopic"
                                            class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md">
                                        <button type="button" @click="createTopic"
                                            class="bg-mauve text-base cursor-pointer px-2 py-1 rounded-md hover:-translate-y-0.5 transition duration-300"><i
                                                class="pi pi-plus"></i></button>
                                        <button type="button" @click.stop="cancelTopicCreation"
                                            class="bg-subtext text-base cursor-pointer px-2 py-1 rounded-md hover:-translate-y-0.5 transition duration-300">Cancel</button>
                                    </div>
                                </div>

                                <label class="flex flex-col mt-4">
                                    Nilai Maksimal
                                    <input type="number" min="0" max="100" v-model="form.maxPoints"
                                        class="border-1 border-surface focus:outline-none focus:ring-2 focus:ring-mauve transition-all duration-300 px-2 py-1 rounded-md text-text">
                                </label>

                                <label class="flex flex-col mt-4">
                                    State
                                </label>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer p-2 border rounded-md"
                                        :class="{ 'border-mauve': form.state === 'PUBLISHED' }">
                                        <input type="radio" value="PUBLISHED" v-model="form.state" class="hidden" />
                                        <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                            :class="form.state === 'PUBLISHED' ? 'border-mauve' : 'border-subtext'">
                                            <div v-if="form.state === 'PUBLISHED'"
                                                class="w-2 h-2 bg-mauve rounded-full">
                                            </div>
                                        </div>
                                        <span class="text-sm font-medium">Published</span>
                                    </label>

                                    <label class="flex items-center gap-2 cursor-pointer p-2 border rounded-md"
                                        :class="{ 'border-mauve': form.state === 'DRAFT' }">
                                        <input type="radio" value="DRAFT" v-model="form.state" class="hidden" />
                                        <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                            :class="form.state === 'DRAFT' ? 'border-mauve' : 'border-subtext'">
                                            <div v-if="form.state === 'DRAFT'" class="w-2 h-2 bg-mauve rounded-full">
                                            </div>
                                        </div>
                                        <span class="text-sm font-medium">Draft</span>
                                    </label>
                                </div>
                            </div>

                            <div v-if="errorMessage" class="text-red-500 text-sm my-2">{{ errorMessage }}</div>


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