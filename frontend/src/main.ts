import "@/assets/styles.scss";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-blue/theme.css";

import App from "@/App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.component("Toast", Toast);
app.mount("#app");
