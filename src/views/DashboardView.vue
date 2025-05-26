<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import api from '@/services/api.js'
import Toast from '@/components/Toast.vue'

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('info')

const triggerToast = (message, type = 'info') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const closeToast = () => {
    showToast.value = false
}

const coursesData = ref([])
const loading = ref(true)

const fetchCoursesData = async () => {
    loading.value = true
    try {
        const res = await api.get('/api/courses')
        coursesData.value = res.data.data

        console.log(coursesData.value)

        triggerToast(`Berhasil mengambil data ${coursesData.value.length} kelas`, 'success')
    } catch (error) {
        console.log(`Terjadi kesalahan saat mengambil data: ${error.message}`)
        triggerToast(`Gagal mengambil data kelas`, 'error')
    } finally {
        loading.value = false
    }

}

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        triggerToast('Enrollment code berhasil disalin', 'success')
    } catch (error) {
        triggerToast('Enrollment code gagal disalin', 'error')
    }
}

onMounted(async () => {
    await fetchCoursesData()
})

</script>

<template>

    <DashboardLayout>
        <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="text-xl font-semibold text-text">
                <i class="pi pi-spin pi-spinner"></i>
                Mengambil data...
            </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            <div v-for="course in coursesData" :key="course.id"
                class="min-h-[200px] bg-surface rounded-lg hover:scale-104 shadow-md overflow-hidden flex flex-col transition duration-300">
                <div class="p-4 bg-surface">
                    <h3 class="text-lg text-center font-medium text-text">{{ course.name }}</h3>
                    <p class="text-sm text-center text-subtext">{{ course.id }}</p>
                </div>
                <div class="p-4 flex-grow flex-col">
                    <div class="mb-2">
                        <p class="text-center text-text">Enrollment Code</p>
                        <p @click="copyText(course.enrollmentCode)" class="text-center text-subtext hover:scale-105 cursor-pointer transition-all duration-300">{{ course.enrollmentCode }}</p>
                    </div>
                    <a href="" class="block bg-mauve py-2 text-base rounded-md hover:-translate-y-0.5 transition-all duration-300 text-center">Lihat di Classroom</a>
                </div>
            </div>
        </div>
        <Toast
            :show="showToast"
            :message="toastMessage"
            :type="toastType"
            :duration="5000"
            @close="closeToast"
        />
    </DashboardLayout>

</template>