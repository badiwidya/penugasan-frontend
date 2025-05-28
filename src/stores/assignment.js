import api from '@/services/api.js'
import { defineStore } from 'pinia'

export const useAssignmentsStore = defineStore('assignments', {
    state: () => {
        return {
            pairIds: {},
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
                const response = await api.get('/api/assignments')

                this.pairIds = response.data.data.pairIds
                this.assignments = response.data.data.assignments
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    }
})