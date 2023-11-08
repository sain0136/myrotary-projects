import { createRouter, createWebHistory } from "vue-router";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
// import SiteAdminRoutes from "@/modules/admin/routes/routes"
// import LandingRoutes from "@/modules/home/views/Landing.vue"
const routes = [
  {
    path: "/:catchAll(.*)",
    component: () => import("@/components/notfound/NotFound.vue"),
  },
  {
    path: "/admin-login",
    name: "AdminLoginForm",
    component: () => import("@/modules/admin/views/AdminLoginForm.vue"),
  },
  // Landing Routes
  {
    path: "/",
    name: "Landing",
    component: () => import("@/modules/home/views/Landing.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/modules/home/views/LandingHome.vue"),
      },
      {
        path: "/:name?",
        name: "ProjectDetails",
        component: () =>
          import("@/modules/home/components/landinghome/ProjectDetails.vue"),
      },
      {
        path: "/about",
        name: "About",
        component: () => import("@/modules/home/views/About.vue"),
      },
      {
        path: "/pledge",
        name: "PledgeForm",
        component: () =>
          import("@/modules/home/components/landinghome/PledgeForm.vue"),
      },
      {
        path: "/login",
        name: "UserLogin",
        component: () => import("@/modules/home/views/UserLogin.vue"),
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin-portal/",
    name: "SiteAdmin",
    component: () => import("@/modules/admin/views/SiteAdmin.vue"),
    beforeEnter: () => {
      const { isUserLoggedIn } = useLoggedInUserStore();
      if (!isUserLoggedIn) {
        return "/admin-login";
      }
    },
    children: [
      {
        path: "",
        name: "AdminWelcome",
        component: () =>
          import("@/modules/admin/components/siteadmin/AdminWelcome.vue"),
      },
      {
        path: "district-form/:districtId?",
        name: "DistrictAddEdit",
        component: () => import("@/components/forms/DistrictForm.vue"),
        props: true,
      },
      {
        path: "user-form/:userId?",
        name: "UserAddEdit",
        component: () => import("@/components/forms/UserForm.vue"),
        props: true,
      },
      {
        path: "club-form/:clubId?",
        name: "ClubAddEdit",
        component: () => import("@/components/forms/ClubForm.vue"),
        props: true,
      },
      {
        path: "district-clubs",
        name: "ClubsAdmin",
        component: () => import("@/modules/admin/views/ClubsAdmin.vue"),
      },
      {
        path: "club-members",
        name: "ClubMembers",
        component: () =>
          import("@/modules/admin/components/club/ClubMembersTable.vue"),
      },
      {
        path: "district",
        name: "District",
        component: () => import("@/modules/admin/views/District.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/modules/admin/views/Settings.vue"),
      },
      {
        path: "club",
        name: "Club",
        component: () => import("@/modules/admin/views/Club.vue"),
      },
      {
        path: "profile",
        name: "MyProfile",
        component: () => import("@/modules/admin/views/MyProfile.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
  routes,
});

export default router;
