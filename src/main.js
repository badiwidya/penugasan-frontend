import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuth } from './stores/auth.js'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuth()

auth.checkAuth().then(() => {
    app.use(router)
    
    app.mount('#app')
})

