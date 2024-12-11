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
    path: "/subscribe",
    name: "ClubNotSubscribed",
    component: () => import("@/modules/home/views/ClubNotSubscribed.vue"),
  },
  {
    path: "/admin-login",
    name: "AdminLoginForm",
    component: () => import("@/modules/admin/views/AdminLoginForm.vue"),
  },
  {
    path: "/subscriptions/privacy-policy",
    name: "SubscriptionsPrivacyPolicy",
    component: () => import("@/components/modal/Generic-Html.vue"),
  },
  {
    path: "/subscriptions/terms-of-service",
    name: "TermsOfService",
    component: () => import("@/components/modal/Generic-Html.vue"),
  },
  // Landing Routes
  {
    path: "/",
    name: "Landing-Page",
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
        path: "/contact",
        name: "Contact",
        component: () => import("@/modules/home/views/Contact.vue"),
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
      {
        path: "/stats",
        name: "Stats",
        component: () => import("@/modules/home/views/Stats.vue"),
      },
      {
        path: "club/:projectId?",
        name: "ClubProjectFormView",
        component: () => import("@/components/forms/ClubProjectForm.vue"),
        props: true,
      },
      {
        path: "simplified/:projectId?",
        name: "SimplifiedProjectFormView",
        component: () => import("@/components/forms/SimplifiedProjectForm.vue"),
        props: true,
      },
      {
        path: "matching/:projectId?",
        name: "MatchingProjectFormView",
        component: () => import("@/components/forms/MatchingProjectForm.vue"),
        props: true,
      },
      {
        path: "/about",
        name: "About",
        component: () => import("@/modules/home/views/About.vue"),
      },
      {
        path: "/privacy-policy",
        name: "PrivacyPolicy",
        component: () => import("@/modules/home/views/PrivacyPolicy.vue"),
      },
      {
        path: "/terms-and-conditions",
        name: "TermsAndConditions",
        component: () => import("@/modules/home/views/TermsAndConditions.vue"),
      },
      {
        path: "/create-account",
        name: "CreateAccount",
        component: () => import("@/modules/home/views/CreateAccount.vue"),
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin-portal",
    name: "SiteAdmin",
    component: () => import("@/modules/admin/views/SiteAdmin.vue"),
    beforeEnter: () => {
      const store = useLoggedInUserStore();
      if (!store.$state.isUserLoggedIn) {
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
        path: "club-project-form/:projectId?",
        name: "ClubProjectForm",
        component: () => import("@/components/forms/ClubProjectForm.vue"),
        props: true,
      },
      {
        path: "simplified-project-form/:projectId?",
        name: "SimplifiedProjectForm",
        component: () => import("@/components/forms/SimplifiedProjectForm.vue"),
        props: true,
      },
      {
        path: "matching-project-form/:projectId?",
        name: "MatchingProjectForm",
        component: () => import("@/components/forms/MatchingProjectForm.vue"),
        props: true,
      },
      {
        path: "my-projects",
        name: "MyProjects",
        component: () => import("@/modules/admin/views/MyProjects.vue"),
      },
      {
        path: "approvals",
        name: "Approvals",
        component: () => import("@/modules/admin/views/Approvals.vue"),
      },
      {
        path: "prospect-users",
        name: "ProspectUsers",
        component: () => import("@/modules/admin/views/ProspectUsers.vue"),
      },
      {
        path: "/prospect-userform/:userId",
        name: "ProspectUserForm",
        component: () => import("@/components/forms/ProspectUserForm.vue"),
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
      {
        path: "super-admin",
        name: "SuperAdmin",
        component: () => import("@/modules/admin/views/SuperAdmin.vue"),
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
