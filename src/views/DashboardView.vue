<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import api from '@/services/api.js'
import Toast from '@/components/Toast.vue'
import Loading from '@/components/Loading.vue'
import { useCoursesStore } from '@/stores/course.js'

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

const loading = ref(true)

const courses = useCoursesStore()

const getCoursesData = async () => {
    try {
        await courses.getData()
        triggerToast('Berhasil mengambil data kelas')
    } catch (error) {
        triggerToast('Terjadi kesalahan saat mengambil data kelas', 'error')
    } finally {
        loading.value = false
    }
}

const showModal = ref(false)

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        triggerToast('Enrollment code berhasil disalin', 'success')
    } catch (error) {
        triggerToast('Enrollment code gagal disalin', 'error')
    }
}

const teachers = ref([])
const students = ref([])

const openModal = async (id) => {
    showModal.value = true
    const course = await courses.courses.find((c) => c.id === id)
    if (course) {
        teachers.value = course.teachers
        students.value = course.students
    }
}

const closeModal = () => {
    showModal.value = false
    teachers.value = []
    students.value = []
}

const forceFetchData = async () => {
    loading.value = true
    try {
        await courses.forceFetch()
        triggerToast('Berhasil mengambil ulang data kelas')
    } catch (error) {
        triggerToast('Gagal mengambil ulang data kelas')
        console.log(error?.message)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await getCoursesData()
})

</script>

<style scoped>
</style>

<template>

    <DashboardLayout>
        <div class="bg-base flex justify-between mt-6 mx-6 text-text text-3xl font-bold">
            <h1>Daftar Proxy</h1>
            <i @click="forceFetchData" class="pi pi-refresh cursor-pointer hover:animate-spin"></i>
        </div>
        <Loading v-if="loading" class-tambahan="text-xl font-semibold"/>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            <div v-for="course in courses.courses" :key="course.id"
                class="min-h-[200px] bg-surface rounded-lg hover:scale-104 shadow-md overflow-hidden flex flex-col transition duration-300">
                <div class="p-4 bg-surface">
                    <h3 class="text-lg text-center font-medium text-text">{{ course.name }}</h3>
                    <p class="text-sm text-center text-subtext">{{ course.id }}</p>
                </div>
                <div class="p-4 flex-grow flex-col">
                    <div class="mb-2">
                        <p class="text-center text-text">Enrollment Code</p>
                        <p @click="copyText(course.enrollmentCode)"
                            class="text-subtext hover:scale-105 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2">
                            {{ course.enrollmentCode }}
                            <i class="pi pi-clipboard"></i>
                        </p>
                    </div>
                    <a :href="course.alternateLink"
                        class="block bg-mauve py-1 font-semibold text-base rounded-md hover:-translate-y-0.5 transition-all duration-300 text-center mb-2">Lihat
                        di Classroom</a>
                    <button @click="openModal(course.id)"
                        class="w-full bg-green py-1 font-semibold text-surface rounded-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center">Lihat
                        Anggota</button>
                </div>
            </div>
        </div>
        <Toast :show="showToast" :message="toastMessage" :type="toastType" :duration="3000" @close="closeToast" />
        <transition enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showModal" @click.self="closeModal"
                class="modal-overlay fixed inset-0 bg-overlay/70 flex items-center justify-center z-50 transition-opacity">
                <div
                    class="modal-container bg-base w-xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto transition-all transform scale-95">
                    <div class="modal-content py-4 px-6">
                        <!-- Header -->
                        <div class="flex items-center justify-between pb-3">
                            <h3 class="text-xl font-medium text-text">Anggota Kelas</h3>
                            <button @click="closeModal" class="modal-close p-1 rounded-full text-subtext">
                                <span class="text-subtext0 hover:text-text">&times;</span>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="my-4 h-[400px] overflow-y-auto">
                            <div class="text-text">
                                <div class="flex flex-col mb-4">
                                    <h2 class="border-b border-surface text-lg mb-3">Guru</h2>
                                    <div v-for="teacher in teachers" class="flex gap-2 items-center mb-2">
                                        <img :src="teacher.profile.photoUrl ? `http://localhost:3000/api/get-image?url=https:${encodeURIComponent(teacher.profile.photoUrl)}` : 'https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg'" :alt="teacher.profile.name.fullName + '\'s profile picture'" class="w-8 h-8 rounded-full border-1 border-overlay" loading="lazy">
                                        {{ teacher.profile.name.fullName }}
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <h2 class="border-b border-surface text-lg mb-3">Murid</h2>
                                    <div v-for="student in students" class="flex gap-2 items-center mb-2">
                                        <img :src="student.profile.photoUrl ? 'https:' + student.profile.photoUrl : 'https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg'" :alt="student.profile.name.fullName + '\'s profile picture'" class="w-8 h-8 rounded-full border-1 border-overlay">
                                        {{ student.profile.name.fullName }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </DashboardLayout>

</template>