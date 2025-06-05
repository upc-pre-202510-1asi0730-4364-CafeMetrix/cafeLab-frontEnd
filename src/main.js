import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'
import { Button, Card, Image, SelectButton, Toolbar } from 'primevue'
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
    .use(i18n)
    .mount('#app') //
