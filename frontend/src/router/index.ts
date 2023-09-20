import { createRouter, createWebHistory } from "vue-router";
// import SiteAdminRoutes from "@/modules/admin/routes/routes"
// import LandingRoutes from "@/modules/home/views/Landing.vue"
const routes = [
  {
    path: "/:catchAll(.*)",
    component: () => import("@/components/notfound/NotFound.vue"),
  },
  {
    path: "/",
    name: "Landing",
    component: () => import("@/modules/home/views/Landing.vue"),
  },
  {
    path: "/admin-portal",
    name: "SiteAdmin",
    component: () => import("@/modules/admin/views/SiteAdmin.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
  routes,
})

export default router;
