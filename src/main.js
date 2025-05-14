import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import {Button, Card, Image, SelectButton, Toolbar, InputText, DataTable, Column} from 'primevue'

import Material from '@primevue/themes/material'
import i18n from './i18n.js'
import router from './router'
import 'primeicons/primeicons.css'

const app = createApp(App)
app
    .use(PrimeVue, {theme: {
        preset: Material,
            options: {
            darkModeSelector: 'system',
            }
        }
    })
    .component('pv-button', Button)
    .component('pv-card',Card)
    .component('pv-select-button', SelectButton)
    .component('pv-toolbar', Toolbar)
    .component('pv-image', Image)
    .component('pv-input-text', InputText)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .use(i18n)
    .use(router)
    .mount('#app')