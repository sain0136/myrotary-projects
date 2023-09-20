import "@/assets/styles.scss";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-blue/theme.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "@/App.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.component("Toast", Toast);
app.mount("#app");
