import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'
import { Button, Card, Image, SelectButton, Toolbar, 
    DataTable, Column, Dialog, InputText, Dropdown, Toast, 
    TabView, TabPanel, Calendar, Slider, ProgressSpinner } from 'primevue'
import Material from '@primevue/themes/material'
import i18n from './i18n.js'
import 'primeicons/primeicons.css'

const app = createApp(App)

app
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Material,
            options: {
                darkModeSelector: 'system',
            },
        },
    })
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .component('pv-toolbar', Toolbar)
    .component('pv-image', Image)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-dialog', Dialog)
    .component('pv-inputtext', InputText)
    .component('pv-dropdown', Dropdown)
    .component('pv-toast', Toast)
    .component('pv-tabview', TabView)
    .component('pv-tabpanel', TabPanel)
    .component('pv-calendar', Calendar)
    .component('pv-slider', Slider)
    .component('pv-progress-spinner', ProgressSpinner)
    .component('pv-input-text', InputText)
    .use(i18n)
    .mount('#app') //