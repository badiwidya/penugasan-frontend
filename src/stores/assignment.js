import api from '@/services/api.js'
import { defineStore } from 'pinia'

export const useAssignmentsStore = defineStore('assignments', {
    state: () => {
        return {
            pair: [{
                courseId: null,
                assignments: [{
                    courseWorkType: null,
                    courseWorkId: null,
                    courseWorkName: null,
                }]
            }],
            assignments: {
                individu: [],
                proxy: [],
                angkatan: [],
            }
        }
    },

    actions: {

    }
})