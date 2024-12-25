import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)

app.mount('#app')
