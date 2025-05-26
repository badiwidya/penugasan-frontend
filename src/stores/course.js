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
                const res = await api.get('/api/courses')
                const mappedData = res.data.data.map(async (course) => {
                    const teachersRes = await api.get(`/api/courses/${course.id}/teachers`)
                    const teachers = teachersRes.data.data
                    return {
                        id: course.id,
                        name: course.name,
                        enrollmentCode: course.enrollmentCode,
                        alternateLink: course.alternateLink,
                        teachers: teachers
                }

                })
                this.courses = (mappedData)
            } catch (error) {
                console.log('Terjadi kesalahan saat fetch ulang data kelas:', error?.message)
                throw error
            }
        }
    }

})