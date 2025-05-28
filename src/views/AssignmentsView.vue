<script setup>
import { ref, watch } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Loading from '@/components/Loading.vue'
import Toast from '@/components/Toast.vue'
import CreateBatchAssignment from '@/components/CreateBatchAssignment.vue'
import { useAssignmentsStore } from '@/stores/assignment'
import api from '@/services/api'

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

const showModal = ref(false)

const openModal = () => {
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const handleSuccess = (message) => {
    triggerToast(`${message} berhasil dibuat!`, 'success')
    if (message === 'Tugas') {
        closeModal()
    }
}

const handleError = (msg) => {
    triggerToast('Gagal membuat tugas, detail error ada di console', 'error')
    console.error(msg)
}

const assignment = useAssignmentsStore()

const refresh = async () => {
    loading.value = true
    try {
        await assignment.forceFetch()
        triggerToast('Tugas berhasil dimuat ulang', 'success')
    } catch (error) {
        triggerToast(`Ada error: ${error?.message}`, 'error')
    } finally {
        loading.value = false
        console.log(assignment.assignments)
    }
}


const topics = ref([])

watch(
    () => assignment.assignments,
    (newAssignment) => {
        topics.value = Object.keys(assignment.assignments).map((topic) => {
            return {
                name: topic,
                expanded: false,
                assignments: assignment.assignments[topic]
            }
        })
    },
    { immediate: true }
)

const toggleTopic = (topic) => {
    const topicSelected = topics.value.find((t) => t.name === topic)

    if (topicSelected) {
        topicSelected.expanded = !topicSelected.expanded
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

const publishLoading = ref(false)

const publishAssignment = async (name) => {
    publishLoading.value = true
    try {
        const request = Object.keys(assignment.pairIds).map((course) => ({
            courseId: course,
            courseWorkId: assignment.pairIds[course][name],
        }))

        const res = await api.post('/api/assignments/batch/publish', { assignments: request })

        if (!res.data.status) {
            throw new Error(res.data.message)
        }

        await assignment.forceFetch()

        triggerToast(`Berhasil publish tugas ${name}`, 'success')
    } catch (error) {
        console.log(error)
        triggerToast(`Gagal publish tugas ${name}`, 'error')
    } finally {
        publishLoading.value = false
    }
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
        <CreateBatchAssignment :show="showModal" @close="closeModal" @success="handleSuccess" @error="handleError">
        </CreateBatchAssignment>
        <div class="bg-base flex justify-between mt-6 mx-6 text-text text-3xl font-bold">
            <h1>Daftar Tugas</h1>
            <div class="gap-8 flex">
                <i @click="refresh" class="pi pi-refresh cursor-pointer hover:animate-spin"></i>
                <button @click="openModal"
                    class="flex items-center gap-2 bg-mauve px-4 py-1 font-semibold text-lg text-base cursor-pointer hover:-translate-y-0.5 transition-all duration-300 rounded-md">
                    <i class="pi pi-plus"></i>
                    Tambah Tugas
                </button>
            </div>
        </div>
        <Loading v-if="loading" class-tambahan="text-xl font-semibold" />
        <div v-if="topics.length > 0 && !loading" class="flex flex-col items-center text-text p-6">
            <template v-for="(topic, index) in topics" :key="topic.name">
                <div @click="toggleTopic(topic.name)"
                    class="flex w-full text-lg bg-mantle rounded-t-md p-4 cursor-pointer justify-between border-b-3 border-surface items-center transition-all duration-300 hover:bg-opacity-80"
                    :class="{ 'rounded-b-md': !topic.expanded, 'mt-4': index > 0 }">
                    {{ topic.name }}
                    <i class="pi pi-angle-down icon-rotate" :class="{ 'rotated': topic.expanded }"></i>
                </div>
                <transition name="collapse" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave"
                    @after-leave="onAfterLeave">
                    <div v-show="topic.expanded"
                        class="collapse-content w-full bg-surface rounded-b-md overflow-hidden">
                        <div class="px-4 pb-4">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="border-b border-gray-300">
                                        <th class="text-center p-3 max-w-60 w-60 font-semibold">Nama Tugas</th>
                                        <th class="text-center p-3 max-w-80 w-80 font-semibold">Deskripsi Tugas</th>
                                        <th class="text-center p-3 font-semibold">Deadline</th>
                                        <th class="text-center p-3 font-semibold">Status</th>
                                        <th class="text-center p-3 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="assignment in topic.assignments">
                                        <td class="text-center p-3 max-w-60 w-60 truncate">{{ assignment.name }}</td>
                                        <td class="text-center p-3 max-w-80 w-80 truncate" :title="assignment.description">{{ assignment.description }}
                                        </td>
                                        <td class="text-center p-3 flex flex-col items-center">{{
                                            formatDate(assignment.dueDate) }}</td>
                                        <td class="text-center p-3">
                                            <div v-if="assignment.state === 'PUBLISHED'" class="text-center text-text">
                                                Published</div>
                                            <div v-else-if="assignment.state === 'DRAFT' && !publishLoading" class="flex justify-center">
                                                <button @click="publishAssignment(assignment.name)" type="button"
                                                    class="px-2 py-1 bg-mauve rounded-md hover:-translate-y-0.5 text-base transition duration-300 text-sm">Publish
                                                    Now</button>
                                            </div>
                                            <div v-else-if="assignment.state === 'DRAFT' && publishLoading" class="flex justify-center text-text items-center gap-2">
                                                <i class="pi pi-spin pi-spinner"></i> Mohon tunggu...
                                            </div>
                                        </td>
                                        <td class="p-3 flex justify-center gap-2">
                                            <button type="button" class="text-xs p-2 bg-blue text-base rounded-md cursor-pointer hover:-translate-y-0.5 transition duration-300">
                                                <i class="pi pi-pen-to-square"></i>
                                            </button>
                                            <button type="button" class="text-xs p-2 bg-red text-base rounded-md cursor-pointer hover:-translate-y-0.5 transition duration-300">
                                                <i class="pi pi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </transition>
            </template>
        </div>
        <div v-else-if="topics.length === 0 && !loading"
            class="h-[80%] flex justify-center items-center text-text font-semibold text-2xl">
            Tidak ada data tugas...
        </div>
    </DashboardLayout>
</template>