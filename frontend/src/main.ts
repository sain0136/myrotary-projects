import ToastService from "primevue/toastservice";
import VueSocialSharing from "vue-social-sharing";
import Toast from "primevue/toast";
import Tooltip from 'primevue/tooltip';
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-blue/theme.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@/assets/styles.scss";
import Image from 'primevue/image';


import App from "@/App.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.directive('tooltip', Tooltip);
app.use(VueSocialSharing);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.component('Image', Image);
app.component("Toast", Toast);
app.mount("#app");
