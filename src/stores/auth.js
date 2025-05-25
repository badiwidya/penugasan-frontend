import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
    state: () => {
        return { authenticated: null }
    },

    actions: {
        async checkAuth() {
            try {
                const res = api.get('/auth/validate')
                this.authenticated = api.data.authenticated
            } catch (error) {
                this.authenticated = false
            }
        }
    }
})