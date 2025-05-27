import api from '@/services/api.js'
import { defineStore } from 'pinia'

export const useAssignmentsStore = defineStore('assignments', {
    state: () => {
        return {
            pairIds: [],
            assignments: {}
        }
    },
    persist: true,

    actions: {
        async getData() {
            if (this.pairIds.length === 0) return
            this.forceFetch()
        },

        async forceFetch() {
            try {
                const [assignmentsRes, topicsRes] = await Promise.all([
                    api.get('/api/assignments'),
                    api.get('/api/topics')
                ])

                const assignments = {}

                topicsRes.data.data.forEach(topic => {
                    if (!(topic in assignments)) {
                        assignments[topic.name] = []
                    }
                })

                const mappedData = Promise.all(assignmentsRes.data.data.map(async (t) => {

                    const assignmentsForPairIds = t.assignments.map((a) => {

                        const topicName = topicsRes.data.data.find((topic) => topic.id === a.topicId).name

                        assignments[topicName].push(a)
                        
                        return {
                            type: a.topicId,
                            name: a.title,
                            id: a.id,
                            topicId: a.topicId
                        }
                    })

                    const pairIds = {
                        courseId: t.courseId,
                        assignments: assignmentsForPairIds
                    }

                    return { pairIds }
                }))

                this.pairIds = await mappedData

                this.assignments = assignments

            } catch (error) {
                console.error(error)
                throw error
            }
        }
    }
})