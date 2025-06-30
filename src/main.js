import { createApp } from 'vue'
import './style.css'
import i18n from './i18n.js'
import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import Material from '@primevue/themes/material'
import {
    Button,
    Card,
    Column,
    DataTable,
    Dialog,
    Image,
    SelectButton,
    FloatLabel,
    Toolbar,
    InputText,
    Password
} from 'primevue'
import router from "./router/index.js";
import App from './App.vue'

const app = createApp(App)
app
    .use(i18n)
    .use(PrimeVue, {theme: {preset: Material, options: {darkModeSelector: 'system',}}})
    .component('pv-button',         Button)
    .component('pv-card',           Card)
    .component('pv-column',         Column)
    .component('pv-data-table',     DataTable)
    .component('pv-dialog',         Dialog)
    .component('pv-select-button',  SelectButton)
    .component('pv-float-label',    FloatLabel)
    .component('pv-toolbar',        Toolbar)
    .component('pv-image',          Image)
    .component('pv-input-text',     InputText)
    .component('pv-password',       Password)
    .component('Button', Button)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .use(router)
    .mount('#app')
