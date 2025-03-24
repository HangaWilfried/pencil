import { createApp } from "vue";

import "./style.css";
import App from "./App.vue";
import router from "@/router";

import 'vue3-toastify/dist/index.css';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

const app = createApp(App);
app.use(router);
app.use(Vue3Toastify, { autoClose: 1000 } as ToastContainerOptions);

app.mount("#app");
