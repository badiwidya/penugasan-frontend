import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuth } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Login Page - PI 61',
      },
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      meta: {
        title: 'Dashboard - PI 61',
      },
      component: DashboardView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = useAuth().authenticated

  const defaultTitle = 'Pekan Ilkomerz 61'
  document.title = to.meta.title || defaultTitle

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
