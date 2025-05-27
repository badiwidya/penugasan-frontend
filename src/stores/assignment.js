import api from '@/services/api.js'
import { defineStore } from 'pinia'

export const useAssignmentsStore = defineStore('assignments', {
    state: () => {
        return {
            pairIds: [{
                courseId: null,
                assignments: [{
                    type: null,
                    name: null,
                    id: null,
                }]
            }],
            assignments: {
                individu: [],
                proxy: [],
                angkatan: [],
            }
        }
    },
    persist: true,

    actions: {
        async getData() {

        },

        async forceFetch() {
            try {
                const res = await api.get('/api/assignments')
                const mappedData = Promise.all(res.data.data.map(async (t) => {

                    const assignmentsForPairIds = t.assignments.map((a) => ({
                        type: a.topicId,
                        name: a.title,
                        id: a.id
                    }))

                    const pairIds = {
                        courseId: t.courseId,
                        assignments: assignmentsForPairIds
                    }

                    return { pairIds }
                }))

                this.pairIds = await mappedData

                const assignments = res.data.data[0].map((t) => ({

                }))
            } catch (error) {
                
            }
        }
    }
})