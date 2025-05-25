import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
    state: () => {
        return { authenticated: null, loading: false }
    },

    actions: {
        async checkAuth() {
            this.loading = true
            try {
                const res = await api.get('/auth/validate')
                this.authenticated = api.data.authenticated
            } catch (error) {
                this.authenticated = false
            } finally {
                this.loading = false
            }
        }
    }
})