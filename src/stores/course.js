import api from '@/services/api'
import { defineStore } from 'pinia'

// Data course harusnya ngga akan berubah, kan ngga mungkin Proxy nambah tiba tiba.

export const useCoursesStore = defineStore('courses', {
    state: () => {
        return {
            courses: [],
        }
    },
    persist: true,

    actions: {
        async getData() {
            if (this.courses.length !== 0) {
                return
            }
            await this.forceFetch()
        },

        async forceFetch() {
            try {
                const response = await api.get('/api/courses')

                this.courses = response.data.data
            } catch (error) {
                console.log('Terjadi kesalahan saat fetch ulang data kelas:', error?.message)
                throw error
            }
        }
    }

})