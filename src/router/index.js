import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import { useAuth } from "@/stores/auth.js";
import AssignmentsView from "@/views/AssignmentsView.vue";
import MaterialsView from "@/views/MaterialsView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            meta: {
                requiresAuth: true,
            },
            redirect: "/dashboard",
        },
        {
            path: "/login",
            name: "login",
            meta: {
                title: "Login Page - PI 61",
            },
            component: LoginView,
        },
        {
            path: "/dashboard",
            name: "Dashboard",
            meta: {
                title: "Dashboard - PI 61",
                requiresAuth: true,
            },
            component: DashboardView,
        },
        {
            path: "/assignments",
            name: "Assignment",
            meta: {
                title: "Tugas - PI 61",
                requiresAuth: true,
            },
            component: AssignmentsView,
        },
        {
            path: "/materials",
            name: "Materials",
            meta: {
                title: "Materi - PI 61",
                requiresAuth: true,
            },
            component: MaterialsView,
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const isLoggedIn = useAuth().authenticated;

    const defaultTitle = "Pekan Ilkomerz 61";
    document.title = to.meta.title || defaultTitle;

    if (to.meta.requiresAuth && !isLoggedIn) {
        next("/login");
    } else if (to.path === "/login" && isLoggedIn) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router;
